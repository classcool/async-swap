// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { CounterHook } from "../src/CounterHook.sol";
import { Test, console } from "forge-std/Test.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { Hooks } from "v4-core/libraries/Hooks.sol";

/// @title A counter hook test contract
/// @notice Use as example only for project setup
contract CounterHookTest is Test {

  IPoolManager manager;
  CounterHook public counter;

  function setUp() public {
    /// @dev create hook flags
    uint160 hookFlags = uint160(
      Hooks.BEFORE_INITIALIZE_FLAG | Hooks.AFTER_INITIALIZE_FLAG | Hooks.BEFORE_SWAP_FLAG | Hooks.AFTER_SWAP_FLAG
        | Hooks.BEFORE_ADD_LIQUIDITY_FLAG | Hooks.BEFORE_REMOVE_LIQUIDITY_FLAG | Hooks.AFTER_ADD_LIQUIDITY_FLAG
        | Hooks.AFTER_REMOVE_LIQUIDITY_FLAG | Hooks.BEFORE_DONATE_FLAG | Hooks.AFTER_DONATE_FLAG
        | Hooks.AFTER_ADD_LIQUIDITY_RETURNS_DELTA_FLAG | Hooks.AFTER_REMOVE_LIQUIDITY_RETURNS_DELTA_FLAG
        | Hooks.BEFORE_SWAP_RETURNS_DELTA_FLAG | Hooks.AFTER_SWAP_RETURNS_DELTA_FLAG
    );

    /// @dev deploy CounterHook code to flags address
    deployCodeTo("CounterHook.sol", abi.encode(manager), address(hookFlags));
    counter = CounterHook(address(hookFlags));
  }

  function test_Increment() public { }

}
