// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { AsyncCSMM } from "../src/AsyncCSMM.sol";
import { IAsyncSwap } from "../src/interfaces/IAsyncSwap.sol";
import { IRouter } from "../src/interfaces/IRouter.sol";
import { SetupHook } from "./SetupHook.sol";
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

  modifier userAction() {
    vm.startPrank(user);
    _;
    vm.stopPrank();
  }

  function topUp(address _user, uint256 amount) public ownerAction {
    token0.transfer(_user, amount);
    token1.transfer(_user, amount);
  }

  function testAsyncSwap() public {
    uint256 balance0Before = currency0.balanceOf(user);
    uint256 balance1Before = currency1.balanceOf(user);

    // Perform a test swap //
    uint256 amount = 1e18;
    bool zeroForOne = true;
    vm.startPrank(user);
    if (zeroForOne) {
      token0.approve(address(router), amount);
    } else {
      token1.approve(address(router), amount);
    }

    IAsyncSwap.AsyncOrder memory order =
      IAsyncSwap.AsyncOrder({ key: key, owner: user, zeroForOne: zeroForOne, amountIn: amount, sqrtPrice: 2 ** 96 });

    router.swap(order, abi.encode(user, asyncFiller));
    vm.stopPrank();
    // ------------------- //

    uint256 balance0After = currency0.balanceOf(user);
    uint256 balance1After = currency1.balanceOf(user);

    // user paid token0
    assertEq(balance0Before - balance0After, amount);

    // user did not recieve token1 (AsyncSwap)
    assertEq(balance1Before, balance1After);

    // user received a claimable balance
    assertEq(hook.asyncOrders(poolId, user, zeroForOne), amount);

    // check executor
    assertEq(hook.setExecutor(user, asyncFiller), true);

    balance0Before = currency0.balanceOf(user2);
    balance1Before = currency1.balanceOf(user2);

    vm.startPrank(user2);
    // User 2 does not event need to add liquidity to fill user 1's async order
    // token0.approve(address(hook), amount);
    // token1.approve(address(hook), amount);
    // router.addLiquidity(key, amount, amount);

    // User 2 (LP) decides to fill user 1's order using router
    if (zeroForOne) {
      token1.approve(address(router), amount);
    } else {
      token0.approve(address(router), amount);
    }
    router.fillOrder(order, abi.encode(asyncFiller));
    vm.stopPrank();

    balance0After = currency0.balanceOf(user2);
    balance1After = currency1.balanceOf(user2);

    // user 2 balance 0 remained the same
    assertEq(balance0Before, balance0After);
    // user 2 balance increased
    assertEq(balance1Before - balance1After, amount);

    // user can: 
    assertEq(hook.asyncOrders(poolId, user, zeroForOne), 0);
    if (zeroForOne) {
      assertEq(manager.balanceOf(user, currency0.toId()), uint256(amount));
    } else {
      assertEq(manager.balanceOf(user, currency1.toId()), uint256(amount));
    }
  }

  function testFuzzAsyncSwapOrder(bool zeroForOne, uint256 amount, bool settleUsingBurn) public userAction {
    vm.assume(amount >= 1);
    vm.assume(amount <= 1 ether);
    vm.assume(settleUsingBurn == false);

    uint256 balance0Before = manager.balanceOf(address(hook), currency0.toId());
    uint256 balance1Before = manager.balanceOf(address(hook), currency0.toId());

    uint256 userCurrency0Balance = currency0.balanceOf(user);
    uint256 userCurrency1Balance = currency1.balanceOf(user);
    if (zeroForOne) {
      token0.approve(address(router), amount);
    } else {
      token1.approve(address(router), amount);
    }

    IAsyncSwap.AsyncOrder memory order =
      IAsyncSwap.AsyncOrder({ key: key, owner: user, zeroForOne: zeroForOne, amountIn: amount, sqrtPrice: 2 ** 96 });

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
