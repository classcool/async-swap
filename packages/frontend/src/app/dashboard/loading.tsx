"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function Loading() {
	return (
		<div className="overflow-x-auto">
			<div className="grid auto-rows-min gap-4 animate-pulse">
				<Table>
					<TableBody>
						{Array(12)
							.fill(1)
							.map((row, index) => (
								<TableRow key={index} className="flex h-12 items-center gap-2">
									{Array(5)
										.fill(1)
										.map((cell, index) => (
											<TableCell
												key={index}
												className="aspect-video gap-2 h-6 w-full rounded-xl bg-muted"
											></TableCell>
										))}
								</TableRow>
							))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
