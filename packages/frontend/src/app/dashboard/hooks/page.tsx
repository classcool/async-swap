"use client";

import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "../data-table";
import { fetchData, hooksQuery } from "@/lib/queries";
import Loading from "../loading";

export default function Hooks() {
	const [hooks, setHooks] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const endpoint = "http://localhost:42069";
		const fetchQueryData = async () => {
			try {
				fetchData(endpoint, hooksQuery).then(async (r) => {
					const data = await r.json();
					console.log(data);
					setHooks(data.data.hooks.items);
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
			<h2>Hooks</h2>
			<DataTable columns={columns} data={hooks} />
		</div>
	);
}
