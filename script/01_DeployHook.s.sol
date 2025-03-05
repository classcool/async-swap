// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { CounterHook } from "../src/CounterHook.sol";
import { FFIHelper } from "./FFIHelper.sol";
import { console } from "forge-std/Test.sol";
import { IHooks } from "v4-core/interfaces/IHooks.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { Hooks } from "v4-core/libraries/Hooks.sol";
import { HookMiner } from "v4-periphery/src/utils/HookMiner.sol";

/// @notice Deploys Hook contract
contract DeployHookScript is FFIHelper {

  IPoolManager manager;
  IHooks public hook;

  function setUp() public {
    manager = _getDeployedPoolManager();
    console.log(address(manager));
  }

  function run() public {
    vm.startBroadcast();

    /// @dev get hook flags
    uint160 hookFlags = uint160(
      Hooks.BEFORE_INITIALIZE_FLAG | Hooks.AFTER_INITIALIZE_FLAG | Hooks.BEFORE_SWAP_FLAG | Hooks.AFTER_SWAP_FLAG
        | Hooks.BEFORE_ADD_LIQUIDITY_FLAG | Hooks.BEFORE_REMOVE_LIQUIDITY_FLAG | Hooks.AFTER_ADD_LIQUIDITY_FLAG
        | Hooks.AFTER_REMOVE_LIQUIDITY_FLAG | Hooks.BEFORE_DONATE_FLAG | Hooks.AFTER_DONATE_FLAG
        | Hooks.AFTER_ADD_LIQUIDITY_RETURNS_DELTA_FLAG | Hooks.AFTER_REMOVE_LIQUIDITY_RETURNS_DELTA_FLAG
        | Hooks.BEFORE_SWAP_RETURNS_DELTA_FLAG | Hooks.AFTER_SWAP_RETURNS_DELTA_FLAG
    );

    /// @dev compute create2 salt
    (address hookAddress, bytes32 salt) =
      HookMiner.find(CREATE2_FACTORY, hookFlags, type(CounterHook).creationCode, abi.encode(address(manager)));

    /// @dev deploy hook
    hook = new CounterHook{ salt: salt }(manager);
    assert(address(hook) == hookAddress);

    vm.stopBroadcast();
  }

}
