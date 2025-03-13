"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function Loading() {
	return (
		<Table>
			<TableBody>
				{Array(50)
					.fill(1)
					.map((row, index) => (
						<TableRow
							key={Math.random()}
							className="flex h-12 items-center gap-4"
						>
							{Array(8)
								.fill(1)
								.map((cell) => (
									<TableCell key={Math.random() + 1}>
										<Skeleton className="h-4 w-[200px]" />
									</TableCell>
								))}
						</TableRow>
					))}
			</TableBody>
		</Table>
	);
}
