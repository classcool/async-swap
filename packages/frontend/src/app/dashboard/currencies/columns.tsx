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
						{currency.address !==
						"0x0000000000000000000000000000000000000000" ? (
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal />
							</Button>
						) : (
							<></>
						)}
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(currency.address)}
						>
							<>
								<Copy />
								Copy Address
							</>
						</DropdownMenuItem>
						{currency.chainId === 130 &&
						currency.address !==
							"0x0000000000000000000000000000000000000000" ? (
							<DropdownMenuItem
								onClick={() =>
									window.open(
										`https://uniscan.xyz/address/${currency.address}#code`,
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
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Decimals
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
];
