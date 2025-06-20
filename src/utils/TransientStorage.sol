// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title TransientStorage helper contract
/// @author Async Labs
/// @notice This contract provides functions to interact with the transient storage.
contract TransientStorage {

  /// Load a value from the transient storage.
  /// @param key The key to store or retrieve the value.
  function tload(bytes32 key) public view returns (bytes32 value) {
    assembly ("memory-safe") {
      value := tload(key)
    }
  }

  /// Store a value in the transient storage.
  /// @param key The key to store or retrieve the value.
  /// @param value The value to store in the transient storage.
  function tstore(bytes32 key, bytes32 value) public {
    assembly ("memory-safe") {
      tstore(key, value)
    }
  }

}
