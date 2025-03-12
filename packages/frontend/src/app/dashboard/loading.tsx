"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function Loading() {
	return (
		<div className="overflow-x-auto">
			<div className="grid auto-rows-min gap-4 animate-pulse">
				<Table>
					<TableBody>
						{Array(50)
							.fill(1)
							.map((row, index) => (
								<TableRow
									key={Math.random()}
									className="flex h-12 items-center gap-2"
								>
									{Array(5)
										.fill(1)
										.map((cell) => (
											<TableCell
												key={Math.random() + 1}
												className="aspect-video gap-2 h-6 w-full rounded-xl bg-muted"
											/>
										))}
								</TableRow>
							))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
