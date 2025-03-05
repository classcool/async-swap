import { createConfig } from "ponder";
import { getAddress, http, hexToNumber } from "viem";
import type { Hex } from "viem";
import { PoolManagerAbi } from "./abis/PoolManagerAbi";
import { counterHookAbi } from "./abis/generated";
import DeployPoolManager from "../../broadcast/00_DeployPoolManager.s.sol/31337/run-latest.json";
import DeployHook from "../../broadcast/01_DeployHook.s.sol/31337/run-latest.json";

const poolManagerAddress = getAddress(
	DeployPoolManager.transactions[0]!.contractAddress,
);
const poolManagerStartBlock = hexToNumber(
	DeployPoolManager.receipts[0]!.blockNumber as Hex,
);

const hookAddress = getAddress(DeployHook.transactions[0]!.contractAddress);
const hookStartBlock = hexToNumber(DeployHook.receipts[0]!.blockNumber as Hex);

export default createConfig({
	networks: {
		anvil: {
			chainId: 31337,
			transport: http("http://127.0.0.1:8545"),
			disableCache: true,
		},
	},
	contracts: {
		PoolManager: {
			network: {
				anvil: {
					address: poolManagerAddress,
					startBlock: poolManagerStartBlock,
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
	},
});
