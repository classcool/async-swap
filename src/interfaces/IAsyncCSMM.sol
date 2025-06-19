// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IAsyncSwap} from "./IAsyncSwap.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";

/// @title Async CSMM Interface
/// @author Async Labs
/// @notice This interface defines the functions for the Async CSMM (Constant Sum Market Maker) contract.
interface IAsyncCSMM is IAsyncSwap {
    /// @notice Struct representing the user parameters for executing an async order.
    /// @param order The async order to be executed.
    /// @param userParams Additional parameter for the user, allowing user to specify an executor.
    struct UserParams {
        address user;
        address executor;
    }

    /// @notice Creates an async order that can be filled later.
    /// @param order The async order to be filled.
    /// @param userParams Additional data for the user.
    function executeOrder(
        IAsyncSwap.AsyncOrder calldata order,
        bytes calldata userParams
    ) external;
}
