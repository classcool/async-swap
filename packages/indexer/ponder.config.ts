import { createConfig } from "ponder";
import { http, getAddress, hexToNumber } from "viem";
import type { Hex } from "viem";
import DeployPoolManager from "../../broadcast/00_DeployPoolManager.s.sol/31337/run-latest.json";
import DeployHook from "../../broadcast/01_DeployHook.s.sol/31337/run-latest.json";
import { PoolManagerAbi } from "./abis/PoolManagerAbi";
import { counterHookAbi, csmmAbi } from "./abis/generated";

const poolManagerAddress = getAddress(
	DeployPoolManager.transactions[0]?.contractAddress,
);
const poolManagerStartBlock = hexToNumber(
	DeployPoolManager.receipts[0]?.blockNumber as Hex,
);

const hookAddress = getAddress(DeployHook.transactions[0]?.contractAddress);
const hookStartBlock = hexToNumber(DeployHook.receipts[0]?.blockNumber as Hex);

export default createConfig({
	networks: {
		anvil: {
			chainId: 31337,
			transport: http("http://127.0.0.1:8545"),
			disableCache: true,
		},
		unichain: {
			chainId: 130,
			transport: http(process.env.PONDER_RPC_URL_130),
		},
	},
	contracts: {
		PoolManager: {
			network: {
				anvil: {
					address: poolManagerAddress,
					startBlock: poolManagerStartBlock,
				},
				unichain: {
					address: "0x1f98400000000000000000000000000000000004",
					startBlock: 0,
				},
			},
			abi: PoolManagerAbi,
		},
		CounterHook: {
			network: {
				anvil: {
					address: hookAddress,
					startBlock: hookStartBlock,
				},
			},
			abi: counterHookAbi,
		},
		CsmmHook: {
			network: {
				anvil: {
					address: hookAddress,
					startBlock: hookStartBlock,
				},
			},
			abi: csmmAbi,
		},
	},
});
