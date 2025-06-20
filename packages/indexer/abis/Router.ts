export const RouterAbi = [
	{
		type: "constructor",
		inputs: [
			{
				name: "_poolManager",
				type: "address",
				internalType: "contract IPoolManager",
			},
			{
				name: "_hook",
				type: "address",
				internalType: "contract IAsyncCSMM",
			},
		],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "fillOrder",
		inputs: [
			{
				name: "order",
				type: "tuple",
				internalType: "struct IAsyncSwap.AsyncOrder",
				components: [
					{
						name: "key",
						type: "tuple",
						internalType: "struct PoolKey",
						components: [
							{
								name: "currency0",
								type: "address",
								internalType: "Currency",
							},
							{
								name: "currency1",
								type: "address",
								internalType: "Currency",
							},
							{
								name: "fee",
								type: "uint24",
								internalType: "uint24",
							},
							{
								name: "tickSpacing",
								type: "int24",
								internalType: "int24",
							},
							{
								name: "hooks",
								type: "address",
								internalType: "contract IHooks",
							},
						],
					},
					{
						name: "owner",
						type: "address",
						internalType: "address",
					},
					{
						name: "zeroForOne",
						type: "bool",
						internalType: "bool",
					},
					{
						name: "amountIn",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "sqrtPrice",
						type: "uint160",
						internalType: "uint160",
					},
				],
			},
			{
				name: "",
				type: "bytes",
				internalType: "bytes",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "swap",
		inputs: [
			{
				name: "order",
				type: "tuple",
				internalType: "struct IAsyncSwap.AsyncOrder",
				components: [
					{
						name: "key",
						type: "tuple",
						internalType: "struct PoolKey",
						components: [
							{
								name: "currency0",
								type: "address",
								internalType: "Currency",
							},
							{
								name: "currency1",
								type: "address",
								internalType: "Currency",
							},
							{
								name: "fee",
								type: "uint24",
								internalType: "uint24",
							},
							{
								name: "tickSpacing",
								type: "int24",
								internalType: "int24",
							},
							{
								name: "hooks",
								type: "address",
								internalType: "contract IHooks",
							},
						],
					},
					{
						name: "owner",
						type: "address",
						internalType: "address",
					},
					{
						name: "zeroForOne",
						type: "bool",
						internalType: "bool",
					},
					{
						name: "amountIn",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "sqrtPrice",
						type: "uint160",
						internalType: "uint160",
					},
				],
			},
			{
				name: "userData",
				type: "bytes",
				internalType: "bytes",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "unlockCallback",
		inputs: [
			{
				name: "data",
				type: "bytes",
				internalType: "bytes",
			},
		],
		outputs: [
			{
				name: "",
				type: "bytes",
				internalType: "bytes",
			},
		],
		stateMutability: "nonpayable",
	},
] as const;
