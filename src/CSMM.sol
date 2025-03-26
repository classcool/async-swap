// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.26;

import { Router } from "./router.sol";
import { CurrencySettler } from "@uniswap/v4-core/test/utils/CurrencySettler.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { Hooks } from "v4-core/libraries/Hooks.sol";
import { BalanceDelta, toBalanceDelta } from "v4-core/types/BalanceDelta.sol";
import { BeforeSwapDelta, toBeforeSwapDelta } from "v4-core/types/BeforeSwapDelta.sol";
import { Currency } from "v4-core/types/Currency.sol";
import { PoolId } from "v4-core/types/PoolId.sol";
import { PoolIdLibrary, PoolKey } from "v4-core/types/PoolKey.sol";
import { BaseHook } from "v4-periphery/src/utils/BaseHook.sol";

/// @title Remittance CSMM
/// @notice A NoOp hook that mints 1:1 tokens
contract CSMM is BaseHook {

  using CurrencySettler for Currency;
  using PoolIdLibrary for PoolKey;

  mapping(address user => uint256 claimable) asyncOrders;

  event BeforeAddLiquidity(PoolId poolId, address sender, BalanceDelta liquidityDelta);
  event BeforeSwap(bytes32 poolId, address owner, bool zeroForOn, int256 amountIn);

  error AddLiquidityThroughHook();

  constructor(IPoolManager poolManager) BaseHook(poolManager) { }

  function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
    return Hooks.Permissions({
      beforeInitialize: false,
      afterInitialize: false,
      beforeAddLiquidity: true, // override liquidity functionality
      afterAddLiquidity: false,
      beforeRemoveLiquidity: false,
      afterRemoveLiquidity: false,
      beforeSwap: true, // override how swaps are done async swap
      afterSwap: false,
      beforeDonate: false,
      afterDonate: false,
      beforeSwapReturnDelta: true, // allow beforeSwap to return a custom delta, for custom ordering
      afterSwapReturnDelta: false,
      afterAddLiquidityReturnDelta: false, // custom add liquidity
      afterRemoveLiquidityReturnDelta: false
    });
  }

  function _beforeAddLiquidity(address, PoolKey calldata, IPoolManager.ModifyLiquidityParams calldata, bytes calldata)
    internal
    pure
    override
    returns (bytes4)
  {
    revert AddLiquidityThroughHook();
  }

  struct CallbackData {
    uint256 amountEach;
    Currency currency0;
    Currency currency1;
    address sender;
  }

  /// @notice Custom add liquidity function
  function addLiquidity(PoolKey calldata key, uint256 amountEach) external {
    poolManager.unlock(abi.encode(CallbackData(amountEach, key.currency0, key.currency1, msg.sender)));
    emit BeforeAddLiquidity(
      key.toId(), msg.sender, toBalanceDelta(int128(int256(amountEach)), int128(int256(amountEach)))
    );
  }

  struct AsyncOrder {
    PoolId poolId;
    address owner;
    bool zeroForOne;
    int256 amountIn;
  }

  /// @dev Async swap function
  /// @dev handles exactInputIn params only
  /// @notice reference : https://github.com/haardikk21/pause-swap/blob/main/src/Hook.sol
  function _beforeSwap(
    address,
    PoolKey calldata key,
    IPoolManager.SwapParams calldata params,
    bytes calldata hookParams
  ) internal override returns (bytes4, BeforeSwapDelta, uint24) {
    bool isExactInput = params.amountSpecified < 0;
    if (!isExactInput) {
      revert("Exact output not supported");
    }

    BeforeSwapDelta beforeSwapDelta = toBeforeSwapDelta(int128(-params.amountSpecified), 0);
    uint256 amountInPositive = uint256(-params.amountSpecified);

    if (params.zeroForOne) {
      key.currency0.take(poolManager, address(this), amountInPositive, true);
    } else {
      key.currency1.take(poolManager, address(this), amountInPositive, true);
    }

    //
    AsyncOrder memory order = abi.decode(hookParams, (AsyncOrder));

    /// @dev emit event consumed by filler
    emit BeforeSwap(PoolId.unwrap(order.poolId), order.owner, order.zeroForOne, order.amountIn);

    return (this.beforeSwap.selector, beforeSwapDelta, 0);
  }

  /// @notice Settle async swaps
  /// @dev called by keeper to settle swaps and execute transation orders
  function settleAsyncSwap() external { }

  /// @notice callback from add liquidity.
  function unlockCallback(bytes calldata data) external onlyPoolManager returns (bytes memory) {
    CallbackData memory callbackData = abi.decode(data, (CallbackData));

    callbackData.currency0.settle(poolManager, callbackData.sender, callbackData.amountEach, false);
    callbackData.currency1.settle(poolManager, callbackData.sender, callbackData.amountEach, false);

    callbackData.currency0.take(poolManager, address(this), callbackData.amountEach, true);
    callbackData.currency1.take(poolManager, address(this), callbackData.amountEach, true);

    return "";
  }

}
