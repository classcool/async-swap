// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { SetupHook } from "./SetupHook.sol";
import { AsyncSwapCSMM } from "@async-swap/AsyncSwapCSMM.sol";
import { IRouter } from "@async-swap/interfaces/IRouter.sol";
import { AsyncOrder } from "@async-swap/types/AsyncOrder.sol";
import { console } from "forge-std/Test.sol";
import { Currency, IHooks, IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { PoolSwapTest } from "v4-core/test/PoolSwapTest.sol";
import { CurrencyLibrary } from "v4-core/types/Currency.sol";
import { PoolKey } from "v4-core/types/PoolKey.sol";

/// @title Async CSMM test contract
contract AsyncCsmmTest is SetupHook {

  using CurrencyLibrary for Currency;

  address asyncFiller = makeAddr("asyncFiller");
  address user = makeAddr("user");
  address user2 = makeAddr("user2");

  function setUp() public override {
    super.setUp();
    topUp(user, 1 ether);
    topUp(user2, 2 ether);
    asyncFiller = address(router);
  }

  modifier userAction(address _user) {
    vm.startPrank(_user);
    _;
    vm.stopPrank();
  }

  function topUp(address _user, uint256 amount) public ownerAction {
    token0.transfer(_user, amount);
    token1.transfer(_user, amount);
  }

  function swap(address _user, address _asyncFiller, AsyncOrder memory order) public {
    vm.startPrank(_user);
    if (order.zeroForOne) {
      token0.approve(address(router), order.amountIn);
    } else {
      token1.approve(address(router), order.amountIn);
    }
    router.swap(order, abi.encode(user, _asyncFiller));
    vm.stopPrank();
  }

  function fillOrder(address _user, AsyncOrder memory order, address _asyncFiller) public {
    vm.startPrank(_user);
    if (order.zeroForOne) {
      token1.approve(address(router), order.amountIn);
    } else {
      token0.approve(address(router), order.amountIn);
    }
    router.fillOrder(order, abi.encode(_asyncFiller));
    vm.stopPrank();
  }

  function testFuzzAsyncSwap(uint256 amount, bool zeroForOne) public {
    vm.assume(amount >= 1);
    vm.assume(amount <= 1 ether);

    AsyncOrder memory order =
      AsyncOrder({ key: key, owner: user, zeroForOne: zeroForOne, amountIn: amount, sqrtPrice: 2 ** 96 });

    uint256 balance0Before = currency0.balanceOf(user);
    uint256 balance1Before = currency1.balanceOf(user);

    // swap
    swap(user, asyncFiller, order);

    uint256 balance0After = currency0.balanceOf(user);
    uint256 balance1After = currency1.balanceOf(user);

    if (zeroForOne) {
      assertEq(balance0Before - balance0After, amount);
      assertEq(balance1Before, balance1After);
    } else {
      assertEq(balance1Before - balance1After, amount);
      assertEq(balance0Before, balance0After);
    }
    assertEq(hook.asyncOrders(poolId, user, zeroForOne), amount);
    assertEq(hook.setExecutor(user, asyncFiller), true);

    balance0Before = currency0.balanceOf(user2);
    balance1Before = currency1.balanceOf(user2);

    // fill
    fillOrder(user2, order, asyncFiller);

    balance0After = currency0.balanceOf(user2);
    balance1After = currency1.balanceOf(user2);

    if (zeroForOne) {
      assertEq(balance0Before, balance0After);
      assertEq(balance1Before - balance1After, amount);
      assertEq(hook.asyncOrders(poolId, user, zeroForOne), 0);
    } else {
      assertEq(balance1Before, balance1After);
      assertEq(balance0Before - balance0After, amount);
      assertEq(hook.asyncOrders(poolId, user, zeroForOne), 0);
    }
    if (zeroForOne) {
      assertEq(manager.balanceOf(user, currency0.toId()), uint256(amount));
    } else {
      assertEq(manager.balanceOf(user, currency1.toId()), uint256(amount));
    }
  }

  function testFuzzAsyncSwapOrder(bool zeroForOne, uint256 amount) public userAction(user) {
    vm.assume(amount >= 1);
    vm.assume(amount <= 1 ether);

    uint256 balance0Before = manager.balanceOf(address(hook), currency0.toId());
    uint256 balance1Before = manager.balanceOf(address(hook), currency0.toId());

    uint256 userCurrency0Balance = currency0.balanceOf(user);
    uint256 userCurrency1Balance = currency1.balanceOf(user);
    if (zeroForOne) {
      token0.approve(address(router), amount);
    } else {
      token1.approve(address(router), amount);
    }

    AsyncOrder memory order =
      AsyncOrder({ key: key, owner: user, zeroForOne: zeroForOne, amountIn: amount, sqrtPrice: 2 ** 96 });

    router.swap(order, abi.encode(user, asyncFiller));

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
