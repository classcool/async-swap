// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { IAsyncCSMM } from "./interfaces/IAsyncCSMM.sol";
import { IAsyncSwap } from "./interfaces/IAsyncSwap.sol";
import { IRouter } from "./interfaces/IRouter.sol";
import { CurrencySettler } from "@uniswap/v4-core/test/utils/CurrencySettler.sol";
import { console } from "forge-std/Test.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { SafeCast } from "v4-core/libraries/SafeCast.sol";
import { Currency } from "v4-core/types/Currency.sol";
import { PoolKey } from "v4-core/types/PoolKey.sol";

contract Router is IRouter {

  using CurrencySettler for Currency;
  using SafeCast for *;

  IPoolManager immutable poolManager;
  IAsyncCSMM immutable hook;

  // keccak256("Router.ActionType") - 1;
  bytes32 constant ACTION_LOCATION = 0xf3b150ebf41dad0872df6788629edb438733cb4a5c9ea779b1b1f3614faffc69;
  // keccak256("msg.sender") - 1;
  bytes32 constant MSG_SENDER = 0xb2f2618cecbbb6e7468cc0f2aa43858ad8d153e0280b22285e28e853bb9d4539;

  constructor(IPoolManager _poolManager, IAsyncCSMM _hook) {
    poolManager = _poolManager;
    hook = _hook;
  }

  modifier onlyPoolManager() {
    require(msg.sender == address(poolManager));
    _;
  }

  function swap(IAsyncSwap.AsyncOrder calldata order, bytes memory routerParams) external {
    assembly ("memory-safe") {
      tstore(MSG_SENDER, caller())
    }

    poolManager.unlock(abi.encode(IRouter.SwapCallback(ActionType.Swap, order)));
  }

  function addLiquidity(PoolKey calldata key, uint256 amountEach) external {
    assembly ("memory-safe") {
      tstore(MSG_SENDER, caller())
    }
    poolManager.unlock(
      abi.encode(LiquidityCallback(ActionType.Liquidity, IAsyncCSMM.CSMMLiquidityParams(key, msg.sender, amountEach)))
    );
  }

  /// @notice Handles callback data from PoolManager.unlock()
  /// @notice Hook will process user calling the hook directly to add liquidity
  /// @notice PoolManager calls after implementation of router.addLiquidity() and router.swap()
  function unlockCallback(bytes calldata data) external onlyPoolManager returns (bytes memory) {
    bytes32 action;
    address user;

    assembly ("memory-safe") {
      tstore(ACTION_LOCATION, calldataload(0x44))
      action := tload(ACTION_LOCATION)
      user := tload(MSG_SENDER)
    }
    assembly { }

    /// @dev process ActionType.Swap
    if (action == bytes32(uint256(1))) {
      SwapCallback memory orderData = abi.decode(data, (SwapCallback));

      poolManager.swap(
        orderData.order.key,
        IPoolManager.SwapParams(
          orderData.order.zeroForOne, -orderData.order.amountIn.toInt256(), orderData.order.sqrtPrice
        ),
        abi.encode(user)
      );
      Currency specified = orderData.order.zeroForOne ? orderData.order.key.currency0 : orderData.order.key.currency1;
      specified.settle(poolManager, user, orderData.order.amountIn, false); // transfer
      return "";
    }

    // console.logBytes32(start);
    // console.logBytes32(action);
    /// @dev process ActionType.Liquidity
    if (action == bytes32(0)) {
      LiquidityCallback memory orderData = abi.decode(data, (LiquidityCallback));
      hook.addLiquidity(orderData.csmmLiq);
      return "";
    }

    // 0000000000000000000000000000000000000000000000000000000000000001 action
    // 0000000000000000000000001240fa2a84dd9157a0e76b5cfe98b1d52268b264 Currency0
    // 000000000000000000000000ff2bd636b9fc89645c2d336aeade2e4abafe1ea5 Currency1
    // 00000000000000000000000000000000000000000000000000000000000003e8 fee
    // 0000000000000000000000000000000000000000000000000000000000000001 tickSpacing
    // 0000000000000000000000000000000000000000000000000000000000000888 hook
    // 0000000000000000000000007fa9385be102ac3eac297483dd6233d62b3e1496 msg.sender
    // 0000000000000000000000000000000000000000000000000000000000000001 zeroForOne
    // fffffffffffffffffffffffffffffffffffffffffffffffff21f494c589c0000 amountSpecified
    // 0000000000000000000000000000000000000001000000000000000000000000 sqrtPrice
    // 000000000000000000000000ae0bdc4eeac5e950b67c6819b118761caaf61946 executor

    return "";
  }

}
