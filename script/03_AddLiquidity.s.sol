// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { AsyncCSMM } from "../src/AsyncCSMM.sol";
import { Router } from "../src/router.sol";
import { FFIHelper } from "./FFIHelper.sol";
import { console } from "forge-std/Test.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { IERC20Minimal } from "v4-core/interfaces/external/IERC20Minimal.sol";
import { LPFeeLibrary } from "v4-core/libraries/LPFeeLibrary.sol";
import { Currency, CurrencyLibrary } from "v4-core/types/Currency.sol";
import { PoolIdLibrary, PoolKey } from "v4-core/types/PoolKey.sol";

contract AddLiquidityScript is FFIHelper {

  using CurrencyLibrary for Currency;
  using PoolIdLibrary for PoolKey;

  AsyncCSMM hook;
  bytes32 poolId;
  Currency currency0;
  Currency currency1;
  PoolKey key;
  Router router;

  function setUp() public {
    (address _hook, address _router) = _getDeployedHook();
    hook = AsyncCSMM(_hook);
    router = Router(_router);
    uint256[] memory topics = _getPoolTopics();
    poolId = bytes32(topics[1]);
    currency0 = Currency.wrap(address(uint160(topics[2])));
    currency1 = Currency.wrap(address(uint160(topics[3])));
  }

  function run() public {
    key = PoolKey(currency0, currency1, LPFeeLibrary.DYNAMIC_FEE_FLAG, 60, hook);

    vm.startBroadcast(OWNER);

    uint256 amount = 100;

    IERC20Minimal(Currency.unwrap(currency0)).approve(address(hook), amount);
    IERC20Minimal(Currency.unwrap(currency1)).approve(address(hook), amount);

    router.addLiquidity(key, amount, amount);

    vm.stopBroadcast();
  }

}
