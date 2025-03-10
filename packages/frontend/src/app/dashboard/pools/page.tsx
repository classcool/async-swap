"use client";
import { useEffect, useState } from "react";
import { poolsQuery, fetchData } from "@/lib/queries";
import { DataTable } from "../data-table";
import { columns } from "./columns";

export default function Pools() {
	const [pools, setPools] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const endpoint = "http://localhost:42069";
		const fetchQueryData = async () => {
			try {
				fetchData(endpoint, poolsQuery).then(async (r) => {
					const data = await r.json();
					console.log(data);
					setPools(data.data.pools.items);
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
			<h2>Pools</h2>
			<DataTable columns={columns} data={pools} />
		</div>
	);
}
