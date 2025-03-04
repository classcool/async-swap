// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { Script, console } from "forge-std/Script.sol";
import { PoolManager } from "v4-core/PoolManager.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";

address constant OWNER = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

contract DeployPoolManager is Script {

  IPoolManager manager;

  function run() public {
    vm.startBroadcast();

    /// @dev deploy manager
    manager = new PoolManager(OWNER);
  }

}
