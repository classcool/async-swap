import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from '@wagmi/core/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CSMM
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const csmmAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'poolManager',
        internalType: 'contract IPoolManager',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      { name: 'amountEach', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addLiquidity',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct IPoolManager.ModifyLiquidityParams',
        type: 'tuple',
        components: [
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'liquidityDelta', internalType: 'int256', type: 'int256' },
          { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'delta', internalType: 'BalanceDelta', type: 'int256' },
      { name: 'feesAccrued', internalType: 'BalanceDelta', type: 'int256' },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterAddLiquidity',
    outputs: [
      { name: '', internalType: 'bytes4', type: 'bytes4' },
      { name: '', internalType: 'BalanceDelta', type: 'int256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterDonate',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      { name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
      { name: 'tick', internalType: 'int24', type: 'int24' },
    ],
    name: 'afterInitialize',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct IPoolManager.ModifyLiquidityParams',
        type: 'tuple',
        components: [
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'liquidityDelta', internalType: 'int256', type: 'int256' },
          { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'delta', internalType: 'BalanceDelta', type: 'int256' },
      { name: 'feesAccrued', internalType: 'BalanceDelta', type: 'int256' },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterRemoveLiquidity',
    outputs: [
      { name: '', internalType: 'bytes4', type: 'bytes4' },
      { name: '', internalType: 'BalanceDelta', type: 'int256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct IPoolManager.SwapParams',
        type: 'tuple',
        components: [
          { name: 'zeroForOne', internalType: 'bool', type: 'bool' },
          { name: 'amountSpecified', internalType: 'int256', type: 'int256' },
          {
            name: 'sqrtPriceLimitX96',
            internalType: 'uint160',
            type: 'uint160',
          },
        ],
      },
      { name: 'delta', internalType: 'BalanceDelta', type: 'int256' },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterSwap',
    outputs: [
      { name: '', internalType: 'bytes4', type: 'bytes4' },
      { name: '', internalType: 'int128', type: 'int128' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct IPoolManager.ModifyLiquidityParams',
        type: 'tuple',
        components: [
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'liquidityDelta', internalType: 'int256', type: 'int256' },
          { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeAddLiquidity',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeDonate',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      { name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
    ],
    name: 'beforeInitialize',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct IPoolManager.ModifyLiquidityParams',
        type: 'tuple',
        components: [
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'liquidityDelta', internalType: 'int256', type: 'int256' },
          { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeRemoveLiquidity',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct IPoolManager.SwapParams',
        type: 'tuple',
        components: [
          { name: 'zeroForOne', internalType: 'bool', type: 'bool' },
          { name: 'amountSpecified', internalType: 'int256', type: 'int256' },
          {
            name: 'sqrtPriceLimitX96',
            internalType: 'uint160',
            type: 'uint160',
          },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeSwap',
    outputs: [
      { name: '', internalType: 'bytes4', type: 'bytes4' },
      { name: '', internalType: 'BeforeSwapDelta', type: 'int256' },
      { name: '', internalType: 'uint24', type: 'uint24' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getHookPermissions',
    outputs: [
      {
        name: '',
        internalType: 'struct Hooks.Permissions',
        type: 'tuple',
        components: [
          { name: 'beforeInitialize', internalType: 'bool', type: 'bool' },
          { name: 'afterInitialize', internalType: 'bool', type: 'bool' },
          { name: 'beforeAddLiquidity', internalType: 'bool', type: 'bool' },
          { name: 'afterAddLiquidity', internalType: 'bool', type: 'bool' },
          { name: 'beforeRemoveLiquidity', internalType: 'bool', type: 'bool' },
          { name: 'afterRemoveLiquidity', internalType: 'bool', type: 'bool' },
          { name: 'beforeSwap', internalType: 'bool', type: 'bool' },
          { name: 'afterSwap', internalType: 'bool', type: 'bool' },
          { name: 'beforeDonate', internalType: 'bool', type: 'bool' },
          { name: 'afterDonate', internalType: 'bool', type: 'bool' },
          { name: 'beforeSwapReturnDelta', internalType: 'bool', type: 'bool' },
          { name: 'afterSwapReturnDelta', internalType: 'bool', type: 'bool' },
          {
            name: 'afterAddLiquidityReturnDelta',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'afterRemoveLiquidityReturnDelta',
            internalType: 'bool',
            type: 'bool',
          },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'poolManager',
    outputs: [
      { name: '', internalType: 'contract IPoolManager', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'settleAsyncSwap',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    name: 'unlockCallback',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'PoolId',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'liquidityDelta',
        internalType: 'BalanceDelta',
        type: 'int256',
        indexed: false,
      },
    ],
    name: 'BeforeAddLiquidity',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'zeroForOn', internalType: 'bool', type: 'bool', indexed: false },
      {
        name: 'amountIn',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
    ],
    name: 'BeforeSwap',
  },
  { type: 'error', inputs: [], name: 'AddLiquidityThroughHook' },
  { type: 'error', inputs: [], name: 'HookNotImplemented' },
  { type: 'error', inputs: [], name: 'NotPoolManager' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CounterHook
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const counterHookAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_manager',
        internalType: 'contract IPoolManager',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct IPoolManager.ModifyLiquidityParams',
        type: 'tuple',
        components: [
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'liquidityDelta', internalType: 'int256', type: 'int256' },
          { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'delta', internalType: 'BalanceDelta', type: 'int256' },
      { name: 'feesAccrued', internalType: 'BalanceDelta', type: 'int256' },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterAddLiquidity',
    outputs: [
      { name: '', internalType: 'bytes4', type: 'bytes4' },
      { name: '', internalType: 'BalanceDelta', type: 'int256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterDonate',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      { name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
      { name: 'tick', internalType: 'int24', type: 'int24' },
    ],
    name: 'afterInitialize',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct IPoolManager.ModifyLiquidityParams',
        type: 'tuple',
        components: [
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'liquidityDelta', internalType: 'int256', type: 'int256' },
          { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'delta', internalType: 'BalanceDelta', type: 'int256' },
      { name: 'feesAccrued', internalType: 'BalanceDelta', type: 'int256' },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterRemoveLiquidity',
    outputs: [
      { name: '', internalType: 'bytes4', type: 'bytes4' },
      { name: '', internalType: 'BalanceDelta', type: 'int256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct IPoolManager.SwapParams',
        type: 'tuple',
        components: [
          { name: 'zeroForOne', internalType: 'bool', type: 'bool' },
          { name: 'amountSpecified', internalType: 'int256', type: 'int256' },
          {
            name: 'sqrtPriceLimitX96',
            internalType: 'uint160',
            type: 'uint160',
          },
        ],
      },
      { name: 'delta', internalType: 'BalanceDelta', type: 'int256' },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterSwap',
    outputs: [
      { name: '', internalType: 'bytes4', type: 'bytes4' },
      { name: '', internalType: 'int128', type: 'int128' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct IPoolManager.ModifyLiquidityParams',
        type: 'tuple',
        components: [
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'liquidityDelta', internalType: 'int256', type: 'int256' },
          { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeAddLiquidity',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeDonate',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      { name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
    ],
    name: 'beforeInitialize',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct IPoolManager.ModifyLiquidityParams',
        type: 'tuple',
        components: [
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'liquidityDelta', internalType: 'int256', type: 'int256' },
          { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeRemoveLiquidity',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct IPoolManager.SwapParams',
        type: 'tuple',
        components: [
          { name: 'zeroForOne', internalType: 'bool', type: 'bool' },
          { name: 'amountSpecified', internalType: 'int256', type: 'int256' },
          {
            name: 'sqrtPriceLimitX96',
            internalType: 'uint160',
            type: 'uint160',
          },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeSwap',
    outputs: [
      { name: '', internalType: 'bytes4', type: 'bytes4' },
      { name: '', internalType: 'BeforeSwapDelta', type: 'int256' },
      { name: '', internalType: 'uint24', type: 'uint24' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getHookPermissions',
    outputs: [
      {
        name: '',
        internalType: 'struct Hooks.Permissions',
        type: 'tuple',
        components: [
          { name: 'beforeInitialize', internalType: 'bool', type: 'bool' },
          { name: 'afterInitialize', internalType: 'bool', type: 'bool' },
          { name: 'beforeAddLiquidity', internalType: 'bool', type: 'bool' },
          { name: 'afterAddLiquidity', internalType: 'bool', type: 'bool' },
          { name: 'beforeRemoveLiquidity', internalType: 'bool', type: 'bool' },
          { name: 'afterRemoveLiquidity', internalType: 'bool', type: 'bool' },
          { name: 'beforeSwap', internalType: 'bool', type: 'bool' },
          { name: 'afterSwap', internalType: 'bool', type: 'bool' },
          { name: 'beforeDonate', internalType: 'bool', type: 'bool' },
          { name: 'afterDonate', internalType: 'bool', type: 'bool' },
          { name: 'beforeSwapReturnDelta', internalType: 'bool', type: 'bool' },
          { name: 'afterSwapReturnDelta', internalType: 'bool', type: 'bool' },
          {
            name: 'afterAddLiquidityReturnDelta',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'afterRemoveLiquidityReturnDelta',
            internalType: 'bool',
            type: 'bool',
          },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'poolManager',
    outputs: [
      { name: '', internalType: 'contract IPoolManager', type: 'address' },
    ],
    stateMutability: 'view',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'AfterAddLiquidity' },
  { type: 'event', anonymous: false, inputs: [], name: 'AfterDonate' },
  { type: 'event', anonymous: false, inputs: [], name: 'AfterInitialize' },
  { type: 'event', anonymous: false, inputs: [], name: 'AfterRemoveLiquidity' },
  { type: 'event', anonymous: false, inputs: [], name: 'AfterSwap' },
  { type: 'event', anonymous: false, inputs: [], name: 'BeforeAddLiquidity' },
  { type: 'event', anonymous: false, inputs: [], name: 'BeforeDonate' },
  { type: 'event', anonymous: false, inputs: [], name: 'BeforeInitialize' },
  {
    type: 'event',
    anonymous: false,
    inputs: [],
    name: 'BeforeRemoveLiquidity',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'BeforeSwap' },
  { type: 'error', inputs: [], name: 'HookNotImplemented' },
  { type: 'error', inputs: [], name: 'NotPoolManager' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link csmmAbi}__
 */
export const readCsmm = /*#__PURE__*/ createReadContract({ abi: csmmAbi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"getHookPermissions"`
 */
export const readCsmmGetHookPermissions = /*#__PURE__*/ createReadContract({
  abi: csmmAbi,
  functionName: 'getHookPermissions',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"poolManager"`
 */
export const readCsmmPoolManager = /*#__PURE__*/ createReadContract({
  abi: csmmAbi,
  functionName: 'poolManager',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link csmmAbi}__
 */
export const writeCsmm = /*#__PURE__*/ createWriteContract({ abi: csmmAbi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"addLiquidity"`
 */
export const writeCsmmAddLiquidity = /*#__PURE__*/ createWriteContract({
  abi: csmmAbi,
  functionName: 'addLiquidity',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"afterAddLiquidity"`
 */
export const writeCsmmAfterAddLiquidity = /*#__PURE__*/ createWriteContract({
  abi: csmmAbi,
  functionName: 'afterAddLiquidity',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"afterDonate"`
 */
export const writeCsmmAfterDonate = /*#__PURE__*/ createWriteContract({
  abi: csmmAbi,
  functionName: 'afterDonate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"afterInitialize"`
 */
export const writeCsmmAfterInitialize = /*#__PURE__*/ createWriteContract({
  abi: csmmAbi,
  functionName: 'afterInitialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"afterRemoveLiquidity"`
 */
export const writeCsmmAfterRemoveLiquidity = /*#__PURE__*/ createWriteContract({
  abi: csmmAbi,
  functionName: 'afterRemoveLiquidity',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"afterSwap"`
 */
export const writeCsmmAfterSwap = /*#__PURE__*/ createWriteContract({
  abi: csmmAbi,
  functionName: 'afterSwap',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"beforeAddLiquidity"`
 */
export const writeCsmmBeforeAddLiquidity = /*#__PURE__*/ createWriteContract({
  abi: csmmAbi,
  functionName: 'beforeAddLiquidity',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"beforeDonate"`
 */
export const writeCsmmBeforeDonate = /*#__PURE__*/ createWriteContract({
  abi: csmmAbi,
  functionName: 'beforeDonate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"beforeInitialize"`
 */
export const writeCsmmBeforeInitialize = /*#__PURE__*/ createWriteContract({
  abi: csmmAbi,
  functionName: 'beforeInitialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"beforeRemoveLiquidity"`
 */
export const writeCsmmBeforeRemoveLiquidity = /*#__PURE__*/ createWriteContract(
  { abi: csmmAbi, functionName: 'beforeRemoveLiquidity' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"beforeSwap"`
 */
export const writeCsmmBeforeSwap = /*#__PURE__*/ createWriteContract({
  abi: csmmAbi,
  functionName: 'beforeSwap',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"settleAsyncSwap"`
 */
export const writeCsmmSettleAsyncSwap = /*#__PURE__*/ createWriteContract({
  abi: csmmAbi,
  functionName: 'settleAsyncSwap',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"unlockCallback"`
 */
export const writeCsmmUnlockCallback = /*#__PURE__*/ createWriteContract({
  abi: csmmAbi,
  functionName: 'unlockCallback',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link csmmAbi}__
 */
export const prepareWriteCsmm = /*#__PURE__*/ createSimulateContract({
  abi: csmmAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"addLiquidity"`
 */
export const prepareWriteCsmmAddLiquidity =
  /*#__PURE__*/ createSimulateContract({
    abi: csmmAbi,
    functionName: 'addLiquidity',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"afterAddLiquidity"`
 */
export const prepareWriteCsmmAfterAddLiquidity =
  /*#__PURE__*/ createSimulateContract({
    abi: csmmAbi,
    functionName: 'afterAddLiquidity',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"afterDonate"`
 */
export const prepareWriteCsmmAfterDonate = /*#__PURE__*/ createSimulateContract(
  { abi: csmmAbi, functionName: 'afterDonate' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"afterInitialize"`
 */
export const prepareWriteCsmmAfterInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: csmmAbi,
    functionName: 'afterInitialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"afterRemoveLiquidity"`
 */
export const prepareWriteCsmmAfterRemoveLiquidity =
  /*#__PURE__*/ createSimulateContract({
    abi: csmmAbi,
    functionName: 'afterRemoveLiquidity',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"afterSwap"`
 */
export const prepareWriteCsmmAfterSwap = /*#__PURE__*/ createSimulateContract({
  abi: csmmAbi,
  functionName: 'afterSwap',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"beforeAddLiquidity"`
 */
export const prepareWriteCsmmBeforeAddLiquidity =
  /*#__PURE__*/ createSimulateContract({
    abi: csmmAbi,
    functionName: 'beforeAddLiquidity',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"beforeDonate"`
 */
export const prepareWriteCsmmBeforeDonate =
  /*#__PURE__*/ createSimulateContract({
    abi: csmmAbi,
    functionName: 'beforeDonate',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"beforeInitialize"`
 */
export const prepareWriteCsmmBeforeInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: csmmAbi,
    functionName: 'beforeInitialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"beforeRemoveLiquidity"`
 */
export const prepareWriteCsmmBeforeRemoveLiquidity =
  /*#__PURE__*/ createSimulateContract({
    abi: csmmAbi,
    functionName: 'beforeRemoveLiquidity',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"beforeSwap"`
 */
export const prepareWriteCsmmBeforeSwap = /*#__PURE__*/ createSimulateContract({
  abi: csmmAbi,
  functionName: 'beforeSwap',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"settleAsyncSwap"`
 */
export const prepareWriteCsmmSettleAsyncSwap =
  /*#__PURE__*/ createSimulateContract({
    abi: csmmAbi,
    functionName: 'settleAsyncSwap',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link csmmAbi}__ and `functionName` set to `"unlockCallback"`
 */
export const prepareWriteCsmmUnlockCallback =
  /*#__PURE__*/ createSimulateContract({
    abi: csmmAbi,
    functionName: 'unlockCallback',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link csmmAbi}__
 */
export const watchCsmmEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: csmmAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link csmmAbi}__ and `eventName` set to `"BeforeAddLiquidity"`
 */
export const watchCsmmBeforeAddLiquidityEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: csmmAbi,
    eventName: 'BeforeAddLiquidity',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link csmmAbi}__ and `eventName` set to `"BeforeSwap"`
 */
export const watchCsmmBeforeSwapEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: csmmAbi,
  eventName: 'BeforeSwap',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link counterHookAbi}__
 */
export const readCounterHook = /*#__PURE__*/ createReadContract({
  abi: counterHookAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"getHookPermissions"`
 */
export const readCounterHookGetHookPermissions =
  /*#__PURE__*/ createReadContract({
    abi: counterHookAbi,
    functionName: 'getHookPermissions',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"poolManager"`
 */
export const readCounterHookPoolManager = /*#__PURE__*/ createReadContract({
  abi: counterHookAbi,
  functionName: 'poolManager',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link counterHookAbi}__
 */
export const writeCounterHook = /*#__PURE__*/ createWriteContract({
  abi: counterHookAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"afterAddLiquidity"`
 */
export const writeCounterHookAfterAddLiquidity =
  /*#__PURE__*/ createWriteContract({
    abi: counterHookAbi,
    functionName: 'afterAddLiquidity',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"afterDonate"`
 */
export const writeCounterHookAfterDonate = /*#__PURE__*/ createWriteContract({
  abi: counterHookAbi,
  functionName: 'afterDonate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"afterInitialize"`
 */
export const writeCounterHookAfterInitialize =
  /*#__PURE__*/ createWriteContract({
    abi: counterHookAbi,
    functionName: 'afterInitialize',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"afterRemoveLiquidity"`
 */
export const writeCounterHookAfterRemoveLiquidity =
  /*#__PURE__*/ createWriteContract({
    abi: counterHookAbi,
    functionName: 'afterRemoveLiquidity',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"afterSwap"`
 */
export const writeCounterHookAfterSwap = /*#__PURE__*/ createWriteContract({
  abi: counterHookAbi,
  functionName: 'afterSwap',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"beforeAddLiquidity"`
 */
export const writeCounterHookBeforeAddLiquidity =
  /*#__PURE__*/ createWriteContract({
    abi: counterHookAbi,
    functionName: 'beforeAddLiquidity',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"beforeDonate"`
 */
export const writeCounterHookBeforeDonate = /*#__PURE__*/ createWriteContract({
  abi: counterHookAbi,
  functionName: 'beforeDonate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"beforeInitialize"`
 */
export const writeCounterHookBeforeInitialize =
  /*#__PURE__*/ createWriteContract({
    abi: counterHookAbi,
    functionName: 'beforeInitialize',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"beforeRemoveLiquidity"`
 */
export const writeCounterHookBeforeRemoveLiquidity =
  /*#__PURE__*/ createWriteContract({
    abi: counterHookAbi,
    functionName: 'beforeRemoveLiquidity',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"beforeSwap"`
 */
export const writeCounterHookBeforeSwap = /*#__PURE__*/ createWriteContract({
  abi: counterHookAbi,
  functionName: 'beforeSwap',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link counterHookAbi}__
 */
export const prepareWriteCounterHook = /*#__PURE__*/ createSimulateContract({
  abi: counterHookAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"afterAddLiquidity"`
 */
export const prepareWriteCounterHookAfterAddLiquidity =
  /*#__PURE__*/ createSimulateContract({
    abi: counterHookAbi,
    functionName: 'afterAddLiquidity',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"afterDonate"`
 */
export const prepareWriteCounterHookAfterDonate =
  /*#__PURE__*/ createSimulateContract({
    abi: counterHookAbi,
    functionName: 'afterDonate',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"afterInitialize"`
 */
export const prepareWriteCounterHookAfterInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: counterHookAbi,
    functionName: 'afterInitialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"afterRemoveLiquidity"`
 */
export const prepareWriteCounterHookAfterRemoveLiquidity =
  /*#__PURE__*/ createSimulateContract({
    abi: counterHookAbi,
    functionName: 'afterRemoveLiquidity',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"afterSwap"`
 */
export const prepareWriteCounterHookAfterSwap =
  /*#__PURE__*/ createSimulateContract({
    abi: counterHookAbi,
    functionName: 'afterSwap',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"beforeAddLiquidity"`
 */
export const prepareWriteCounterHookBeforeAddLiquidity =
  /*#__PURE__*/ createSimulateContract({
    abi: counterHookAbi,
    functionName: 'beforeAddLiquidity',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"beforeDonate"`
 */
export const prepareWriteCounterHookBeforeDonate =
  /*#__PURE__*/ createSimulateContract({
    abi: counterHookAbi,
    functionName: 'beforeDonate',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"beforeInitialize"`
 */
export const prepareWriteCounterHookBeforeInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: counterHookAbi,
    functionName: 'beforeInitialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"beforeRemoveLiquidity"`
 */
export const prepareWriteCounterHookBeforeRemoveLiquidity =
  /*#__PURE__*/ createSimulateContract({
    abi: counterHookAbi,
    functionName: 'beforeRemoveLiquidity',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link counterHookAbi}__ and `functionName` set to `"beforeSwap"`
 */
export const prepareWriteCounterHookBeforeSwap =
  /*#__PURE__*/ createSimulateContract({
    abi: counterHookAbi,
    functionName: 'beforeSwap',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link counterHookAbi}__
 */
export const watchCounterHookEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: counterHookAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link counterHookAbi}__ and `eventName` set to `"AfterAddLiquidity"`
 */
export const watchCounterHookAfterAddLiquidityEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: counterHookAbi,
    eventName: 'AfterAddLiquidity',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link counterHookAbi}__ and `eventName` set to `"AfterDonate"`
 */
export const watchCounterHookAfterDonateEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: counterHookAbi,
    eventName: 'AfterDonate',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link counterHookAbi}__ and `eventName` set to `"AfterInitialize"`
 */
export const watchCounterHookAfterInitializeEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: counterHookAbi,
    eventName: 'AfterInitialize',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link counterHookAbi}__ and `eventName` set to `"AfterRemoveLiquidity"`
 */
export const watchCounterHookAfterRemoveLiquidityEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: counterHookAbi,
    eventName: 'AfterRemoveLiquidity',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link counterHookAbi}__ and `eventName` set to `"AfterSwap"`
 */
export const watchCounterHookAfterSwapEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: counterHookAbi,
    eventName: 'AfterSwap',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link counterHookAbi}__ and `eventName` set to `"BeforeAddLiquidity"`
 */
export const watchCounterHookBeforeAddLiquidityEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: counterHookAbi,
    eventName: 'BeforeAddLiquidity',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link counterHookAbi}__ and `eventName` set to `"BeforeDonate"`
 */
export const watchCounterHookBeforeDonateEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: counterHookAbi,
    eventName: 'BeforeDonate',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link counterHookAbi}__ and `eventName` set to `"BeforeInitialize"`
 */
export const watchCounterHookBeforeInitializeEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: counterHookAbi,
    eventName: 'BeforeInitialize',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link counterHookAbi}__ and `eventName` set to `"BeforeRemoveLiquidity"`
 */
export const watchCounterHookBeforeRemoveLiquidityEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: counterHookAbi,
    eventName: 'BeforeRemoveLiquidity',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link counterHookAbi}__ and `eventName` set to `"BeforeSwap"`
 */
export const watchCounterHookBeforeSwapEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: counterHookAbi,
    eventName: 'BeforeSwap',
  })
