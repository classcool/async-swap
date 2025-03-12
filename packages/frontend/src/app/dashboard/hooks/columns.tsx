"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Code, Copy, MoreHorizontal } from "lucide-react";

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
						{pool.hookAddress !==
						"0x0000000000000000000000000000000000000000" ? (
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						) : (
							<></>
						)}
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(pool.hookAddress)}
						>
							<>
								<Copy />
								Copy Address
							</>
						</DropdownMenuItem>
						{pool.chainId === 130 &&
						pool.hookAddress !==
							"0x0000000000000000000000000000000000000000" ? (
							<DropdownMenuItem
								onClick={() =>
									window.open(
										`https://uniscan.xyz/address/${pool.hookAddress}#code`,
									)
								}
							>
								<>
									<Code />
									View Code
								</>
							</DropdownMenuItem>
						) : (
							<></>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
	{
		accessorKey: "chainId",
		cell: ({ row }) => {
			const pool = row.original;
			return (
				<>
					{pool.chainId === 31337 ? (
						<>
							{pool.chainId}
							<Badge variant="destructive" className="ml-4">
								testnet
							</Badge>
						</>
					) : (
						<>{pool.chainId}</>
					)}
				</>
			);
		},
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					ChainId
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "hookAddress",
		header: "Hook",
	},
];
