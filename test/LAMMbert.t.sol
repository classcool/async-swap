// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { LAMMbert } from "../src/LAMMbert.sol";
import { SetupDeploy } from "./SetupDeploy.sol";
import { console } from "forge-std/Test.sol";
import { Currency, IHooks, IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { PoolSwapTest } from "v4-core/test/PoolSwapTest.sol";
import { CurrencyLibrary } from "v4-core/types/Currency.sol";
import { PoolKey } from "v4-core/types/PoolKey.sol";

/// @title A Test contract
/// @notice CSMM tests
contract LammTest is SetupDeploy {

  using CurrencyLibrary for Currency;

  PoolSwapTest router;
  address user = makeAddr("user");

  function setUp() public override {
    super.setUp();
    router = new PoolSwapTest(manager);
    // topUp(user);
  }

  modifier userAction() {
    vm.startPrank(user);
    _;
    vm.stopPrank();
  }

  function topUp(address _user) public ownerAction {
    token0.transfer(_user, 1 ether);
    token1.transfer(_user, 1 ether);
  }

  function testFuzzAsyncSwapOrder(bool zeroForOne, int256 amount, bool settleUsingBurn) public userAction { }

}
