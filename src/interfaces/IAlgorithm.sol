// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IAlgorithm {

  /// @notice Executes the transaction ordering algorithm.
  /// @param zeroForOne Indicates the direction of the trade (true for currency0 to currency1, false for currency1 to
  /// currency0).
  /// @param amount The amount of the order being processed.
  function orderingRule(bool zeroForOne, uint256 amount) external;

  /// @notice Returns the name of the ordering algorithm.
  /// @return The name of the algorithm as a string.
  function name() external view returns (string memory);

}
