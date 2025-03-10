"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Pool = {
	chainId: number;
	currency0: string;
	currency1: string;
	fee: number;
	hooks: string;
	sqrtPriceX96: bigint;
	tick: number;
	tickSpacing: number;
	token0: Token;
	token1: Token;
};

export type Token = {
	chainId: number;
	name: string;
	symbol: string;
	decimals: string;
};

export const columns: ColumnDef<Pool>[] = [
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const pool = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(pool.hooks)}
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
		accessorKey: "currency0",
		header: "Currency0",
	},
	{
		accessorKey: "currency1",
		header: "Currency1",
	},
	{
		accessorKey: "hooks",
		header: "Hooks",
	},
	{
		accessorKey: "fee",
		header: "Fee",
	},
	{
		accessorKey: "tickSpacing",
		header: "tickSpacing",
	},
];
