"use server";

import User from "@/database/user.model";
import { connectToDB } from "../mongoose";

export async function getUserById(params: any) {
	try {
		connectToDB();

		const { userId } = params;

		const user = await User.findOne({ clerkId: userId });

		return user;
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}
