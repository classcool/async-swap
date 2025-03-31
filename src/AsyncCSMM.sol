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
  mapping(address owner => mapping(address executor => bool)) public setExecutor;

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
      afterAddLiquidityReturnDelta: false,
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

  /// @notice Allows adding liquidity through hook
  function addLiquidity(IAsyncCSMM.CSMMLiquidityParams calldata liq) external {
    bytes32 poolId = PoolId.unwrap(liq.key.toId());
    liq.key.currency0.settle(poolManager, liq.owner, liq.amount0, false); // transfer
    liq.key.currency1.settle(poolManager, liq.owner, liq.amount1, false); // transfer

    liq.key.currency0.take(poolManager, address(this), liq.amount0, true);
    liq.key.currency1.take(poolManager, address(this), liq.amount0, true);
    emit HookModifyLiquidity(poolId, msg.sender, liq.amount0.toInt128(), liq.amount1.toInt128());
  }

  /// @notice Check if user is executor address
  function isExecutor(AsyncOrder calldata order, address executor) public view returns (bool) {
    return setExecutor[order.owner][executor];
  }

  function calculateHookFee(uint256) public pure returns (uint256) {
    return 0;
  }

  function calculatePoolFee(uint24, uint256) public pure returns (uint256) {
    return 0;
  }

  function executeOrder(AsyncOrder calldata order, bytes calldata) external {
    if (order.amountIn == 0) revert ZeroFillOrder();

    PoolId poolId = order.key.toId();
    uint256 amountToFill = uint256(order.amountIn);
    uint256 claimableAmount = asyncOrders[poolId][order.owner][order.zeroForOne];
    require(amountToFill <= claimableAmount, "Max fill order limit exceed");
    require(isExecutor(order, msg.sender), "Caller is valid not excutor");

    /// @dev Transfer currency of async order to user
    Currency currencyTake;
    Currency currencyFill;
    if (order.zeroForOne) {
      currencyTake = order.key.currency0;
      currencyFill = order.key.currency1;
    } else {
      currencyTake = order.key.currency1;
      currencyFill = order.key.currency0;
    }

    asyncOrders[poolId][order.owner][order.zeroForOne] -= amountToFill;
    poolManager.transfer(order.owner, currencyTake.toId(), amountToFill);
    emit AsyncOrderFilled(poolId, order.owner, order.zeroForOne, amountToFill);

    /// @dev Take currencyFill from filler
    /// @dev Hook may charge filler a hook fee
    /// TODO: If fee emit HookFee event
    uint256 debtTaken = calculateHookFee(amountToFill);
    currencyFill.take(poolManager, address(this), amountToFill - debtTaken, true);
    currencyFill.settle(poolManager, msg.sender, amountToFill, false); // transfer
    uint256 currClaimables = asyncOrders[poolId][order.owner][!order.zeroForOne];
    asyncOrders[poolId][order.owner][!order.zeroForOne] = currClaimables + debtTaken;
  }

  /// @notice Creates async order that hook will fill in the future
  function _beforeSwap(
    address sender,
    PoolKey calldata key,
    IPoolManager.SwapParams calldata params,
    bytes calldata hookParams
  ) internal override returns (bytes4, BeforeSwapDelta, uint24) {
    /// @dev Async swaps only work for exact-input swaps
    if (params.amountSpecified > 0) {
      revert("Hook only support ExectInput Amount");
    }

    PoolId poolId = key.toId();
    uint256 amountTaken = uint256(-params.amountSpecified);
    UserParams memory hookData = abi.decode(hookParams, (UserParams));

    /// @dev Specify the input token
    Currency specified = params.zeroForOne ? key.currency0 : key.currency1;

    /// @dev create hook debt
    specified.take(poolManager, address(this), amountTaken, true);
    /// @dev Take pool fee for LP
    uint256 feeAmount = calculatePoolFee(key.fee, amountTaken);
    uint256 finalTaken = amountTaken - feeAmount;
    setExecutor[hookData.user][hookData.executor] = true;
    emit AsyncSwapOrder(poolId, hookData.user, params.zeroForOne, finalTaken.toInt256());

    /// @dev Issue 1:1 claimableAmount - pool fee to user
    /// @dev Add amount taken to previous claimableAmount
    uint256 currClaimables = asyncOrders[poolId][hookData.user][params.zeroForOne];
    asyncOrders[poolId][hookData.user][params.zeroForOne] = currClaimables + finalTaken;

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
