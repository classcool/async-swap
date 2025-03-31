// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { AsyncCSMM } from "../src/AsyncCSMM.sol";
import { IAsyncCSMM } from "../src/interfaces/IAsyncCSMM.sol";
import { Router } from "../src/router.sol";
import { FFIHelper } from "./FFIHelper.sol";
import { console } from "forge-std/Test.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { IERC20Minimal } from "v4-core/interfaces/external/IERC20Minimal.sol";
import { IERC20Minimal } from "v4-core/interfaces/external/IERC20Minimal.sol";
import { LPFeeLibrary } from "v4-core/libraries/LPFeeLibrary.sol";
import { PoolSwapTest } from "v4-core/test/PoolSwapTest.sol";
import { Currency, CurrencyLibrary } from "v4-core/types/Currency.sol";
import { PoolId } from "v4-core/types/PoolId.sol";
import { PoolIdLibrary, PoolKey } from "v4-core/types/PoolKey.sol";

contract ExecuteAsyncOrderScript is FFIHelper {

  using CurrencyLibrary for Currency;
  using PoolIdLibrary for PoolKey;

  AsyncCSMM hook;
  PoolId poolId;
  Currency currency0;
  Currency currency1;
  PoolKey key;
  IAsyncCSMM.AsyncOrder order;
  Router router;

  function setUp() public {
    (address _hook, address _router) = _getDeployedHook();
    hook = AsyncCSMM(_hook);
    router = Router(_router);
    order = _getAsyncOrder();
    // order.sqrtPrice = 2 ** 96;
  }

  function run() public {
    vm.startBroadcast(OWNER);
    if (order.zeroForOne) {
      IERC20Minimal(Currency.unwrap(order.key.currency1)).approve(address(router), order.amountIn);
    } else {
      IERC20Minimal(Currency.unwrap(order.key.currency0)).approve(address(router), order.amountIn);
    }
    router.fillOrder(order, abi.encode(router));
    vm.stopBroadcast();
  }

}
