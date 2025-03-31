// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { IAsyncCSMM } from "./interfaces/IAsyncCSMM.sol";
import { IAsyncSwap } from "./interfaces/IAsyncSwap.sol";
import { IRouter } from "./interfaces/IRouter.sol";
import { CurrencySettler } from "@uniswap/v4-core/test/utils/CurrencySettler.sol";
import { console } from "forge-std/Test.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { IERC20Minimal } from "v4-core/interfaces/external/IERC20Minimal.sol";
import { SafeCast } from "v4-core/libraries/SafeCast.sol";
import { Currency, CurrencyLibrary } from "v4-core/types/Currency.sol";
import { PoolKey } from "v4-core/types/PoolKey.sol";

/// @dev Custom Router for Async CSMM contract
contract Router is IRouter {

  using CurrencySettler for Currency;
  using CurrencyLibrary for Currency;
  using SafeCast for *;

  IPoolManager immutable poolManager;
  IAsyncCSMM immutable hook;

  // keccak256("Router.ActionType") - 1;
  bytes32 constant ACTION_LOCATION = 0xf3b150ebf41dad0872df6788629edb438733cb4a5c9ea779b1b1f3614faffc69;
  // keccak256("Router.User") - 1;
  bytes32 constant USSR_LOCATION = 0x3dde20d9bf5cc25a9f487c6d6b54d3c19e3fa4738b91a7a509d4fc4180a72356;
  bytes32 constant ASYNC_Filler_LOCATION = 0xd972a937b59dc5cb8c692dd9f211e85afa8def4caee6e05b31db0f53e16d02e0;

  constructor(IPoolManager _poolManager, IAsyncCSMM _hook) {
    poolManager = _poolManager;
    hook = _hook;
  }

  modifier onlyPoolManager() {
    require(msg.sender == address(poolManager));
    _;
  }

  function swap(IAsyncSwap.AsyncOrder calldata order, bytes memory userData) external {
    IAsyncCSMM.UserParams memory user = abi.decode(userData, (IAsyncCSMM.UserParams));
    address executor = user.executor;
    assembly ("memory-safe") {
      tstore(USSR_LOCATION, caller())
      tstore(ASYNC_Filler_LOCATION, executor)
    }

    poolManager.unlock(abi.encode(SwapCallback(ActionType.Swap, order)));
  }

  function addLiquidity(PoolKey calldata key, uint256 amount0, uint256 amount1) external {
    assembly ("memory-safe") {
      tstore(USSR_LOCATION, caller())
    }
    poolManager.unlock(
      abi.encode(
        LiquidityCallback(ActionType.Liquidity, IAsyncCSMM.CSMMLiquidityParams(key, msg.sender, amount0, amount1))
      )
    );
  }

  function fillOrder(IAsyncSwap.AsyncOrder calldata order, bytes calldata userData) external {
    address onBehalf = address(this);
    assembly ("memory-safe") {
      tstore(USSR_LOCATION, caller())
      tstore(ASYNC_Filler_LOCATION, onBehalf)
    }

    poolManager.unlock(abi.encode(SwapCallback(ActionType.FillOrder, order)));
  }

  /// @notice Handles callback data from PoolManager.unlock()
  /// @notice Hook will process user calling the hook directly to add liquidity
  /// @notice PoolManager calls after implementation of router.addLiquidity() and router.swap()
  function unlockCallback(bytes calldata data) external onlyPoolManager returns (bytes memory) {
    bytes32 action;
    address user;
    address asyncFiller;

    assembly ("memory-safe") {
      tstore(ACTION_LOCATION, calldataload(0x44))
      action := tload(ACTION_LOCATION)
      user := tload(USSR_LOCATION)
      asyncFiller := tload(ASYNC_Filler_LOCATION)
    }

    /// @notice Handle Async Order Fill
    /// @dev FillingOrder
    if (action == bytes32(uint256(2))) {
      SwapCallback memory orderData = abi.decode(data, (SwapCallback));
      Currency currency = orderData.order.zeroForOne ? orderData.order.key.currency1 : orderData.order.key.currency0;
      assert(IERC20Minimal(Currency.unwrap(currency)).transferFrom(user, asyncFiller, orderData.order.amountIn));
      assert(IERC20Minimal(Currency.unwrap(currency)).approve(address(hook), orderData.order.amountIn));
      hook.executeOrder(orderData.order, abi.encode(asyncFiller));
    }

    /// @dev Handle Swap
    /// @dev process ActionType.Swap
    if (action == bytes32(uint256(1))) {
      SwapCallback memory orderData = abi.decode(data, (SwapCallback));

      poolManager.swap(
        orderData.order.key,
        IPoolManager.SwapParams(
          orderData.order.zeroForOne, -orderData.order.amountIn.toInt256(), orderData.order.sqrtPrice
        ),
        abi.encode(user, asyncFiller)
      );
      Currency specified = orderData.order.zeroForOne ? orderData.order.key.currency0 : orderData.order.key.currency1;
      specified.settle(poolManager, user, orderData.order.amountIn, false); // transfer
      return "";
    }

    /// @notice Handle Add LLquidity
    /// @dev process ActionType.Liquidity
    if (action == bytes32(0)) {
      LiquidityCallback memory orderData = abi.decode(data, (LiquidityCallback));
      hook.addLiquidity(orderData.csmmLiq);
      return "";
    }

    return "";
  }

}
