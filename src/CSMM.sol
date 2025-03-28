// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.26;

import { Router } from "./router.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { CurrencySettler } from "@uniswap/v4-core/test/utils/CurrencySettler.sol";
import { console } from "forge-std/Test.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { Hooks } from "v4-core/libraries/Hooks.sol";
import { StateLibrary } from "v4-core/libraries/StateLibrary.sol";
import { TransientStateLibrary } from "v4-core/libraries/TransientStateLibrary.sol";
import { BalanceDelta, toBalanceDelta } from "v4-core/types/BalanceDelta.sol";
import { BeforeSwapDelta, toBeforeSwapDelta } from "v4-core/types/BeforeSwapDelta.sol";
import { Currency, CurrencyLibrary } from "v4-core/types/Currency.sol";
import { PoolId } from "v4-core/types/PoolId.sol";
import { PoolIdLibrary, PoolKey } from "v4-core/types/PoolKey.sol";
import { BaseHook } from "v4-periphery/src/utils/BaseHook.sol";

/// @title Remittance CSMM
/// @notice A NoOp hook that mints 1:1 tokens
contract CSMM is Ownable, BaseHook {

  using StateLibrary for IPoolManager;
  using TransientStateLibrary for IPoolManager;
  using CurrencySettler for Currency;
  using PoolIdLibrary for PoolKey;

  mapping(PoolId poolId => mapping(address user => mapping(bool zeroForOne => uint256 claimable))) public asyncOrders;
  mapping(PoolId poolId => mapping(address user => uint256 nonce)) public nonces;

  event BeforeAddLiquidity(PoolId poolId, address sender, BalanceDelta liquidityDelta);
  event BeforeSwap(
    bytes32 poolId, address owner, bool indexed zeroForOne, int256 indexed amountIn, uint256 indexed nonce
  );
  event AsyncOrderFilled(PoolId poolId, address owner, bool zeroForOne, uint256 amount);

  address asyncExecutor;

  error AddLiquidityThroughHook();

  constructor(IPoolManager poolManager, address owner_) Ownable(owner_) BaseHook(poolManager) { }

  modifier onlyAsyncExecutor() {
    require(msg.sender == asyncExecutor, "Only Authorized Executor");
    _;
  }

  function setExecutor(address executor) public onlyOwner {
    asyncExecutor = executor;
  }

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

  /// @notice Custom add liquidity function
  function addLiquidity(PoolKey calldata key, uint256 amountEach) external {
    poolManager.unlock(
      abi.encode(LiquidityCallback(ActionType.Liquidity, amountEach, key.currency0, key.currency1, msg.sender))
    );
    emit BeforeAddLiquidity(
      key.toId(), msg.sender, toBalanceDelta(int128(int256(amountEach)), int128(int256(amountEach)))
    );
  }

  function executeOrder(PoolKey calldata key, AsyncOrder calldata order) external onlyAsyncExecutor {
    Currency currency;
    if (order.zeroForOne) {
      currency = key.currency0;
    } else {
      currency = key.currency1;
    }
    uint256 claimable = asyncOrders[order.poolId][order.owner][order.zeroForOne];
    if (claimable >= uint256(order.amountIn)) {
			asyncOrders[order.poolId][order.owner][order.zeroForOne] -= uint256(order.amountIn);
      poolManager.transfer(order.owner, currency.toId(), uint256(order.amountIn));
      emit AsyncOrderFilled(order.poolId, order.owner, order.zeroForOne, uint256(order.amountIn));
    }
  }

  struct AsyncOrder {
    PoolId poolId;
    address owner;
    bool zeroForOne;
    int256 amountIn;
  }

  struct TestSettings {
    bool takeClaims;
    bool settleUsingBurn;
  }

  /// @dev Async swap function
  /// @dev handles exactInputIn params only
  /// @notice reference : https://github.com/haardikk21/pause-swap/blob/main/src/Hook.sol
  function _beforeSwap(
    address,
    PoolKey calldata key,
    IPoolManager.SwapParams calldata params,
    bytes calldata hookParams
  ) internal override returns (bytes4, BeforeSwapDelta, uint24) {
    bool isExactInput = params.amountSpecified < 0;
    if (!isExactInput) {
      revert("Exact output not supported");
    }

    BeforeSwapDelta beforeSwapDelta = toBeforeSwapDelta(int128(-params.amountSpecified), 0);
    uint256 amountInPositive = uint256(-params.amountSpecified);

    /// @notice increase async order nonces
    AsyncOrder memory order = abi.decode(hookParams, (AsyncOrder));
    nonces[order.poolId][order.owner]++;

    if (params.zeroForOne) {
      key.currency0.take(poolManager, address(this), amountInPositive, true);
    } else {
      key.currency1.take(poolManager, address(this), amountInPositive, true);
    }

    uint256 currClaimables = asyncOrders[order.poolId][order.owner][order.zeroForOne];
    asyncOrders[order.poolId][order.owner][order.zeroForOne] = currClaimables + uint256(-params.amountSpecified);

    /// @dev emit event consumed by filler
    emit BeforeSwap(
      PoolId.unwrap(order.poolId), order.owner, order.zeroForOne, order.amountIn, nonces[order.poolId][order.owner]
    );

    return (this.beforeSwap.selector, beforeSwapDelta, 0);
  }

  /// @notice Settle async swaps
  /// @dev called by keeper to settle swaps and execute transation orders
  function settleAsyncSwap() external { }

  enum ActionType {
    Liquidity,
    Swap
  }

  struct SwapSettings {
    bool takeClaims;
    bool settleUsingBurn;
  }

  struct SwapCallback {
    ActionType action;
    address sender;
    SwapSettings swapSettings;
    PoolKey key;
    IPoolManager.SwapParams params;
    bytes hookData;
  }

  struct LiquidityCallback {
    ActionType action;
    uint256 amountEach;
    Currency currency0;
    Currency currency1;
    address sender;
  }

  function _handleLiquidityCallback(bytes memory rawData) internal onlyPoolManager {
    LiquidityCallback memory data = abi.decode(rawData, (LiquidityCallback));
    data.currency0.settle(poolManager, data.sender, data.amountEach, false);
    data.currency1.settle(poolManager, data.sender, data.amountEach, false);

    data.currency0.take(poolManager, address(this), data.amountEach, true);
    data.currency1.take(poolManager, address(this), data.amountEach, true);
  }

  function _handleSwapCallback(bytes memory) internal view onlyPoolManager returns (bytes memory) {
    // SwapCallback memory data = abi.decode(rawData, (SwapCallback));
    // BalanceDelta delta = poolManager.swap(data.key, data.params, data.hookData);
    // return abi.encode(delta);
    return "";
  }

  /// @notice callback from add liquidity.
  function unlockCallback(bytes calldata data) external returns (bytes memory) {
    bytes32 action;
    assembly ("memory-safe") {
      let loc := data.offset
      let actionLoc := add(calldataload(loc), data.offset)
      action := calldataload(actionLoc)
    }

    console.logBytes32(action);
    if (action == bytes32(0)) {
      _handleLiquidityCallback(data);
    }
    if (action == bytes32(uint256(1))) {
      return _handleSwapCallback(data);
    }

    return "";
  }

}
