// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { AsyncCSMM } from "../src/AsyncCSMM.sol";
import { Router } from "../src/router.sol";
import { FFIHelper } from "./FFIHelper.sol";
import { console } from "forge-std/Test.sol";
import { IERC20Minimal } from "v4-core/interfaces/external/IERC20Minimal.sol";
import { Currency } from "v4-core/types/Currency.sol";
import { PoolKey } from "v4-core/types/PoolKey.sol";

contract AddLiquidityScript is FFIHelper {

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
    key = _getPoolKey();
  }

  function run() public {
    vm.startBroadcast(OWNER);

    uint256 amount0 = 100;
    uint256 amount1 = 100;

    IERC20Minimal(Currency.unwrap(key.currency0)).approve(address(hook), amount0);
    IERC20Minimal(Currency.unwrap(key.currency1)).approve(address(hook), amount1);

    router.addLiquidity(key, amount0, amount1);

    vm.stopBroadcast();
  }

}
