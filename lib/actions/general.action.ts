"use server";

import Question from "@/database/question.model";
import { connectToDB } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

export async function globalSearch(params: SearchParams) {
	try {
		await connectToDB();

		const { query, type } = params;
		const regexQuery = { $regex: query, $options: "i" };

		let result = [];

		const modelsAndTypes = [
			{ model: Question, searchField: "title", type: "question" },
			{ model: User, searchField: "name", type: "user" },
			{ model: Tag, searchField: "name", type: "tag" },
			{ model: Answer, searchField: "content", type: "answer" },
		];

		const typeLower = type?.toLowerCase();
		// 04: 19
	} catch (error) {
		console.log(`Error Fetching global results, ${error}`);
		throw error;
	}
}
