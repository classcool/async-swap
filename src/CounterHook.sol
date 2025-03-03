// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { Hooks } from "v4-core/libraries/Hooks.sol";
import { BalanceDelta, BalanceDeltaLibrary } from "v4-core/types/BalanceDelta.sol";
import { BeforeSwapDelta } from "v4-core/types/BeforeSwapDelta.sol";
import { Currency, CurrencyLibrary } from "v4-core/types/Currency.sol";
import { PoolKey } from "v4-core/types/PoolKey.sol";
import { BaseHook } from "v4-periphery/src/utils/BaseHook.sol";

/// @title A hook contract example
/// @notice Simple hook contract that emits events
contract CounterHook is BaseHook {

  using CurrencyLibrary for Currency;
  using BalanceDeltaLibrary for BalanceDelta;

  event BeforeInitialize();
  event AfterInitialize();
  event BeforeAddLiquidity();
  event BeforeRemoveLiquidity();
  event AfterAddLiquidity();
  event AfterRemoveLiquidity();
  event BeforeSwap();
  event AfterSwap();
  event BeforeDonate();
  event AfterDonate();

  constructor(IPoolManager _manager) BaseHook(_manager) { }

  /// @notice Returns activate hook flags
  /// @inheritdoc BaseHook
  function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
    return Hooks.Permissions({
      beforeInitialize: true,
      afterInitialize: true,
      beforeAddLiquidity: true,
      beforeRemoveLiquidity: true,
      afterAddLiquidity: true,
      afterRemoveLiquidity: true,
      beforeSwap: true,
      afterSwap: true,
      beforeDonate: true,
      afterDonate: true,
      beforeSwapReturnDelta: true,
      afterSwapReturnDelta: true,
      afterAddLiquidityReturnDelta: true,
      afterRemoveLiquidityReturnDelta: true
    });
  }

  function _beforeInitialize(address sender, PoolKey calldata key, uint160 sqrtPriceX96)
    internal
    override
    returns (bytes4)
  {
    sender;
    key;
    sqrtPriceX96;
    emit BeforeInitialize();
    return (this.beforeInitialize.selector);
  }

  function _afterInitialize(address sender, PoolKey calldata key, uint160 sqrtPriceX96, int24 tick)
    internal
    override
    returns (bytes4)
  {
    sender;
    key;
    sqrtPriceX96;
    tick;
    emit AfterInitialize();
    return (this.afterInitialize.selector);
  }

  function _beforeSwap(
    address sender,
    PoolKey calldata key,
    IPoolManager.SwapParams calldata swapParams,
    bytes calldata hookData
  ) internal override returns (bytes4, BeforeSwapDelta, uint24 fee) {
    emit BeforeSwap();
    sender;
    key;
    swapParams;
    hookData;
    return (this.beforeSwap.selector, BeforeSwapDelta.wrap(0), 0);
  }

  function _afterSwap(
    address sender,
    PoolKey calldata key,
    IPoolManager.SwapParams calldata swapParams,
    BalanceDelta delta,
    bytes calldata hookData
  ) internal override returns (bytes4, int128) {
    sender;
    key;
    swapParams;
    delta;
    hookData;
    emit AfterSwap();
    return (this.afterSwap.selector, 0);
  }

  function _beforeAddLiquidity(
    address sender,
    PoolKey calldata key,
    IPoolManager.ModifyLiquidityParams calldata liquidityParams,
    bytes calldata hookData
  ) internal override returns (bytes4) {
    sender;
    key;
    liquidityParams;
    hookData;
    emit BeforeAddLiquidity();
    return (this.beforeAddLiquidity.selector);
  }

  function _beforeRemoveLiquidity(
    address sender,
    PoolKey calldata key,
    IPoolManager.ModifyLiquidityParams calldata liquidityParams,
    bytes calldata hookData
  ) internal override returns (bytes4) {
    sender;
    key;
    liquidityParams;
    hookData;
    emit BeforeRemoveLiquidity();
    return (this.beforeRemoveLiquidity.selector);
  }

  function _afterAddLiquidity(
    address sender,
    PoolKey calldata key,
    IPoolManager.ModifyLiquidityParams calldata liquidityParams,
    BalanceDelta delta,
    BalanceDelta feeAccrued,
    bytes calldata hookData
  ) internal override returns (bytes4, BalanceDelta) {
    sender;
    key;
    liquidityParams;
    delta;
    feeAccrued;
    hookData;
    emit AfterAddLiquidity();
    return (this.afterAddLiquidity.selector, delta);
  }

  function _afterRemoveLiquidity(
    address sender,
    PoolKey calldata key,
    IPoolManager.ModifyLiquidityParams calldata liquidityParams,
    BalanceDelta delta,
    BalanceDelta feeAccrued,
    bytes calldata hookData
  ) internal override returns (bytes4, BalanceDelta) {
    sender;
    key;
    liquidityParams;
    delta;
    feeAccrued;
    hookData;
    emit AfterRemoveLiquidity();
    return (this.afterRemoveLiquidity.selector, delta);
  }

  function _beforeDonate(
    address sender,
    PoolKey calldata key,
    uint256 amount0,
    uint256 amount1,
    bytes calldata hookData
  ) internal override returns (bytes4) {
    sender;
    key;
    amount0;
    amount1;
    hookData;
    emit BeforeDonate();
    return (this.beforeDonate.selector);
  }

  function _afterDonate(address sender, PoolKey calldata key, uint256 amount0, uint256 amount1, bytes calldata hookData)
    internal
    override
    returns (bytes4)
  {
    sender;
    key;
    amount0;
    amount1;
    hookData;
    emit AfterDonate();
    return (this.afterDonate.selector);
  }

}
