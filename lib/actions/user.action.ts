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
import { BADGE_CRITERIA } from "@/constants";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

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

		const { searchQuery, filter, page = 1, pageSize = 10 } = params;

		const skipAmount = (page - 1) * pageSize;

		const query: FilterQuery<typeof User> = {};

		if (searchQuery) {
			query.$or = [
				{ name: { $regex: new RegExp(searchQuery, "i") } },
				{ username: { $regex: new RegExp(searchQuery, "i") } },
			];
		}

		let sortOptions = {};

		switch (filter) {
			case "new_users":
				sortOptions = { joinedAt: -1 };
				break;
			case "old_users":
				sortOptions = { joinedAt: 1 };
				break;
			case "top_contributors":
				sortOptions = { reputation: -1 };
				break;
			default:
				break;
		}

		const users = await User.find(query)
			.skip(skipAmount)
			.limit(pageSize)
			.sort(sortOptions);

		const totalUsers = await User.countDocuments(query);

		const isNext = totalUsers > skipAmount + users.length;

		return { users, isNext };
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

		const { clerkId, searchQuery, filter, page = 1, pageSize = 10 } = params;

		const skipAmount = (page - 1) * pageSize;

		const query: FilterQuery<typeof Question> = searchQuery
			? { title: { $regex: new RegExp(searchQuery, "i") } }
			: {};

		let sortOptions = {};

		switch (filter) {
			case "most_recent":
				sortOptions = { createdAt: -1 };
				break;
			case "oldest":
				sortOptions = { createdAt: 1 };
				break;
			case "most_voted":
				sortOptions = { upvotes: -1 };
				break;
			case "most_viewed":
				sortOptions = { views: -1 };
				break;
			case "most_answered":
				sortOptions = { answers: -1 };
				break;
			default:
				break;
		}

		const user = await User.findOne({ clerkId }).populate({
			path: "saved",
			match: query,
			options: {
				sort: sortOptions,
				skip: skipAmount,
				limit: pageSize + 1,
			},
			populate: [
				{ path: "tags", model: Tag, select: "_id name" },
				{ path: "author", model: User, select: "_id clerkId name picture" },
			],
		});

		const isNext = user.saved.length > pageSize;

		if (!user) {
			throw new Error("User not found");
		}

		const savedQuestions = user.saved;

		return { questions: savedQuestions, isNext };
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

		const [questionUpVotes] = await Question.aggregate([
			{ $match: { author: user._id } },
			{ $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
			{ $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
		]);

		const [answerUpVotes] = await Answer.aggregate([
			{ $match: { author: user._id } },
			{ $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
			{ $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
		]);

		const [questionViews] = await Answer.aggregate([
			{ $match: { author: user._id } },
			{ $group: { _id: null, totalViews: { $sum: "$views" } } },
		]);

		const criteria = [
			{ type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
			{ type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
			{
				type: "QUESTION_UPVOTES" as BadgeCriteriaType,
				count: questionUpVotes?.totalUpvotes || 0,
			},
			{
				type: "ANSWER_UPVOTES" as BadgeCriteriaType,
				count: answerUpVotes?.totalUpvotes || 0,
			},
			{
				type: "TOTAL_VIEWS" as BadgeCriteriaType,
				count: questionUpVotes?.totalUpvotes || 0,
			},
		];

		const badgeCounts = assignBadges({ criteria });

		return {
			user,
			totalQuestions,
			totalAnswers,
			badgeCounts,
			reputation: user.reputation,
		};
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}

export async function getUserQuestions(params: GetUserStatsParams) {
	try {
		connectToDB();

		const { userId, page = 1, pageSize = 10 } = params;

		const skipAmount = (page - 1) * pageSize;

		const totalQuestions = await Question.countDocuments({ author: userId });

		const userQuestions = await Question.find({ author: userId })
			.sort({ createdAt: -1, views: -1, upvotes: -1 })
			.populate("tags", "_id name")
			.populate("author", "_id clerkId name picture")
			.skip(skipAmount)
			.limit(pageSize);

		const isNextQuestions = totalQuestions > skipAmount + userQuestions.length;

		return { totalQuestions, questions: userQuestions, isNextQuestions };
	} catch (error) {
		console.log("error", error);
		throw error;
	}
}

export async function getUserAnswers(params: GetUserStatsParams) {
	try {
		connectToDB();

		const { userId, page = 1, pageSize = 10 } = params;

		const skipAmount = (page - 1) * pageSize;

		const totalAnswers = await Answer.countDocuments({ author: userId });

		const userAnswers = await Answer.find({ author: userId })
			.sort({ upvotes: -1 })
			.populate("question", "_id title")
			.populate("author", "_id clerkId name picture")
			.skip(skipAmount)
			.limit(pageSize);

		const isNextAnswers = totalAnswers > skipAmount + userAnswers.length;

		return { totalAnswers, answers: userAnswers, isNextAnswers };
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
