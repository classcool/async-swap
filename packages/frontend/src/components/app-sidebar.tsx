"use client";

import type * as React from "react";
import {
	BookOpen,
	WavesLadder,
	LifeBuoy,
	Send,
	Settings2,
	LayoutDashboard,
	Waves,
	Unplug,
	ChartCandlestick,
	KeySquare,
} from "lucide-react";
import Link from "next/link";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: LayoutDashboard,
		},
		{
			title: "Hooks",
			url: "/dashboard/hooks",
			icon: Unplug,
		},
		{
			title: "Pools",
			url: "/dashboard/pools",
			icon: Waves,
		},
		{
			title: "Currencies",
			url: "/dashboard/currencies",
			icon: ChartCandlestick,
		},
		{
			title: "Liquidity",
			url: "/dashboard/liquidity",
			icon: WavesLadder,
			items: [
				{
					title: "Add",
					url: "/dashboard/liquidity/add",
				},
				{
					title: "Positions",
					url: "/dashboard/liquidity/positions",
				},
			],
		},
		{
			title: "Operators",
			url: "/dashboard/operators",
			icon: KeySquare,
		},
		{
			title: "Documentation",
			url: "/dashboard/documentation",
			icon: BookOpen,
			items: [
				{
					title: "Introduction",
					url: "/dashboard/documentation/introduction",
				},
				{
					title: "Get Started",
					url: "/dashboard/documentation/get-started",
				},
				{
					title: "Tutorials",
					url: "/dashboard/documentation/tutorials",
				},
			],
		},
		{
			title: "Settings",
			url: "#",
			icon: Settings2,
			items: [
				{
					title: "General",
					url: "#",
				},
				{
					title: "Team",
					url: "#",
				},
				{
					title: "Billing",
					url: "#",
				},
				{
					title: "Limits",
					url: "#",
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Support",
			url: "http://x.com/share?text=Yo! Make your shit work 🥲 @msakiart ",
			icon: LifeBuoy,
		},
		{
			title: "Feedback",
			url: "mailto:meek10x@gmail.com?subject=Feedback&body=Hey%20Meek,%0A%0AWanted to share some feedback!%0A%0A[ENTER FEEDBACK HERE]%0A%0ACheers!",
			icon: Send,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/dashboard">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									🪝
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">V4 Hook</span>
									<span className="truncate text-xs">Free</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
