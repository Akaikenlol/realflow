"use server";

import {
	AnswerVoteParams,
	CreateAnswerParams,
	DeleteAnswerParams,
	GetAnswersParams,
} from "./shared.types";
import { connectToDB } from "../mongoose";
import Answer from "@/database/answer.model";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Interaction from "@/database/interaction.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";

export async function createAnswer(params: CreateAnswerParams) {
	try {
		connectToDB();

		const { content, author, question, path } = params;

		const newAnswer = await Answer.create({ content, author, question });

		console.log("newAnswer", { newAnswer });

		// Add the answer to the question's answer array
		const questionObject = await Question.findByIdAndUpdate(question, {
			$push: { answer: newAnswer._id },
		});

		//To Do: Add interaction....
		await Interaction.create({
			user: author,
			action: "answer",
			question,
			answer: newAnswer._id,
			tags: questionObject.tags,
		});

		await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

		revalidatePath(path);
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}

export async function getAnswer(params: GetAnswersParams) {
	try {
		connectToDB();

		const { questionId, sortBy, page = 1, pageSize = 10 } = params;

		const skipAmount = (page - 1) * pageSize;

		// console.log("questionId", { questionId });

		let sortOptions = {};

		switch (sortBy) {
			case "highestUpvotes":
				sortOptions = { upvotes: -1 };
				break;
			case "lowestUpvotes":
				sortOptions = { upvotes: 1 };
				break;
			case "recent":
				sortOptions = { createdAt: -1 };
				break;
			case "old":
				sortOptions = { createdAt: 1 };
				break;
			default:
				break;
		}

		const answers = await Answer.find({ question: questionId })
			.populate("author", "_id clerkId name picture")
			.sort(sortOptions)
			.skip(skipAmount)
			.limit(pageSize);

		const totalAnswers = await Answer.countDocuments({ question: questionId });

		const isNextAnswers = totalAnswers > skipAmount + answers.length;

		return { answers, isNextAnswers };
	} catch (error) {
		throw error;
	}
}

export async function upvoteAnswer(params: AnswerVoteParams) {
	try {
		connectToDB();

		const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

		let updateQuery = {};

		if (hasupVoted) {
			updateQuery = { $pull: { upvotes: userId } };
		} else if (hasdownVoted) {
			updateQuery = {
				$pull: { downvotes: userId },
				$push: { upvotes: userId },
			};
		} else {
			updateQuery = { $addToSet: { upvotes: userId } };
		}

		const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
			new: true,
		});

		if (!answer) {
			throw new Error("Answer not found");
		}

		//Increment author's reputation
		// Increment author's reputation by +1/-1 for upvoting/revoking an upvote to the answer
		await User.findByIdAndUpdate(userId, {
			$inc: { reputation: hasupVoted ? -2 : 2 },
		});

		// Increment author's reputation by +19/-10 for receiving  an upvote/downvote to the answer
		await User.findByIdAndUpdate(answer.author, {
			$inc: { reputation: hasupVoted ? -10 : 10 },
		});

		revalidatePath(path);
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}

export async function downvoteAnswer(params: AnswerVoteParams) {
	try {
		connectToDB();

		const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

		let updateQuery = {};

		if (hasdownVoted) {
			updateQuery = { $pull: { downvotes: userId } };
		} else if (hasupVoted) {
			updateQuery = {
				$pull: { upvotes: userId },
				$push: { downvotes: userId },
			};
		} else {
			updateQuery = { $addToSet: { downvotes: userId } };
		}

		const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
			new: true,
		});

		if (!answer) {
			throw new Error("Answer not found");
		}

		//Increment author's reputation
		// Increment author's reputation by +1/-1 for upvoting/revoking an upvote to the answer
		await User.findByIdAndUpdate(userId, {
			$inc: { reputation: hasdownVoted ? -2 : 2 },
		});

		// Increment author's reputation by +10/-10 for receiving  an upvote/downvote to the answer
		await User.findByIdAndUpdate(answer.author, {
			$inc: { reputation: hasdownVoted ? -10 : 10 },
		});

		revalidatePath(path);
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}

export async function deleteAnswer(params: DeleteAnswerParams) {
	try {
		connectToDB();

		const { answerId, path } = params;

		const answer = await Answer.findById(answerId);

		if (!answer) {
			throw new Error("Answer Not Found!");
		}

		await answer.deleteOne({ _id: answerId });
		await Question.updateMany(
			{ _id: answerId },
			{ $pull: { answers: answerId } }
		);
		await Interaction.deleteMany({ answers: answerId });

		revalidatePath(path);
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}
