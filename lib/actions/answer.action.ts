"use server";

import { CreateAnswerParams } from "./shared.types";
import { connectToDB } from "../mongoose";
import Answer from "@/database/answer.model";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function createAnswer(params: CreateAnswerParams) {
	try {
		connectToDB();

		const { content, author, question, path } = params;

		const newAnswer = new Answer({ content, author, question });

		// Add the answer to the question's answer array
		await Question.findByIdAndUpdate(question, {
			$push: { answer: newAnswer._id },
		});

		//To Do: Add interaction....

		revalidatePath(path);
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}
