// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { CounterHook } from "../src/CounterHook.sol";
import { Script, console } from "forge-std/Script.sol";
import { PoolManager } from "v4-core/PoolManager.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { Hooks } from "v4-core/libraries/Hooks.sol";
import { HookMiner } from "v4-periphery/src/utils/HookMiner.sol";

/// @dev anvil sender default address
address constant OWNER = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

/// @notice DeployConterHook script
contract DeployHookScript is Script {

  CounterHook public counter;
  IPoolManager manager;

  function setUp() public { }

  function run() public {
    vm.startBroadcast();

    /// @dev deploy manager
    manager = new PoolManager(OWNER);

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
    counter = new CounterHook{ salt: salt }(manager);
    assert(address(counter) == hookAddress);

    vm.stopBroadcast();
  }

}
