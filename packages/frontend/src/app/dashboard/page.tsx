export default function Dashboard() {
	return (
		<>
			<h2>Dashboard</h2>
			<div className="grid auto-rows-min gap-4 md:grid-cols-3">
				<div className="aspect-square rounded-xl bg-muted/50" />
				<div className="aspect-square rounded-xl bg-muted/50" />
				<div className="aspect-square rounded-xl bg-muted/50" />
			</div>
			<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
		</>
	);
}
