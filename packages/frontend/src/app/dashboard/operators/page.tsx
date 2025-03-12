"use client";

import { operatorsQuery } from "@/lib/queries";
import { DataTable } from "../data-table";
import { columns } from "./columns";

export default function Operators() {
	return (
		<div className="grid gap-4">
			<h2>Operators</h2>
			<DataTable
				columns={columns}
				keyName="operators"
				queryFetcher={operatorsQuery}
			/>
		</div>
	);
}
