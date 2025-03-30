// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.26;

import { IAsyncCSMM } from "./interfaces/IAsyncCSMM.sol";
import { ICSMM } from "./interfaces/ICSMM.sol";
import { IRouter } from "./interfaces/IRouter.sol";
import { CurrencySettler } from "@uniswap/v4-core/test/utils/CurrencySettler.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { Hooks } from "v4-core/libraries/Hooks.sol";
import { SafeCast } from "v4-core/libraries/SafeCast.sol";
import { BeforeSwapDelta, BeforeSwapDeltaLibrary, toBeforeSwapDelta } from "v4-core/types/BeforeSwapDelta.sol";
import { Currency } from "v4-core/types/Currency.sol";
import { PoolId } from "v4-core/types/PoolId.sol";
import { PoolIdLibrary, PoolKey } from "v4-core/types/PoolKey.sol";
import { BaseHook } from "v4-periphery/src/utils/BaseHook.sol";

/// @title Async CSMM
/// @notice A NoOp Hook that has custom accounting minting 1:1 assets
contract AsyncCSMM is BaseHook, IAsyncCSMM {

  using SafeCast for *;
  using CurrencySettler for Currency;
  using PoolIdLibrary for PoolKey;

  mapping(PoolId poolId => mapping(address user => mapping(bool zeroForOne => uint256 claimable))) public asyncOrders;

  /// @dev Event emitted when a swap is executed.
  event HookSwap(
    bytes32 indexed id,
    address indexed sender,
    int128 amount0,
    int128 amount1,
    uint128 hookLPfeeAmount0,
    uint128 hookLPfeeAmount1
  );
  /// @dev Event emitted when a liquidity modification is executed.
  event HookModifyLiquidity(bytes32 indexed id, address indexed sender, int128 amount0, int128 amount1);

  address asyncExecutor;
  uint24 FEE = 3000; // 0.3%
  uint24 FeePips = 10000; // 0.0001 pips

  error AddLiquidityThroughHook();

  constructor(IPoolManager poolManager) BaseHook(poolManager) { }

  function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
    return Hooks.Permissions({
      beforeInitialize: false,
      afterInitialize: false,
      beforeAddLiquidity: true, // override liquidity functionality
      afterAddLiquidity: false,
      beforeRemoveLiquidity: false,
      afterRemoveLiquidity: false,
      beforeSwap: true, // override how swaps are done async swap
      afterSwap: false,
      beforeDonate: false,
      afterDonate: false,
      beforeSwapReturnDelta: true, // allow beforeSwap to return a custom delta, for custom ordering
      afterSwapReturnDelta: false,
      afterAddLiquidityReturnDelta: false, // custom add liquidity
      afterRemoveLiquidityReturnDelta: false
    });
  }

  function _beforeAddLiquidity(address, PoolKey calldata, IPoolManager.ModifyLiquidityParams calldata, bytes calldata)
    internal
    pure
    override
    returns (bytes4)
  {
    revert AddLiquidityThroughHook();
  }

  /// @notice Allows adding liwuidity through hook
  /// @dev Custom add liquidity function
  function addLiquidity(IAsyncCSMM.CSMMLiquidityParams calldata liq) external {
    bytes32 poolId = PoolId.unwrap(liq.key.toId());
    liq.key.currency0.settle(poolManager, liq.owner, liq.amountEach, false);
    liq.key.currency1.settle(poolManager, liq.owner, liq.amountEach, false);

    liq.key.currency0.take(poolManager, address(this), liq.amountEach, true);
    liq.key.currency1.take(poolManager, address(this), liq.amountEach, true);
    emit HookModifyLiquidity(poolId, msg.sender, liq.amountEach.toInt128(), liq.amountEach.toInt128());
  }

  /// @notice Check if user is executor address
  function isExecutor(AsyncOrder calldata order, address executor) public pure returns (bool) {
    return (order.executor == executor || order.owner == executor);
  }

  function calculateHookFee(uint256 amount) public view returns (uint256) {
    return 0;
  }

  function calculatePoolFee(uint24 poolFee, uint256 amount) public view returns (uint256) {
    return 0;
  }

  function executeOrder(PoolKey calldata key, AsyncOrder calldata order) external {
    uint256 amountToFill = uint256(order.amountIn);
    PoolId poolId = key.toId();
    uint256 claimableAmount = asyncOrders[poolId][order.owner][order.zeroForOne];

    require(amountToFill <= claimableAmount, "Max fill order limit exceed");
    require(isExecutor(order, msg.sender), "Caller is valid not excutor");
    if (order.amountIn != 0) revert ZeroFillOrder();

    /// @dev Transfer currency of async order to user
    /// @dev No fee to user for filled order
    Currency currencyTake;
    Currency currencyFill;
    if (order.zeroForOne) {
      currencyTake = key.currency0;
      currencyFill = key.currency1;
    } else {
      currencyTake = key.currency1;
      currencyFill = key.currency1;
    }
    uint256 claimable = asyncOrders[poolId][order.owner][order.zeroForOne];
    if (claimable >= amountToFill) {
      asyncOrders[poolId][order.owner][order.zeroForOne] -= amountToFill;
      poolManager.transfer(order.owner, currencyTake.toId(), amountToFill);
      emit AsyncOrderFilled(poolId, order.owner, order.zeroForOne, amountToFill);
    } else {
      revert InvalidOrder();
    }

    /// @dev Take currencyFill from executor
    /// @dev Hook will charge executor a hook fee
    uint256 debtTaken = calculateHookFee(amountToFill);
    currencyFill.settle(poolManager, order.executor, amountToFill, true);
    currencyFill.take(poolManager, address(this), amountToFill - debtTaken, true);
    uint256 currClaimables = asyncOrders[poolId][order.owner][!order.zeroForOne];
    asyncOrders[poolId][order.owner][!order.zeroForOne] = currClaimables + debtTaken;
  }

  /// @notice Creates async order that hook will fill in the future
  /// @notice TODO: Implement exactOutput (Hook loan)
  /// @dev Handles exactInputIn (Hook debt)
  function _beforeSwap(
    address sender,
    PoolKey calldata key,
    IPoolManager.SwapParams calldata params,
    bytes calldata hookParams
  ) internal override returns (bytes4, BeforeSwapDelta, uint24) {
    PoolId poolId = key.toId();
    uint256 amountTaken = uint256(-params.amountSpecified);
    address user = abi.decode(hookParams, (address));

    /// @dev Async swaps only work for exact-input swaps
    if (params.amountSpecified > 0) { }
    /// @dev Specify the input token
    Currency specified = params.zeroForOne ? key.currency0 : key.currency1;

    /// @dev create hook debt
    specified.take(poolManager, address(this), amountTaken, true);
    uint256 feeAmount = calculatePoolFee(key.fee, amountTaken);
    uint256 loanTaken = amountTaken - feeAmount;
    emit AsyncSwapOrder(poolId, user, params.zeroForOne, loanTaken.toInt256());

    /// @dev Issue 1:1 claimableAmount - pool fee to user
    /// @dev Add amount taken to previous claimableAmount
    /// @dev Take pool fee for LP
    uint256 currClaimables = asyncOrders[poolId][user][params.zeroForOne];
    asyncOrders[poolId][user][params.zeroForOne] = currClaimables + loanTaken;

    /// @dev Hook event
    /// @reference
    /// https://github.com/OpenZeppelin/uniswap-hooks/blob/19fa03bdacd780a3e44f7c3707d6881e364d9596/src/base/BaseAsyncSwap.sol#L75
    if (specified == key.currency0) {
      emit HookSwap(PoolId.unwrap(poolId), sender, amountTaken.toInt128(), 0, feeAmount.toUint128(), 0);
    } else {
      emit HookSwap(PoolId.unwrap(poolId), sender, 0, amountTaken.toInt128(), 0, feeAmount.toUint128());
    }

    BeforeSwapDelta beforeSwapDelta = toBeforeSwapDelta(int128(-params.amountSpecified), 0);
    /// @dev return execution to PoolManager
    return (BaseHook.beforeSwap.selector, beforeSwapDelta, 0);
  }

}
