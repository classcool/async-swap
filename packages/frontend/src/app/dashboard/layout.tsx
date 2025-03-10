"use client";

import { useEffect } from "react";
import { AppSidebar } from "../../components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSelectedLayoutSegments } from "next/navigation";
import { toast } from "sonner";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const segments = useSelectedLayoutSegments();

	useEffect(() => {
		const socket = new WebSocket("ws://localhost:8080");
		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			toast(data.message, {
				description: (
					<>
						<p className="text-sm">liquidity: {data.liquidityDelta}</p>
					</>
				),
			});
		};

		return () => socket.close();
	}, []);
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								{segments.map((segment, index) => {
									return (
										<div className="flex items-center gap-2" key={index}>
											<BreadcrumbItem className="hidden md:block">
												<BreadcrumbLink
													href={`/dashboard/${segments.slice(0, index + 1).join("/")}`}
												>
													{segment}
												</BreadcrumbLink>
											</BreadcrumbItem>
											<BreadcrumbSeparator className="hidden md:block" />
										</div>
									);
								})}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
