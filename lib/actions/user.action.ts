"use server";

import User from "@/database/user.model";
import { FilterQuery } from "mongoose";
import { connectToDB } from "../mongoose";
import {
	CreateUserParams,
	DeleteUserParams,
	GetAllUsersParams,
	GetSavedQuestionsParams,
	GetUserByIdParams,
	GetUserStatsParams,
	ToggleSaveQuestionParams,
	UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

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

export async function createUser(userData: CreateUserParams) {
	try {
		connectToDB();

		const newUser = await User.create(userData);

		return newUser;
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}

export async function updateUser(params: UpdateUserParams) {
	try {
		connectToDB();

		const { clerkId, updateData, path } = params;

		await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

		revalidatePath(path);
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}

export async function deleteUser(params: DeleteUserParams) {
	try {
		connectToDB();

		const { clerkId } = params;

		const user = await User.findOneAndDelete({ clerkId });

		if (!user) {
			throw new Error("User not found");
		}
		// Delete user from database
		// and question, answers, comments, etc..

		// get user questions ids
		const userQuestionIds = await Question.find({ author: user._id }).distinct(
			"_id"
		);

		// delete user questions
		await Question.deleteMany({ author: user._id });

		//To Do: delete user answers, comments, etc.

		const deletedUser = await User.findByIdAndDelete(user._id);

		return deletedUser;
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}

export async function getAllUsers(params: GetAllUsersParams) {
	try {
		connectToDB();

		// const {page = 1, pageSize = 20, filter, searchQuery} = params;

		const users = await User.find({}).sort({ createUser: -1 });

		return { users };
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
	try {
		connectToDB();

		const { userId, questionId, path } = params;

		const user = await User.findById(userId);

		if (!user) {
			throw new Error("User not found");
		}

		const isQuestionSaved = user.saved.includes(questionId);

		if (isQuestionSaved) {
			// remove question from saved
			await User.findByIdAndUpdate(
				userId,
				{ $pull: { saved: questionId } },
				{ new: true }
			);
		} else {
			// add question to save
			await User.findByIdAndUpdate(
				userId,
				{ $addToSet: { saved: questionId } },
				{ new: true }
			);
		}

		revalidatePath(path);
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}

export async function getSavedQuestion(params: GetSavedQuestionsParams) {
	try {
		connectToDB();

		const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

		const query: FilterQuery<typeof Question> = searchQuery
			? { title: { $regex: new RegExp(searchQuery, "i") } }
			: {};

		const user = await User.findOne({ clerkId }).populate({
			path: "saved",
			match: query,
			options: {
				sort: { createdAt: -1 },
			},
			populate: [
				{ path: "tags", model: Tag, select: "_id name" },
				{ path: "author", model: User, select: "_id clerkId name picture" },
			],
		});

		if (!user) {
			throw new Error("User not found");
		}

		const savedQuestions = user.saved;

		return { questions: savedQuestions };
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}

export async function getUserInfo(params: GetUserByIdParams) {
	try {
		connectToDB();

		const { userId } = params;

		const user = await User.findOne({ clerkId: userId });

		if (!user) {
			throw new Error("User not found");
		}

		const totalQuestions = await Question.countDocuments({ author: user._id });
		const totalAnswers = await Answer.countDocuments({ author: user._id });

		return { user, totalQuestions, totalAnswers };
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}

export async function getUserQuestions(params: GetUserStatsParams) {
	try {
		connectToDB();

		const { userId, page = 1, pageSize = 10 } = params;

		const totalQuestions = await Question.countDocuments({ author: userId });

		const userQuestions = await Question.find({ author: userId })
			.sort({ views: -1, upvotes: -1 })
			.populate("tags", "_id name")
			.populate("author", "_id clerkId name picture");

		return { totalQuestions, questions: userQuestions };
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}

export async function getUserAnswers(params: GetUserStatsParams) {
	try {
		connectToDB();

		const { userId, page = 1, pageSize = 10 } = params;

		const totalAnswers = await Answer.countDocuments({ author: userId });

		const userAnswers = await Answer.find({ author: userId })
			.sort({ upvotes: -1 })
			.populate("question", "_id title")
			.populate("author", "_id clerkId name picture");

		return { totalAnswers, answers: userAnswers };
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}

// export async function getAllUsers(params: GetAllUsersParams) {
// 	try {
// 		connectToDB();

// 	} catch (error) {
// 		console.log('error', error);
// 		throw error;
// 	}
// }
