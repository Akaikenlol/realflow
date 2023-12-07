"use client";

import React, { useState } from "react";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { QuestionsSchema } from "@/lib/validation";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
	mongoUserId: string;
	type?: string;
	questionDetails?: string;
}

const Profile = ({ mongoUserId, questionDetails, type }: Props) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof QuestionsSchema>>({
		resolver: zodResolver(QuestionsSchema),
		defaultValues: {
			title: "",
			explanation: "",
			tags: [],
		},
	});

	const onSubmit = () => {};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col w-full gap-10"
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="flex flex-col w-full">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Full Name <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
								<Input
									{...field}
									className="no-focus paragraph-regular background-light900_dark300 text-dark300_light700 light-border-2 min-h-[56px] border"
								/>
							</FormControl>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="flex flex-col w-full">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								User Name <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
								<Input
									{...field}
									className="no-focus paragraph-regular background-light900_dark300 text-dark300_light700 light-border-2 min-h-[56px] border"
								/>
							</FormControl>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="flex flex-col w-full">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Portfolio Link <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
								<Input
									{...field}
									className="no-focus paragraph-regular background-light900_dark300 text-dark300_light700 light-border-2 min-h-[56px] border"
								/>
							</FormControl>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="flex flex-col w-full">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Location <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
								<Input
									{...field}
									className="no-focus paragraph-regular background-light900_dark300 text-dark300_light700 light-border-2 min-h-[56px] border"
								/>
							</FormControl>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="flex flex-col w-full">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Bio <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
								<Input
									{...field}
									className="no-focus paragraph-regular background-light900_dark300 text-dark300_light700 light-border-2 min-h-[56px] border"
								/>
							</FormControl>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					onClick={() => onSubmit}
					disabled={isSubmitting}
					className="primary-gradient w-fit !text-light-900 mt-9"
				>
					{isSubmitting ? (
						<>{type === "Edit" ? "Editing..." : "Posting..."}</>
					) : (
						<>{type === "Edit" ? "Edit Profile" : "Ask a Question"}</>
					)}
				</Button>
			</form>
		</Form>
	);
};

export default Profile;
