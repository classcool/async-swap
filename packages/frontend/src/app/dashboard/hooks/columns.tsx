"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export type HookType = {
	chainId: number;
	hookAddress: string;
};

export const columns: ColumnDef<HookType>[] = [
	{
		id: "actions",
		cell: ({ row }) => {
			const pool = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(pool.hookAddress)}
						>
							Copy Hook Address
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
	{
		accessorKey: "chainId",
		header: "ChainId",
	},
	{
		accessorKey: "hookAddress",
		header: "Hook",
	},
];
