// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.26;

import { CurrencySettler } from "@uniswap/v4-core/test/utils/CurrencySettler.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { Hooks } from "v4-core/libraries/Hooks.sol";
import { BeforeSwapDelta, toBeforeSwapDelta } from "v4-core/types/BeforeSwapDelta.sol";
import { Currency } from "v4-core/types/Currency.sol";
import { PoolKey } from "v4-core/types/PoolKey.sol";
import { BaseHook } from "v4-periphery/src/utils/BaseHook.sol";

/// @title Remittance CSMM
/// @notice A NoOp hook that mints 1:1 tokens
contract RemittanceCSMM is BaseHook {

  using CurrencySettler for Currency;

  error AddLiquidityThroughHook();

  constructor(IPoolManager poolManager) BaseHook(poolManager) { }

  function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
    return Hooks.Permissions({
      beforeInitialize: false,
      afterInitialize: false,
      beforeAddLiquidity: true, // Don't allow adding liquidity normally
      afterAddLiquidity: false,
      beforeRemoveLiquidity: false,
      afterRemoveLiquidity: false,
      beforeSwap: true, // Override how swaps are done
      afterSwap: false,
      beforeDonate: false,
      afterDonate: false,
      beforeSwapReturnDelta: true, // Allow beforeSwap to return a custom delta
      afterSwapReturnDelta: false,
      afterAddLiquidityReturnDelta: false,
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

  /// @notice Custom add liquidity function
  function addLiquidity(PoolKey calldata key, uint256 amountEach) external {
    // TODO
  }
  function _beforeSwap(address, PoolKey calldata key, IPoolManager.SwapParams calldata params, bytes calldata)
    internal
    override
    returns (bytes4, BeforeSwapDelta, uint24)
  {
    // TODO
  }

}
