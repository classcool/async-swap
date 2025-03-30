// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IAsyncCSMM } from "./IAsyncCSMM.sol";
import { IAsyncSwap } from "./IAsyncSwap.sol";

interface IRouter {

  enum ActionType {
    Liquidity,
    Swap,
    RemoveLiquidity
  }

  struct SwapCallback {
    ActionType action;
    IAsyncSwap.AsyncOrder order;
  }

  struct LiquidityCallback {
    ActionType action;
    IAsyncCSMM.CSMMLiquidityParams csmmLiq;
  }

  function swap(IAsyncSwap.AsyncOrder calldata orderParams, bytes memory routerData) external;

}
