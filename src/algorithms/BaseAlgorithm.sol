// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { IAlgorithm } from "@async-swap/interfaces/IAlgorithm.sol";

contract BaseAlgorithm is IAlgorithm {

  /// @notice The address of the hook that will call this algorithm.
  address public immutable hookAddress;

  /// @notice Constructor to set the hook address.
  /// @param _hookAddress The address of the hook that will call this algorithm.
  constructor(address _hookAddress) {
    hookAddress = _hookAddress;
  }

  /// @notice Modifier to restrict access to the hook address.
  modifier onlyHook() {
    require(msg.sender == hookAddress, "Only hook can call this function");
    _;
  }

  /// @inheritdoc IAlgorithm
  function name() external pure virtual returns (string memory) {
    return "BaseAlgorithm";
  }

  /// @inheritdoc IAlgorithm
  function version() external pure virtual returns (string memory) {
    return "1.0.0";
  }

  /// @inheritdoc IAlgorithm
  function orderingRule(bool zeroForOne, uint256 amount) external virtual {
    zeroForOne;
    amount;
    revert("BaseAlgorithm: orderingRule not implemented");
  }

}
