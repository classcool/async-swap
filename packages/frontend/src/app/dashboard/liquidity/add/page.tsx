import AddLiquidity from "./add-liquidity";

export default async function Page() {
	return (
		<div className="grid gap-4">
			<h2>Add Liquidity</h2>
			<AddLiquidity />
		</div>
	);
}
