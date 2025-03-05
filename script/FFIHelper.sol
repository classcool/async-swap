// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { CounterHook } from "../src/CounterHook.sol";
import { Script, console } from "forge-std/Script.sol";
import { stdJson } from "forge-std/Test.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";

contract FFIHelper is Script {

  using stdJson for string;

  function _getDeployedPoolManager() internal view returns (IPoolManager) {
    string memory root = vm.projectRoot();
    string memory path = string.concat(root, "/broadcast/00_DeployPoolManager.s.sol/31337/run-latest.json");
    string memory json = vm.readFile(path);
    address poolManagerAddress = json.readAddress(".transactions[0].contractAddress");
    return IPoolManager(poolManagerAddress);
  }

  function _getDeployedHook() internal view returns (CounterHook) {
    string memory root = vm.projectRoot();
    string memory path = string.concat(root, "/broadcast/01_DeployHook.s.sol/31337/run-latest.json");
    string memory json = vm.readFile(path);
    address hookAddresss = json.readAddress(".transactions[0].contractAddress");
    return CounterHook(hookAddresss);
  }

}
