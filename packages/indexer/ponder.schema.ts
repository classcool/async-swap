import { index, onchainTable, primaryKey, relations, timestamp } from "ponder";

export const user = onchainTable("user", (t) => ({
	sender: t.hex().notNull().primaryKey(),
	chainId: t.integer().notNull(),
	totalSwaps: t.integer().notNull().default(0),
	totalLiquiditys: t.integer().notNull().default(0),
	totalTransfers: t.integer().notNull().default(0),
	totalInitialized: t.integer().notNull().default(0),
	timestamp: t
		.bigint()
		.default(BigInt(Math.floor(new Date().getTime() / 1000))),
}));

export const order = onchainTable(
	"order",
	(t) => ({
		chainId: t.integer().notNull(),
		owner: t.hex().notNull(),
		poolId: t.hex().notNull(),
		amountIn: t.bigint().notNull(),
		zeroForOne: t.boolean().notNull(),
		orderStatus: t.boolean().notNull().default(false),
		timestamp: t
			.bigint()
			.default(BigInt(Math.floor(new Date().getTime() / 1000))),
	}),
	(table) => ({
		pk: primaryKey({
			columns: [table.chainId, table.owner, table.poolId, table.zeroForOne],
		}),
	}),
);

export const currency = onchainTable(
	"currency",
	(t) => ({
		address: t.hex().notNull().primaryKey(),
		name: t.text().notNull().default(""),
		symbol: t.text().notNull().default(""),
		decimals: t.integer().notNull().default(18),
		chainId: t.integer().notNull(),
	}),
	(table) => ({
		chainIdIndex: index().on(table.chainId),
	}),
);

export const hook = onchainTable(
	"hook",
	(t) => ({
		hookAddress: t.hex().notNull(),
		chainId: t.integer().notNull(),
		timestamp: t
			.bigint()
			.default(BigInt(Math.floor(new Date().getTime() / 1000))),
	}),
	(table) => ({
		pk: primaryKey({ columns: [table.hookAddress, table.chainId] }),
		chainIdIndex: index().on(table.chainId),
	}),
);

export const pool = onchainTable(
	"pool",
	(t) => ({
		poolId: t.hex().notNull(),
		currency0: t.hex().notNull(),
		currency1: t.hex().notNull(),
		fee: t.integer().notNull(),
		tickSpacing: t.integer().notNull(),
		hooks: t.hex().notNull(),
		sqrtPriceX96: t.bigint().notNull(),
		tick: t.integer().notNull(),
		chainId: t.integer().notNull(),
		timestamp: t
			.bigint()
			.default(BigInt(Math.floor(new Date().getTime() / 1000))),
	}),
	(table) => ({
		pk: primaryKey({ columns: [table.poolId, table.chainId] }),
		chainIdIndex: index().on(table.chainId),
	}),
);

export const liquidity = onchainTable(
	"liquidity",
	(t) => ({
		id: t.hex().notNull(),
		poolId: t.hex().notNull(),
		sender: t.hex().notNull(),
		tickLower: t.integer().notNull(),
		tickUpper: t.integer().notNull(),
		liquidityDelta: t.bigint().notNull(),
		salt: t.hex().notNull(),
		chainId: t.integer().notNull(),
		timestamp: t
			.bigint()
			.default(BigInt(Math.floor(new Date().getTime() / 1000))),
	}),
	(table) => ({
		pk: primaryKey({
			columns: [
				table.poolId,
				table.sender,
				table.chainId,
				table.tickLower,
				table.tickUpper,
			],
		}),
	}),
);

export const operator = onchainTable(
	"operator",
	(t) => ({
		owner: t.hex().notNull(),
		operator: t.hex().notNull(),
		approved: t.boolean(),
		chainId: t.integer().notNull(),
		timestamp: t
			.bigint()
			.default(BigInt(Math.floor(new Date().getTime() / 1000))),
	}),

	(table) => ({
		pk: primaryKey({ columns: [table.owner, table.operator, table.chainId] }),
		chainIdIndex: index().on(table.chainId),
	}),
);

export const swap = onchainTable(
	"swap",
	(t) => ({
		id: t.text().notNull(),
		poolId: t.hex().notNull(),
		sender: t.hex().notNull(),
		amount0: t.bigint().notNull(),
		amount1: t.bigint().notNull(),
		sqrtPrice: t.bigint().notNull(),
		liquidity: t.bigint().notNull(),
		tick: t.integer().notNull(),
		fee: t.integer().notNull(),
		chainId: t.integer().notNull(),
		timestamp: t
			.bigint()
			.default(BigInt(Math.floor(new Date().getTime() / 1000))),
	}),
	(table) => ({
		pk: primaryKey({
			columns: [table.chainId, table.id, table.poolId, table.sender],
		}),
		poolIdIndex: index().on(table.poolId),
		chainIdIndex: index().on(table.chainId),
	}),
);

export const transfer = onchainTable(
	"transfer",
	(t) => ({
		hash: t.text().notNull(),
		caller: t.hex().notNull(),
		from: t.hex().notNull(),
		to: t.hex().notNull(),
		erc6909Id: t.hex().notNull(),
		amount: t.bigint().notNull(),
		chainId: t.integer().notNull(),
		timestamp: t
			.bigint()
			.default(BigInt(Math.floor(new Date().getTime() / 1000))),
	}),
	(table) => ({
		pk: primaryKey({
			columns: [
				table.hash,
				table.chainId,
				table.from,
				table.erc6909Id,
				table.to,
			],
		}),
		fromIndex: index().on(table.from),
		idIndex: index().on(table.erc6909Id),
		chainIdIndex: index().on(table.chainId),
	}),
);

export const operatorRelations = relations(operator, ({ one, many }) => ({
	user: many(user),
}));

export const userRelations = relations(user, ({ one, many }) => ({
	liquidity: many(liquidity),
	swap: many(swap),
	transfer: many(transfer),
	operator: one(operator, {
		fields: [user.chainId],
		references: [operator.chainId],
	}),
}));

export const hookRelations = relations(hook, ({ many }) => ({
	pools: many(pool),
}));

export const poolRelations = relations(pool, ({ one, many }) => ({
	liquidity: many(liquidity),
	swap: many(swap),
	hook: one(hook, {
		fields: [pool.hooks],
		references: [hook.hookAddress],
	}),
	token0: one(currency, {
		fields: [pool.currency0],
		references: [currency.address],
	}),
	token1: one(currency, {
		fields: [pool.currency1, pool.chainId],
		references: [currency.address, currency.chainId],
	}),
}));

export const liquidityRelations = relations(liquidity, ({ one }) => ({
	pool: one(pool, {
		fields: [liquidity.chainId],
		references: [pool.chainId],
	}),
	user: one(user, {
		fields: [liquidity.chainId],
		references: [user.chainId],
	}),
	swap: one(swap, {
		fields: [liquidity.chainId],
		references: [swap.chainId],
	}),
}));

export const swapPoolRelations = relations(swap, ({ one }) => ({
	pool: one(pool, {
		fields: [swap.poolId, swap.chainId],
		references: [pool.poolId, pool.chainId],
	}),
	user: one(user, {
		fields: [swap.chainId],
		references: [user.chainId],
	}),
}));

export const transferRelations = relations(transfer, ({ one }) => ({
	// NOTE erc6909 converted to type hex address
	currency: one(currency, {
		fields: [transfer.chainId],
		references: [currency.chainId],
	}),
	user: one(user, {
		fields: [transfer.chainId],
		references: [user.chainId],
	}),
}));
