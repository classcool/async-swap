import { ponder } from "ponder:registry";
import schema from "ponder:schema";
import { toHex } from "viem";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
let clients: WebSocket[] = [];

wss.on("connection", (ws) => {
	clients.push(ws);
});

ponder.on("RemittanceHook:BeforeAddLiquidity", async ({ event, context }) => {
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

	clients.forEach((client) => {
		if (client.readyState == WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					message: "Add Liquidity",
					poolId: event.args.poolId,
					sender: event.args.sender,
					liquidityDelta: toHex(event.args.liquidityDelta),
				}),
			);
		}
	});
});

ponder.on("RemittanceHook:BeforeSwap", async ({ event, context }) => {
	console.log(event.args);
});
