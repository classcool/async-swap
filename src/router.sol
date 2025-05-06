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
  bytes32 constant USER_LOCATION = 0x3dde20d9bf5cc25a9f487c6d6b54d3c19e3fa4738b91a7a509d4fc4180a72356;
  bytes32 constant ASYNC_FILLER_LOCATION = 0xd972a937b59dc5cb8c692dd9f211e85afa8def4caee6e05b31db0f53e16d02e0;

  constructor(IPoolManager _poolManager, IAsyncCSMM _hook) {
    poolManager = _poolManager;
    hook = _hook;
  }

  modifier onlyPoolManager() {
    require(msg.sender == address(poolManager));
    _;
  }

  function swap(IAsyncSwap.AsyncOrder calldata order, bytes memory userData) external {
    address onBehalf = address(this);
    IAsyncCSMM.UserParams memory userParams = abi.decode(userData, (IAsyncCSMM.UserParams));
    require(userParams.executor == address(this), "Use router as your executor!");
    assembly ("memory-safe") {
      tstore(USER_LOCATION, caller())
      tstore(ASYNC_FILLER_LOCATION, onBehalf)
    }

    poolManager.unlock(abi.encode(SwapCallback(ActionType.Swap, order)));
  }

  function fillOrder(IAsyncSwap.AsyncOrder calldata order, bytes calldata) external {
    address onBehalf = address(this);
    assembly ("memory-safe") {
      tstore(USER_LOCATION, caller())
      tstore(ASYNC_FILLER_LOCATION, onBehalf)
    }

    poolManager.unlock(abi.encode(SwapCallback(ActionType.FillOrder, order)));
  }

  /// @notice Handles callback data from PoolManager.unlock()
  /// @notice Hook will process user calling the hook directly to add liquidity, swap, or fill async transactions
  /// @notice PoolManager calls after implementation of router.addLiquidity() and router.swap()
  function unlockCallback(bytes calldata data) external onlyPoolManager returns (bytes memory) {
    uint8 action;
    address user;
    address asyncFiller;

    assembly ("memory-safe") {
      tstore(ACTION_LOCATION, calldataload(0x44))
      action := tload(ACTION_LOCATION)
      user := tload(USER_LOCATION)
      asyncFiller := tload(ASYNC_FILLER_LOCATION)
    }

    /// @dev Handle Swap
    /// @dev process ActionType.Swap
    if (action == 0) {
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
    }

    /// @notice Handle Async Order Fill
    /// @dev FillingOrder
    if (action == 1) {
      SwapCallback memory orderData = abi.decode(data, (SwapCallback));
      Currency currency = orderData.order.zeroForOne ? orderData.order.key.currency1 : orderData.order.key.currency0;
      assert(IERC20Minimal(Currency.unwrap(currency)).transferFrom(user, asyncFiller, orderData.order.amountIn));
      assert(IERC20Minimal(Currency.unwrap(currency)).approve(address(hook), orderData.order.amountIn));
      hook.executeOrder(orderData.order, abi.encode(asyncFiller));
    }

    return "";
  }

}
