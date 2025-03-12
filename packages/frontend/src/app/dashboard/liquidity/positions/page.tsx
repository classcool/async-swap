"use client";

import { liquiditysQuery } from "@/lib/queries";
import { DataTable } from "../../data-table";
import { columns } from "./columns";

export default function LiquidityPositions() {
	return (
		<div className="grid gap-4">
			<h2>Liquidity Positions</h2>
			<DataTable
				columns={columns}
				keyName="liquiditys"
				queryFetcher={liquiditysQuery}
			/>
		</div>
	);
}
