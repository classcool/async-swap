// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.26;

import { BaseAsyncSwap } from "./BaseAsyncSwap.sol";
import { BaseCustomAccounting } from "./BaseCustomAccounting.sol";
import { BaseHook } from "./BaseHook.sol";
import { Router } from "./router.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { CurrencySettler } from "@uniswap/v4-core/test/utils/CurrencySettler.sol";
import { console } from "forge-std/Test.sol";
import { FixedPointMathLib } from "solady/utils/FixedPointMathLib.sol";
import { IPoolManager } from "v4-core/interfaces/IPoolManager.sol";
import { FullMath } from "v4-core/libraries/FullMath.sol";
import { Hooks } from "v4-core/libraries/Hooks.sol";
import { SafeCast } from "v4-core/libraries/SafeCast.sol";
import { StateLibrary } from "v4-core/libraries/StateLibrary.sol";
import { StateLibrary } from "v4-core/libraries/StateLibrary.sol";
import { TickMath } from "v4-core/libraries/TickMath.sol";
import { TransientStateLibrary } from "v4-core/libraries/TransientStateLibrary.sol";
import { BalanceDelta, toBalanceDelta } from "v4-core/types/BalanceDelta.sol";
import { BeforeSwapDelta, toBeforeSwapDelta } from "v4-core/types/BeforeSwapDelta.sol";
import { Currency, CurrencyLibrary } from "v4-core/types/Currency.sol";
import { PoolId } from "v4-core/types/PoolId.sol";
import { PoolIdLibrary, PoolKey } from "v4-core/types/PoolKey.sol";
import { LiquidityAmounts } from "v4-periphery/src/libraries/LiquidityAmounts.sol";

/// @title LAMMbert
/// @notice A NoOp hook that mints 1:1 tokens
contract LAMMbert is BaseCustomAccounting, ERC20 {

  using SafeCast for uint256;
  using StateLibrary for IPoolManager;

  mapping(PoolId poolId => mapping(address user => mapping(bool zeroForOne => uint256 claimable))) public asyncOrders;

  event BeforeSwap(bytes32 poolId, address owner, bool indexed zeroForOne, int256 indexed amountIn);
  event AsyncOrderFilled(PoolId poolId, address owner, bool zeroForOne, uint256 amount);

  constructor(IPoolManager poolManager) BaseCustomAccounting(poolManager) ERC20("Hooked Liquidity", "LIQ") { }

  uint256 nativeRefund;

  receive() external payable { }

  function setNativeRefund(uint256 refrundFee) internal {
    nativeRefund = refrundFee;
  }
  /**
   * @dev Get the liquidity modification to apply for a given liquidity addition,
   * and the amount of liquidity shares would be minted to the sender.
   *
   * @param sqrtPriceX96 The current square root price of the pool.
   * @param params The parameters for the liquidity addition.
   * @return modify The encoded parameters for the liquidity addition, which must follow the
   * same encoding structure as in `_getRemoveLiquidity` and `_modifyLiquidity`.
   * @return shares The liquidity shares to mint.
   *
   * IMPORTANT: The salt returned in `modify` indicates which position of the sender the liquidity
   * modification is applied given that the `unlockCallback` function uses the keccak256 hash of
   * the sender and the salt returned here to determine the liquidity position. By default, we
   * recommend using the `userInputSalt` parameter from the `AddLiquidityParams` struct as the salt
   * here.
   */

  function _getAddLiquidity(uint160 sqrtPriceX96, AddLiquidityParams memory params)
    internal
    virtual
    override
    returns (bytes memory modify, uint256 shares)
  {
    shares = LiquidityAmounts.getLiquidityForAmounts(
      sqrtPriceX96,
      TickMath.getSqrtPriceAtTick(params.tickLower),
      TickMath.getSqrtPriceAtTick(params.tickUpper),
      nativeRefund > 0 ? nativeRefund : params.amount0Desired,
      nativeRefund > 0 ? nativeRefund : params.amount1Desired
    );

    return (
      abi.encode(
        IPoolManager.ModifyLiquidityParams({
          tickLower: params.tickLower,
          tickUpper: params.tickUpper,
          liquidityDelta: shares.toInt256(),
          salt: params.userInputSalt
        })
      ),
      shares
    );
  }

  /**
   * @dev Get the liquidity modification to apply for a given liquidity removal,
   * and the amount of liquidity shares would be burned from the sender.
   *
   * @param params The parameters for the liquidity removal.
   * @return modify The encoded parameters for the liquidity removal, which must follow the
   * same encoding structure as in `_getAddLiquidity` and `_modifyLiquidity`.
   * @return shares The liquidity shares to burn.
   *
   * IMPORTANT: The salt returned in `modify` indicates which position of the sender the liquidity
   * modification is applied given that the `unlockCallback` function uses the keccak256 hash of
   * the sender and the salt returned here to determine the liquidity position. By default, we
   * recommend using the `userInputSalt` parameter from the `AddLiquidityParams` struct as the salt
   * here.
   */
  function _getRemoveLiquidity(RemoveLiquidityParams memory params)
    internal
    virtual
    override
    returns (bytes memory modify, uint256 shares)
  {
    shares = FullMath.mulDiv(params.liquidity, poolManager.getLiquidity(poolKey.toId()), totalSupply());

    return (
      abi.encode(
        IPoolManager.ModifyLiquidityParams({
          tickLower: params.tickLower,
          tickUpper: params.tickUpper,
          liquidityDelta: -shares.toInt256(),
          salt: params.userInputSalt
        })
      ),
      shares
    );
  }

  /**
   * @dev Mint liquidity shares to the sender.
   *
   * @param params The parameters for the liquidity addition.
   * @param callerDelta The balance delta from the liquidity addition. This is the total of both principal and fee
   * delta.
   * @param feesAccrued The balance delta of the fees generated in the liquidity range.
   * @param shares The liquidity shares to mint.
   */
  function _mint(AddLiquidityParams memory params, BalanceDelta callerDelta, BalanceDelta feesAccrued, uint256 shares)
    internal
    virtual
    override
  {
    _mint(msg.sender, shares);
  }

  /**
   * @dev Burn liquidity shares from the sender.
   *
   * @param params The parameters for the liquidity removal.
   * @param callerDelta The balance delta from the liquidity removal. This is the total of both principal and fee delta.
   * @param feesAccrued The balance delta of the fees generated in the liquidity range.
   * @param shares The liquidity shares to burn.
   */
  function _burn(
    RemoveLiquidityParams memory params,
    BalanceDelta callerDelta,
    BalanceDelta feesAccrued,
    uint256 shares
  ) internal virtual override {
    _burn(msg.sender, shares);
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

}
