import { defineConfig } from "@wagmi/cli";
import { foundry, react, actions } from "@wagmi/cli/plugins";

export default defineConfig({
	out: "abis/generated.ts",
	contracts: [],
	plugins: [
		actions({
			getActionName: "legacy",
			overridePackageName: "@ wagmi",
		}),
		foundry({
			project: "../../",
			artifacts: "out",
			forge: {
				clean: true,
				build: true,
				path: "~/.foundry/bin/forge",
				rebuild: true,
			},
			include: ["*.json"],
			exclude: [],
		}),
	],
});
