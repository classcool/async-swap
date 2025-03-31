// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Currency } from "v4-core/types/Currency.sol";
import { PoolId } from "v4-core/types/PoolId.sol";
import { PoolKey } from "v4-core/types/PoolKey.sol";

interface IAsyncSwap {

  event AsyncOrderFilled(PoolId poolId, address owner, bool zeroForOne, uint256 amount);
  event AsyncSwapOrder(PoolId poolId, address owner, bool indexed zeroForOne, int256 indexed amountIn);

  struct AsyncOrder {
    PoolKey key;
    address owner;
    bool zeroForOne;
    uint256 amountIn;
    uint160 sqrtPrice;
  }

  error InvalidOrder();
  error ZeroFillOrder();

  function asyncOrders(PoolId poolId, address user, bool zeroForOne) external view returns (uint256 claimable);
  function executeOrder(AsyncOrder memory order, bytes calldata userData) external;
  function isExecutor(AsyncOrder calldata order, address executor) external returns (bool);

}
