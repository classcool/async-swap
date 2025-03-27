// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { CSMM } from "../src/CSMM.sol";
import { SetupDeploy } from "./SetupDeploy.sol";
import { console } from "forge-std/Test.sol";
import { Currency, IHooks, IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { PoolSwapTest } from "v4-core/test/PoolSwapTest.sol";
import { CurrencyLibrary } from "v4-core/types/Currency.sol";
import { PoolKey } from "v4-core/types/PoolKey.sol";

/// @title A Test contract
/// @notice CSMM tests
contract CsmmTest is SetupDeploy {

  using CurrencyLibrary for Currency;

  PoolSwapTest router;
  address user = makeAddr("user");

  function setUp() public override {
    super.setUp();
    router = new PoolSwapTest(manager);
    topUp(user);
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

  function testFuzzAsyncSwapOrder(bool zeroForOne, int256 amount, bool settleUsingBurn) public userAction {
    vm.assume(amount >= 1);
    vm.assume(amount <= 1 ether);
    vm.assume(settleUsingBurn == false);

    uint256 balance0Before = manager.balanceOf(address(hook), currency0.toId());
    uint256 balance1Before = manager.balanceOf(address(hook), currency0.toId());

    uint256 userCurrency0Balance = currency0.balanceOf(user);
    uint256 userCurrency1Balance = currency1.balanceOf(user);

    IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
      zeroForOne: zeroForOne,
      amountSpecified: -int256(amount),
      sqrtPriceLimitX96: uint160(2 ** 96 + 1)
    });
    PoolSwapTest.TestSettings memory testSettings =
      PoolSwapTest.TestSettings({ takeClaims: false, settleUsingBurn: settleUsingBurn });

    bytes memory hookData =
      abi.encode(CSMM.AsyncOrder({ poolId: poolId, owner: user, zeroForOne: zeroForOne, amountIn: amount }));

    if (zeroForOne) {
      token0.approve(address(router), uint256(amount));
    } else {
      token1.approve(address(router), uint256(amount));
    }

    router.swap(key, params, testSettings, hookData);

    if (zeroForOne) {
      assertEq(currency0.balanceOf(user), userCurrency0Balance - uint256(amount));
      assertEq(currency1.balanceOf(user), userCurrency1Balance);
    } else {
      assertEq(currency1.balanceOf(user), userCurrency1Balance - uint256(amount));
      assertEq(currency0.balanceOf(user), userCurrency0Balance);
    }

    if (zeroForOne) {
      assertEq(manager.balanceOf(address(hook), currency0.toId()), balance0Before + uint256(amount));
    } else {
      assertEq(manager.balanceOf(address(hook), currency1.toId()), balance1Before + uint256(amount));
    }

    assertEq(hook.asyncOrders(poolId, user, zeroForOne), uint256(amount));
  }

}
