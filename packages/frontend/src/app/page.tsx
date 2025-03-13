"use client";

import { CommandDialogDemo } from "@/components/command-menu";
import { LoginForm } from "@/components/login-form";

function App() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
			<CommandDialogDemo />
			<div className="w-full max-w-sm md:max-w-3xl">
				{/** <LoginForm /> */}
			</div>
		</div>
	);
}

export default App;
