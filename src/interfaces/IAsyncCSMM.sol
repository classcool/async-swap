// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IAsyncSwap } from "./IAsyncSwap.sol";
import { PoolKey } from "v4-core/types/PoolKey.sol";

interface IAsyncCSMM is IAsyncSwap {

  struct UserParams {
    address user;
    address executor;
  }

  function executeOrder(IAsyncSwap.AsyncOrder calldata order, bytes calldata userParams) external;

}
