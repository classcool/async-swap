// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { AsyncCSMM } from "../src/AsyncCSMM.sol";
import { Router } from "../src/router.sol";
import { Test, console } from "forge-std/Test.sol";
import { MockERC20 } from "solmate/src/test/utils/mocks/MockERC20.sol";
import { PoolManager } from "v4-core/PoolManager.sol";
import { Currency, IHooks, IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { Hooks } from "v4-core/libraries/Hooks.sol";
import { PoolId } from "v4-core/types/PoolId.sol";
import { PoolKey } from "v4-core/types/PoolKey.sol";

/// @title A counter hook test contract
/// @notice Use as example only for project setup
contract SetupHook is Test {

  address owner = makeAddr("deployer");
  IPoolManager manager;
  PoolKey key;
  AsyncCSMM hook;
  MockERC20 token0;
  MockERC20 token1;
  Currency currency0;
  Currency currency1;
  PoolId poolId;
  Router router;

  function setUp() public virtual {
    deployPoolManager();
    deployHook();
    deployRouter();
    deployTokens();
    createKey();
    intializePool();
    mint();
    addLiquidity();
  }

  modifier ownerAction() {
    vm.startPrank(owner);
    _;
    vm.stopPrank();
  }

  function deployRouter() public {
    router = new Router(manager, hook);
  }

  function addLiquidity() public ownerAction {
    uint256 amount = 10 ether;
    token0.approve(address(hook), amount);
    token1.approve(address(hook), amount);
    router.addLiquidity(key, amount, amount);
  }

  function mint() public ownerAction {
    token0.mint(owner, 100 ether);
    token1.mint(owner, 100 ether);
  }

  function deployPoolManager() public {
    manager = new PoolManager(owner);
  }

  function intializePool() public {
    manager.initialize(key, 2 ** 96);
  }

  function deployHook() public {
    uint160 hookFlags =
      uint160(Hooks.BEFORE_SWAP_FLAG | Hooks.BEFORE_ADD_LIQUIDITY_FLAG | Hooks.BEFORE_SWAP_RETURNS_DELTA_FLAG);
    vm.startPrank(owner);
    deployCodeTo("AsyncCSMM.sol", abi.encode(manager, owner), address(hookFlags));
    hook = AsyncCSMM(address(hookFlags));
  }

  function deployTokens() public {
    vm.startPrank(owner);
    address tokenA = address(new MockERC20("TEST Token 1", "TST1", 18));
    address tokenB = address(new MockERC20("TEST Token 2", "TST2", 18));
    currency0 = tokenA < tokenB ? Currency.wrap(address(tokenA)) : Currency.wrap(address(tokenB));
    currency1 = tokenA > tokenB ? Currency.wrap(address(tokenA)) : Currency.wrap(address(tokenB));
    vm.stopPrank();
    token0 = MockERC20(Currency.unwrap(currency0));
    token1 = MockERC20(Currency.unwrap(currency1));
    vm.label(address(token0), "token0");
    vm.label(address(token1), "token1");
  }

  function createKey() public {
    key = PoolKey({
      currency0: Currency.wrap(address(token0)),
      currency1: Currency.wrap(address(token1)),
      fee: uint24(1000),
      tickSpacing: int24(1),
      hooks: hook
    });
    poolId = key.toId();
  }

}
