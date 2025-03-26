// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { CSMM } from "../src/CSMM.sol";
import { SetupDeploy } from "./SetupDeploy.sol";
import { console } from "forge-std/Test.sol";
import { Currency, IHooks, IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { PoolSwapTest } from "v4-core/test/PoolSwapTest.sol";
import { PoolKey } from "v4-core/types/PoolKey.sol";

/// @title A Test contract
/// @notice CSMM tests
contract CsmmTest is SetupDeploy {

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

  function test_asyncSwapOrder() public userAction {
    int256 amount = 12;
    uint256 userCurrency0Balance = currency0.balanceOf(user);
    uint256 userCurrency1Balance = currency1.balanceOf(user);
    bool zeroForOne = false;
    IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
      zeroForOne: zeroForOne,
      amountSpecified: -int256(amount),
      sqrtPriceLimitX96: uint160(2 ** 96 + 1)
    });
    PoolSwapTest.TestSettings memory testSettings =
      PoolSwapTest.TestSettings({ takeClaims: false, settleUsingBurn: false });

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
  }

}
