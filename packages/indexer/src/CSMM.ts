import { ponder } from "ponder:registry";
import schema from "ponder:schema";
import { toHex } from "viem";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const clients: WebSocket[] = [];

wss.on("connection", (ws: WebSocket) => {
	clients.push(ws);
});

ponder.on("CsmmHook:HookModifyLiquidity", async ({ event, context }) => {
	await context.db
		.insert(schema.user)
		.values({
			sender: event.transaction.from,
			chainId: context.network.chainId,
			totalLiquiditys: 1,
			timestamp: event.block.timestamp,
		})
		.onConflictDoUpdate((row) => ({
			totalLiquiditys: row.totalLiquiditys + 1,
			timestamp: event.block.timestamp,
		}));

	for (const client of clients) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					message: "Add Liquidity",
					poolId: event.args.id,
					sender: event.args.sender,
					amount0: toHex(event.args.amount0),
					amount1: toHex(event.args.amount1),
				}),
			);
		}
	}
});

ponder.on("CsmmHook:AsyncSwapOrder", async ({ event, context }) => {
	await context.db
		.insert(schema.order)
		.values({
			chainId: context.network.chainId,
			owner: event.args.owner,
			poolId: event.args.poolId,
			zeroForOne: event.args.zeroForOne,
			amountIn: event.args.amountIn,
			timestamp: event.block.timestamp,
		})
		.onConflictDoUpdate((row) => ({
			orderStatus: false,
			amountIn: row.amountIn + event.args.amountIn,
			timestamp: event.block.timestamp,
		}));
});

ponder.on("CsmmHook:AsyncOrderFilled", async ({ event, context }) => {
	await context.db
		.insert(schema.order)
		.values({
			chainId: context.network.chainId,
			poolId: event.args.poolId,
			owner: event.args.owner,
			zeroForOne: event.args.zeroForOne,
			amountIn: event.args.amount,
			timestamp: event.block.timestamp,
			orderStatus: false,
		})
		.onConflictDoUpdate((row) => {
			const orderDiff = row.amountIn - event.args.amount;
			if (orderDiff === BigInt(0)) {
				return {
					amountIn: orderDiff,
					orderStatus: true,
					timestamp: event.block.timestamp,
				};
			}
			return {
				orderStatus: false,
				amountIn: orderDiff,
				timestamp: event.block.timestamp,
			};
		});
});
