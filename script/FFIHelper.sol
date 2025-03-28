// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { CSMM } from "../src/CSMM.sol";
import { Script, console } from "forge-std/Script.sol";
import { stdJson } from "forge-std/Test.sol";
import { IHooks } from "v4-core/interfaces/IHooks.sol";

import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { PoolId } from "v4-core/types/PoolId.sol";

contract FFIHelper is Script {

  using stdJson for string;

  function _getDeployedPoolManager() internal view returns (address poolManagerAddress) {
    string memory root = vm.projectRoot();
    string memory path = string.concat(root, "/broadcast/00_DeployPoolManager.s.sol/31337/run-latest.json");
    string memory json = vm.readFile(path);
    poolManagerAddress = json.readAddress(".transactions[0].contractAddress");
  }

  function _getDeployedHook() internal view returns (address hookAddress, address routerAddress) {
    string memory root = vm.projectRoot();
    string memory path = string.concat(root, "/broadcast/01_DeployHook.s.sol/31337/run-latest.json");
    string memory json = vm.readFile(path);
    hookAddress = json.readAddress(".transactions[0].contractAddress");
    routerAddress = json.readAddress(".transactions[1].contractAddress");
  }

  function _getPoolTopics() internal view returns (uint256[] memory) {
    string memory root = vm.projectRoot();
    string memory path = string.concat(root, "/broadcast/02_InitilizePool.s.sol/31337/run-latest.json");
    string memory json = vm.readFile(path);
    uint256[] memory topics = json.readUintArray(".receipts[4].logs[0].topics");
    return topics;
  }

  struct OrderData {
    PoolId poolId;
    address owner;
  }

  function _getAsyncOrder() internal view returns (CSMM.AsyncOrder memory) {
    string memory root = vm.projectRoot();
    string memory path = string.concat(root, "/broadcast/04_Swap.s.sol/31337/run-latest.json");
    string memory json = vm.readFile(path);
    bytes memory data = json.readBytes(".receipts[1].logs[1].data");

    uint256[] memory topics = json.readUintArray(".receipts[1].logs[1].topics");
    OrderData memory orderData = abi.decode(data, (OrderData));
    bool zeroForOne = topics[1] == 0 ? false : true;
    int256 amountIn = int256(topics[2]);
    CSMM.AsyncOrder memory order =
      CSMM.AsyncOrder({ poolId: orderData.poolId, owner: orderData.owner, zeroForOne: zeroForOne, amountIn: amountIn });
    return order;
  }

}
