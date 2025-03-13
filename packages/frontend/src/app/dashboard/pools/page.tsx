"use client";
import { poolsQuery } from "@/lib/queries";
import { DataTable, type PageInfo } from "../data-table";
import { columns } from "./columns";

export default function Pools() {
	return (
		<div className="grid gap-4">
			<h2>Pools</h2>
			<DataTable columns={columns} queryFetcher={poolsQuery} keyName="pools" />
		</div>
	);
}
