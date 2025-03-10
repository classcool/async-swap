"use client";

import { useEffect, useState } from "react";
import { fetchData, liquiditysQuery } from "@/lib/queries";
import { DataTable } from "../../data-table";
import { columns } from "./columns";

export default function LiquidityPositions() {
	const [liquiditys, setLiquiditys] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const endpoint = "http://localhost:42069";
		const fetchQueryData = async () => {
			try {
				fetchData(endpoint, liquiditysQuery).then(async (r) => {
					const data = await r.json();
					console.log(data);
					setLiquiditys(data.data.liquiditys.items);
				});
			} catch (err: any) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};
		fetchQueryData();
	}, []);
	return (
		<div className="grid gap-4">
			<h2>Liquidity Positions</h2>
			<DataTable columns={columns} data={liquiditys} />
		</div>
	);
}
