import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Ask a question | Dev Flow",
	description: "A place where developers share ideas and help each other grow",
};

const Page = async () => {
	const { userId } = auth();
	// const userId = "123abc";

	if (!userId) redirect("/sign-in");

	const mongoUser = await getUserById({ userId });
	console.log("mongoUser: ", mongoUser);

	return (
		<div>
			<h1 className="h1-bold text-dark100_light900">Ask a question</h1>

			<div className="mt-9">
				<Question mongoUserId={JSON.stringify(mongoUser?._id)} />
			</div>
		</div>
	);
};

export default Page;
