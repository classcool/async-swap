"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import { getConfig } from "@/wagmi";
import { ThemeProvider } from "next-themes";

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
					{props.children}
				</QueryClientProvider>
			</WagmiProvider>
		</ThemeProvider>
	);
}
