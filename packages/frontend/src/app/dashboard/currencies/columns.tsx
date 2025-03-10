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
	address: string;
	decimals: number;
	symbol: string;
	name: string;
};

export const columns: ColumnDef<CurrencyType>[] = [
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const currency = row.original;

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
							onClick={() => navigator.clipboard.writeText(currency.address)}
						>
							Copy Token Address
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
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "symbol",
		header: "Symbol",
	},
	{
		accessorKey: "address",
		header: "Address",
	},
	{
		accessorKey: "decimals",
		header: "Decimals",
	},
];
