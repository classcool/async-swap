"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type CurrencyType = {
	chainId: number;
	id: string;
	liquidityDelta: bigint;
	poolId: string;
	salt: string;
	sender: string;
	tickUpper: number;
	tickLower: number;
};

export const columns: ColumnDef<CurrencyType>[] = [
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const liquidity = row.original;

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
							onClick={() => navigator.clipboard.writeText(liquidity.poolId)}
						>
							Copy Pool Id
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
		accessorKey: "id",
		header: "TxHash",
	},
	{
		accessorKey: "liquidityDelta",
		header: "Liquidity Delta",
	},
	{
		accessorKey: "poolId",
		header: "Pool Id",
	},
	{
		accessorKey: "sender",
		header: "Sender",
	},
	{
		accessorKey: "tickLower",
		header: "Tick Lower",
	},
	{
		accessorKey: "tickUpper",
		header: "Tick Upper",
	},
];
