// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IAsyncCSMM } from "./IAsyncCSMM.sol";
import { IAsyncSwap } from "./IAsyncSwap.sol";

interface IRouter {

  enum ActionType {
    Swap,
    FillOrder
  }

  struct SwapCallback {
    ActionType action;
    IAsyncSwap.AsyncOrder order;
  }

  function swap(IAsyncSwap.AsyncOrder calldata order, bytes calldata userData) external;

  function fillOrder(IAsyncSwap.AsyncOrder calldata order, bytes calldata userData) external;

}
