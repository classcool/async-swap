"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { getConfig } from "@/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";

export function Providers(props: {
	children: ReactNode;
	initialState?: State;
}) {
	const [config] = useState(() => getConfig());
	const [queryClient] = useState(() => new QueryClient());

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
			disableTransitionOnChange
		>
			<WagmiProvider config={config} initialState={props.initialState}>
				<QueryClientProvider client={queryClient}>
					<TooltipProvider>{props.children}</TooltipProvider>
				</QueryClientProvider>
			</WagmiProvider>
		</ThemeProvider>
	);
}
