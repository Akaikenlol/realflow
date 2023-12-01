"use server";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { connectToDB } from "../mongoose";
import {
	CreateQuestionParams,
	GetQuestionByIdParams,
	GetQuestionsParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
	try {
		connectToDB();

		const questions = await Question.find({})
			.populate({ path: "tags", model: Tag })
			.populate({ path: "author", model: User })
			.sort({ createdAt: -1 });

		return { questions };
	} catch (error) {
		throw error;
	}
}

export async function createQuestions(params: CreateQuestionParams) {
	try {
		// connect to DB
		connectToDB();

		const { title, content, tags, author, path } = params;
		// create the question

		const question = await Question.create({
			title,
			content,
			author,
		});

		const tagDocuments = [];

		// create the tag or get them if they already exists
		for (const tag of tags) {
			const existingTag = await Tag.findOneAndUpdate(
				{ name: { $regex: new RegExp(`^${tag}$`, "i") } },
				{ $setOnInsert: { name: tag }, $push: { question: question._id } },
				{ upsert: true, new: true }
			);
			tagDocuments.push(existingTag._id);
		}

		await Question.findByIdAndUpdate(question._id, {
			$push: { tags: { $each: tagDocuments } },
		});

		// Create an interaction record for the user's ask_question action

		//Increment author's reputation by +5 for creating a question
		revalidatePath(path);
	} catch (error) {}
}

export async function getQuestionsById(params: GetQuestionByIdParams) {
	try {
		connectToDB();

		const { questionId } = params;

		const question = await Question.findById(questionId)
			.populate({ path: "tags", model: Tag, select: "_id name" })
			.populate({
				path: "author",
				model: User,
				select: "_id clerkId name picture",
			});

		return question;
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}
