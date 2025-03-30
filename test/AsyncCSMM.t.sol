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

/// @title A Test contract
/// @notice AsyncCSMM tests
contract AsyncCsmmTest is SetupHook {

  using CurrencyLibrary for Currency;

  address user = makeAddr("user");

  function setUp() public override {
    super.setUp();
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

    IAsyncSwap.AsyncOrder memory order = IAsyncSwap.AsyncOrder({
      key: key,
      owner: user,
      zeroForOne: zeroForOne,
      amountIn: amount,
      sqrtPrice: 2 ** 96,
      executor: address(this)
    });

    router.swap(order, abi.encode(user));
    vm.stopPrank();
    // ------------------- //

    uint256 balance0After = currency0.balanceOf(user);
    uint256 balance1After = currency1.balanceOf(user);

    // user paid token0
    assertEq(balance0Before - balance0After, 1e18);

    // user did not recieve token1 (AsyncSwap)
    assertEq(balance1Before, balance1After);
  }

  function testFuzzAsyncSwapOrder(bool zeroForOne, int256 amount, bool settleUsingBurn) public userAction {
    //   vm.assume(amount >= 1);
    //   vm.assume(amount <= 1 ether);
    //   vm.assume(settleUsingBurn == false);
    //   // amount = 0xbeef;
    //   // zeroForOne = false;
    //   // settleUsingBurn = false;
    //
    //   uint256 balance0Before = manager.balanceOf(address(hook), currency0.toId());
    //   uint256 balance1Before = manager.balanceOf(address(hook), currency0.toId());
    //
    //   uint256 userCurrency0Balance = currency0.balanceOf(user);
    //   uint256 userCurrency1Balance = currency1.balanceOf(user);
    //
    //   IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
    //     zeroForOne: zeroForOne,
    //     amountSpecified: -int256(amount),
    //     sqrtPriceLimitX96: uint160(2 ** 96 + 1)
    //   });
    //   PoolSwapTest.TestSettings memory testSettings =
    //     PoolSwapTest.TestSettings({ takeClaims: false, settleUsingBurn: settleUsingBurn });
    //
    //   AsyncCSMM.AsyncOrder memory order =
    //     AsyncCSMM.AsyncOrder({ poolId: poolId, owner: user, zeroForOne: zeroForOne, amountIn: amount });
    //   bytes memory hookData = abi.encode(order);
    //
    //   if (zeroForOne) {
    //     token0.approve(address(router), uint256(amount));
    //   } else {
    //     token1.approve(address(router), uint256(amount));
    //   }
    //
    //   router.swap(key, params, testSettings, hookData);
    //
    //   if (zeroForOne) {
    //     assertEq(currency0.balanceOf(user), userCurrency0Balance - uint256(amount));
    //     assertEq(currency1.balanceOf(user), userCurrency1Balance);
    //   } else {
    //     assertEq(currency1.balanceOf(user), userCurrency1Balance - uint256(amount));
    //     assertEq(currency0.balanceOf(user), userCurrency0Balance);
    //   }
    //
    //   if (zeroForOne) {
    //     assertEq(manager.balanceOf(address(hook), currency0.toId()), balance0Before + uint256(amount));
    //   } else {
    //     assertEq(manager.balanceOf(address(hook), currency1.toId()), balance1Before + uint256(amount));
    //   }
    //
    //   assertEq(hook.asyncOrders(poolId, user, zeroForOne), uint256(amount));
    //
    //   // Async executor after order
    //   vm.startPrank(asyncExecutor);
    //   hook.executeOrder(key, order);
    //   vm.stopPrank();
    //
    //   assertEq(hook.asyncOrders(poolId, user, zeroForOne), 0);
    //   if (zeroForOne) {
    //     assertEq(manager.balanceOf(user, currency0.toId()), uint256(amount));
    //   } else {
    //     assertEq(manager.balanceOf(user, currency1.toId()), uint256(amount));
    //   }
  }

}
