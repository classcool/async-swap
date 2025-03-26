// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { CSMM } from "../src/CSMM.sol";
import { FFIHelper } from "./FFIHelper.sol";
import { console } from "forge-std/Test.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { IERC20Minimal } from "v4-core/interfaces/external/IERC20Minimal.sol";
import { LPFeeLibrary } from "v4-core/libraries/LPFeeLibrary.sol";
import { PoolSwapTest } from "v4-core/test/PoolSwapTest.sol";
import { Currency, CurrencyLibrary } from "v4-core/types/Currency.sol";
import { PoolId } from "v4-core/types/PoolId.sol";
import { PoolIdLibrary, PoolKey } from "v4-core/types/PoolKey.sol";

address constant OWNER = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

contract SwapScript is FFIHelper {

  using CurrencyLibrary for Currency;
  using PoolIdLibrary for PoolKey;

  IPoolManager manager;
  CSMM hook;
  PoolId poolId;
  Currency currency0;
  Currency currency1;
  PoolKey key;
  PoolSwapTest router;

  function setUp() public {
    manager = IPoolManager(_getDeployedPoolManager());
    (address _hook, address _router) = _getDeployedHook();
    hook = CSMM(_hook);
    router = PoolSwapTest(_router);
    uint256[] memory topics = _getPoolTopics();
    poolId = PoolId.wrap(bytes32(topics[1]));
    currency0 = Currency.wrap(address(uint160(topics[2])));
    currency1 = Currency.wrap(address(uint160(topics[3])));
    key = PoolKey(currency0, currency1, LPFeeLibrary.DYNAMIC_FEE_FLAG, 60, hook);
  }

  function swap() public { }

  function run() public {
    vm.startBroadcast(OWNER);

    uint256 amount = 100;

    bool zeroForOne = false;
    if (zeroForOne) {
      IERC20Minimal(Currency.unwrap(currency0)).approve(address(router), uint256(amount));
    } else {
      IERC20Minimal(Currency.unwrap(currency1)).approve(address(router), uint256(amount));
    }
    IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
      zeroForOne: zeroForOne,
      amountSpecified: -int256(amount),
      sqrtPriceLimitX96: uint160(2 ** 96 + 1)
    });
    PoolSwapTest.TestSettings memory testSettings =
      PoolSwapTest.TestSettings({ takeClaims: false, settleUsingBurn: false });

    bytes memory hookData =
      abi.encode(CSMM.AsyncOrder({ poolId: poolId, owner: OWNER, zeroForOne: zeroForOne, amountIn: int256(amount) }));

    router.swap(key, params, testSettings, hookData);

    vm.stopBroadcast();
  }

}
