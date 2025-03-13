"use client";

import { currencysQuery } from "@/lib/queries";
import { DataTable, type PageInfo } from "../data-table";
import { columns } from "./columns";

export default function Hooks() {
	return (
		<div className="grid gap-4">
			<h2>Tokens</h2>
			<DataTable
				columns={columns}
				keyName="currencys"
				queryFetcher={currencysQuery}
			/>
		</div>
	);
}
