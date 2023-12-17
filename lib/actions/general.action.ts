"use server";

import Question from "@/database/question.model";
import { connectToDB } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

const SearchableTypes = ["question", "answer", "user", "tag"];

export async function globalSearch(params: SearchParams) {
	try {
		await connectToDB();

		const { query, type } = params;
		const regexQuery = { $regex: query, $options: "i" };

		let results = [];

		const modelsAndTypes = [
			{ model: Question, searchField: "title", type: "question" },
			{ model: User, searchField: "name", type: "user" },
			{ model: Answer, searchField: "content", type: "answer" },
			{ model: Tag, searchField: "name", type: "tag" },
		];

		const typeLower = type?.toLowerCase();

		if (!typeLower || !SearchableTypes.includes(typeLower)) {
			// Search across everything
			for (const { model, searchField, type } of modelsAndTypes) {
				const queryResults = await model
					.find({ [searchField]: regexQuery })
					.limit(2);

				results.push(
					...queryResults.map((item) => ({
						title:
							type === "answer"
								? `Answer containing ${query}`
								: item[searchField],
						type,
						id:
							type === "user"
								? item.clerkid
								: type === "answer"
								? item.question
								: item._id,
					}))
				);
			}
		} else {
			// SEARCH IN THE SPECIFIC MODEL TYPE
			const modelInfo = modelsAndTypes.find((item) => item.type === type);
			// {console.log({ modelInfo, type });}
			if (!modelInfo) {
				throw new Error("invalid search type");
			}

			const queryResults = await modelInfo.model
				.find({ [modelInfo.searchField]: regexQuery })
				.limit(8);

			results = queryResults.map((item) => ({
				title:
					type === "answer"
						? `Answer containing ${query}`
						: item[modelInfo.searchField],
				type,
				id:
					type === "user"
						? item.clerkid
						: type === "answer"
						? item.question
						: item._id,
			}));
		}
		return JSON.stringify(results);
	} catch (error) {
		console.log(`Error Fetching global results, ${error}`);
		throw error;
	}
}
