import { UserButton } from "@clerk/nextjs";

export default function Home() {
	return (
		<main className="flex justify-center text-xl items-center text-center min-h-screen text-emerald-400 gap-5">
			<UserButton afterSignOutUrl="/" />
			<h1 className="">Home</h1>
		</main>
	);
}
