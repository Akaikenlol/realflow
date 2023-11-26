"use server";

import { connectToDB } from "../mongoose";

export async function createQuestions(params: any) {
	try {
		// connect to DB
		connectToDB();
	} catch (error) {}
}
