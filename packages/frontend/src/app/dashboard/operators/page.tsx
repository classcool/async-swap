"use client";

import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "../data-table";
import { fetchData, operatorsQuery } from "@/lib/queries";
import Loading from "../loading";

export default function Operators() {
	const [hooks, setHooks] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const endpoint = "http://localhost:42069";
		const fetchQueryData = async () => {
			try {
				fetchData(endpoint, operatorsQuery).then(async (r) => {
					const data = await r.json();
					console.log(data);
					setHooks(data.data.operators.items);
				});
			} catch (err: any) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};
		fetchQueryData();
	}, []);
	if (loading) return <Loading />;
	return (
		<div className="grid gap-4">
			<h2>Operators</h2>
			<DataTable columns={columns} data={hooks} />
		</div>
	);
}
