// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { CounterHook } from "../src/CounterHook.sol";
import { FFIHelper } from "./FFIHelper.sol";
import { console } from "forge-std/Test.sol";
import { MockERC20 } from "solmate/src/test/utils/mocks/MockERC20.sol";
import { IHooks } from "v4-core/interfaces/IHooks.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { LPFeeLibrary } from "v4-core/libraries/LPFeeLibrary.sol";
import { Currency } from "v4-core/types/Currency.sol";
import { PoolKey } from "v4-core/types/PoolKey.sol";

/// @notice Scripts to intialize pool
contract IntializePool is FFIHelper {

  IPoolManager manager;
  IHooks hook;
  Currency currency0;
  Currency currency1;
  PoolKey key;
  uint24 FEE = LPFeeLibrary.DYNAMIC_FEE_FLAG;
  int24 TICK_SPACING = 60;

  function setUp() public {
    manager = _getDeployedPoolManager();
    hook = _getDeployedHook();
    console.log(address(manager));
    console.log(address(hook));
  }

  function run() public {
    vm.startBroadcast();

    intilizePool();

    vm.stopBroadcast();
  }

  function intilizePool() public {
    /// @dev deploy tokens
    MockERC20 jpt = new MockERC20("Jackpot Chips", "JCP", 18);
    MockERC20 ltt = new MockERC20("Lottery Token", "LTT", 18);

    /// @dev set currency0 and currency1 order
    if (jpt < ltt) {
      currency0 = Currency.wrap(address(jpt));
      currency1 = Currency.wrap(address(ltt));
    } else {
      currency0 = Currency.wrap(address(ltt));
      currency1 = Currency.wrap(address(jpt));
    }

    /// @dev set poolkey
    key = PoolKey(currency0, currency1, FEE, TICK_SPACING, hook);

    /// @dev initialize pool
    uint160 sqrtPriceX96 = 81233731461783161732293370115; // 1_500
    manager.initialize(key, sqrtPriceX96);
  }

}
