"use server";

import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import { connectToDB } from "../mongoose";
import Answer from "@/database/answer.model";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function createAnswer(params: CreateAnswerParams) {
	try {
		connectToDB();

		const { content, author, question, path } = params;

		const newAnswer = await Answer.create({ content, author, question });

		console.log("newAnswer", { newAnswer });

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

export async function getAnswer(params: GetAnswersParams) {
	try {
		connectToDB();

		const { questionId } = params;

		console.log("questionId", { questionId });

		const answers = await Answer.find({ question: questionId })
			.populate("author", "_id clerkId name picture")
			.sort({ createdAt: -1 });

		return { answers };
	} catch (error) {
		throw error;
	}
}
