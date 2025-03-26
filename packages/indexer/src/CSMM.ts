import { ponder } from "ponder:registry";
import schema from "ponder:schema";
import { toHex } from "viem";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const clients: WebSocket[] = [];

wss.on("connection", (ws: WebSocket) => {
	clients.push(ws);
});

ponder.on("CsmmHook:BeforeAddLiquidity", async ({ event, context }) => {
	await context.db.insert(schema.liquidity).values({
		id: event.transaction.hash,
		poolId: event.args.poolId,
		sender: event.args.sender,
		tickLower: 0,
		tickUpper: 0,
		liquidityDelta: event.args.liquidityDelta,
		salt: toHex(0),
		chainId: context.network.chainId,
	});

	for (const client of clients) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					message: "Add Liquidity",
					poolId: event.args.poolId,
					sender: event.args.sender,
					liquidityDelta: toHex(event.args.liquidityDelta),
				}),
			);
		}
	}
});

ponder.on("CsmmHook:BeforeSwap", async ({ event, context }) => {
	await context.db.insert(schema.order).values({
		chainId: context.network.chainId,
		owner: event.args.owner,
		nonce: event.args.nonce,
		poolId: event.args.poolId,
		zeroForOne: event.args.zeroForOne,
		amountIn: BigInt(event.args.amountIn),
	});
});
