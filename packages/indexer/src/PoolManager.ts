import { ponder } from "ponder:registry";
import schema from "ponder:schema";
import { toHex } from "viem";
import { ERC20Abi } from "../abis/ERC20Abi";

ponder.on("PoolManager:Initialize", async ({ event, context }) => {
	let name0: string;
	let symbol0: string;
	let decimals0: number;
	let name1: string;
	let symbol1: string;
	let decimals1: number;
	if (event.args.currency0 === "0x0000000000000000000000000000000000000000") {
		name0 = "Ether";
		symbol0 = "ETH";
		decimals0 = 18;
	} else {
		try {
			name0 = await context.client.readContract({
				abi: ERC20Abi,
				address: event.args.currency0,
				functionName: "name",
			});
		} catch (error) {
			name0 = "Unknown";
		}

		try {
			symbol0 = await context.client.readContract({
				abi: ERC20Abi,
				address: event.args.currency0,
				functionName: "symbol",
			});
		} catch (error) {
			symbol0 = "Unknown";
		}

		try {
			decimals0 = await context.client.readContract({
				abi: ERC20Abi,
				address: event.args.currency0,
				functionName: "decimals",
			});
		} catch (error) {
			decimals0 = 18;
		}
	}

	try {
		name1 = await context.client.readContract({
			abi: ERC20Abi,
			address: event.args.currency1,
			functionName: "name",
		});
	} catch (error) {
		name1 = "UNKNOWN";
	}

	try {
		symbol1 = await context.client.readContract({
			abi: ERC20Abi,
			address: event.args.currency1,
			functionName: "symbol",
		});
	} catch (error) {
		symbol1 = "UNKNOWN";
	}
	try {
		decimals1 = await context.client.readContract({
			abi: ERC20Abi,
			address: event.args.currency1,
			functionName: "decimals",
		});
	} catch (error) {
		decimals1 = 18;

	}

	await context.db
		.insert(schema.currency)
		.values({
			address: event.args.currency0,
			name: name0,
			symbol: symbol0,
			decimals: decimals0,
			chainId: context.network.chainId,
		})
		.onConflictDoNothing();

	await context.db
		.insert(schema.currency)
		.values({
			address: event.args.currency1,
			name: name1,
			symbol: symbol1,
			decimals: decimals1,
			chainId: context.network.chainId,
		})
		.onConflictDoNothing();

	await context.db
		.insert(schema.hook)
		.values({
			hookAddress: event.args.hooks,
			chainId: context.network.chainId,
		})
		.onConflictDoNothing();

	await context.db
		.insert(schema.pool)
		.values({
			poolId: event.args.id,
			currency0: event.args.currency0,
			currency1: event.args.currency1,
			fee: event.args.fee,
			tickSpacing: event.args.tickSpacing,
			hooks: event.args.hooks,
			sqrtPriceX96: event.args.sqrtPriceX96,
			tick: event.args.tick,
			chainId: context.network.chainId,
		})
		.onConflictDoNothing();
});

ponder.on("PoolManager:Transfer", async ({ event, context }) => {
	await context.db
		.insert(schema.transfer)
		.values({
			id: event.transaction.hash,
			caller: event.args.caller,
			from: event.args.from,
			to: event.args.to,
			erc6909Id:
				toHex(event.args.id) === "0x00"
					? "0x0000000000000000000000000000000000000000"
					: toHex(event.args.id),
			amount: event.args.amount,
			chainId: context.network.chainId,
		})
		.onConflictDoUpdate({
			amount: event.args.amount,
		});

	await context.db
		.insert(schema.user)
		.values({
			sender: event.args.to,
			chainId: context.network.chainId,
		})
		.onConflictDoNothing();

	await context.db
		.insert(schema.user)
		.values({
			sender: event.args.from,
			chainId: context.network.chainId,
		})
		.onConflictDoNothing();

	await context.db
		.insert(schema.user)
		.values({
			sender: event.args.caller,
			chainId: context.network.chainId,
		})
		.onConflictDoNothing();
});

ponder.on("PoolManager:Approval", async ({ event, context }) => {
	console.log(event.args);
});

ponder.on("PoolManager:Swap", async ({ event, context }) => {
	await context.db.insert(schema.swap).values({
		id: event.log.id,
		poolId: event.args.id,
		sender: event.args.sender,
		amount0: event.args.amount0,
		amount1: event.args.amount1,
		sqrtPrice: event.args.sqrtPriceX96,
		liquidity: event.args.liquidity,
		tick: event.args.tick,
		fee: event.args.fee,
		chainId: context.network.chainId,
	});

	await context.db
		.insert(schema.user)
		.values({
			sender: event.args.sender,
			chainId: context.network.chainId,
		})
		.onConflictDoNothing();
});

ponder.on("PoolManager:OperatorSet", async ({ event, context }) => {
	await context.db
		.insert(schema.operator)
		.values({
			owner: event.args.owner,
			operator: event.args.operator,
			approved: event.args.approved,
			chainId: context.network.chainId,
		})
		.onConflictDoUpdate({
			approved: event.args.approved,
		});

	await context.db
		.insert(schema.user)
		.values({
			sender: event.args.owner,
			chainId: context.network.chainId,
		})
		.onConflictDoNothing();

	await context.db
		.insert(schema.user)
		.values({
			sender: event.args.operator,
			chainId: context.network.chainId,
		})
		.onConflictDoNothing();
});

ponder.on("PoolManager:Donate", async ({ event, context }) => {
	console.log(event.args);
});

ponder.on(
	"PoolManager:ModifyLiquidity",
	async ({ event, context }): Promise<void> => {
		await context.db
			.insert(schema.liquidity)
			.values({
				id: event.transaction.hash,
				poolId: event.args.id,
				sender: event.args.sender,
				tickLower: event.args.tickLower,
				tickUpper: event.args.tickUpper,
				liquidityDelta: event.args.liquidityDelta,
				salt: event.args.salt,
				chainId: context.network.chainId,
			})
			.onConflictDoUpdate({ liquidityDelta: event.args.liquidityDelta });

		await context.db
			.insert(schema.user)
			.values({
				sender: event.transaction.from,
				chainId: context.network.chainId,
			})
			.onConflictDoNothing();
		await context.db
			.insert(schema.user)
			.values({
				sender: event.args.sender,
				chainId: context.network.chainId,
			})
			.onConflictDoNothing();
	},
);
