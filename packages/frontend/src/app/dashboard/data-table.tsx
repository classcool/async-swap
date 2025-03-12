"use client";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { type PageDirection, fetchData } from "@/lib/queries";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Armchair } from "lucide-react";
import { useMemo, useState } from "react";
import Loading from "./loading";

export type PageInfo = {
	endCursor: string;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor: string;
};

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	queryFetcher: (
		cursor: string,
		direction: "next" | "prev" | "",
		chainId: number | "",
	) => string;
	keyName: string;
}

export function DataTable<TData, TValue>({
	columns,
	queryFetcher,
	keyName,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 50,
	});
	const [cursor, setCursor] = useState("");
	const [direction, setDirection] = useState<PageDirection>("");

	const endpoint = "http://localhost:42069";

	const { data, isLoading, error } = useQuery({
		queryKey: [keyName, cursor, direction],
		queryFn: () => fetchData(cursor, direction, endpoint, "", queryFetcher),
		placeholderData: keepPreviousData,
	});

	const defaultData = useMemo(() => [], []);
	const table = useReactTable({
		data: data?.[keyName]?.items ?? defaultData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: setPagination,
		state: { sorting, columnFilters, pagination },
		rowCount: 50,
	});

	if (isLoading) return <Loading />;
	return (
		<div className="overflow-x-auto">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						setCursor(data?.[keyName]?.pageInfo.startCursor);
						setDirection("prev");
					}}
					disabled={!data?.[keyName]?.pageInfo.hasPreviousPage}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						setCursor(data?.[keyName].pageInfo.endCursor);
						setDirection("next");
					}}
					disabled={!data?.[keyName]?.pageInfo.hasNextPage}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
