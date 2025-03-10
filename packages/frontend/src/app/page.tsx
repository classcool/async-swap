"use client";

import { LoginForm } from "@/components/login-form";

function App() {
	return (
		<div className="col-span-full bg-red-200">
			<div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
				<div className="w-full max-w-sm md:max-w-3xl">
					<LoginForm />
				</div>
			</div>
		</div>
	);
}

export default App;
