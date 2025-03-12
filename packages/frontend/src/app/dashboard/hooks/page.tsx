"use client";

import {  hooksQuery } from "@/lib/queries";
import { DataTable } from "../data-table";
import { columns } from "./columns";

export default function Hooks() {
	return (
		<div className="grid gap-4">
			<h2>Hooks</h2>
			<DataTable columns={columns} keyName="hooks" queryFetcher={hooksQuery} />
		</div>
	);
}
