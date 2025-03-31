// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IAsyncSwap } from "./IAsyncSwap.sol";
import { PoolKey } from "v4-core/types/PoolKey.sol";

interface IAsyncCSMM is IAsyncSwap {

  struct CSMMLiquidityParams {
    PoolKey key;
    address owner;
    uint256 amount0;
    uint256 amount1;
  }

  struct UserParams {
    address user;
    address executor;
  }

  function addLiquidity(CSMMLiquidityParams calldata liqParams) external;
  function executeOrder(IAsyncSwap.AsyncOrder calldata order, bytes calldata userParams) external;

}
