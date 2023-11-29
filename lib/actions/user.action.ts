"use server";

import User from "@/database/user.model";
import { connectToDB } from "../mongoose";
import {
	CreateUserParams,
	DeleteUserParams,
	GetAllUsersParams,
	UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

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

// export async function getAllUsers(params: GetAllUsersParams) {
// 	try {
// 		connectToDB();

// 	} catch (error) {
// 		console.log('error', error);
// 		throw error;
// 	}
// }
