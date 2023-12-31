"use client";
import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { QuestionsSchema } from "@/lib/validation";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { useState } from "react";
import { createQuestions, editQuestion } from "@/lib/actions/question.action";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";
import { toast } from "../ui/use-toast";

// const type: any = "create";

interface Props {
	mongoUserId: string;
	type?: string;
	questionDetails?: string;
}

const Question = ({ mongoUserId, questionDetails, type }: Props) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const editorRef = useRef(null);
	const router = useRouter();
	const pathname = usePathname();
	const { mode } = useTheme();

	const parsedQuestionDetails =
		questionDetails && JSON.parse(questionDetails || "");
	const groupTags = parsedQuestionDetails?.tags.map((tag: any) => tag.name);

	// console.log(parsedQuestionDetails.content);

	// 1. Define your form.
	const form = useForm<z.infer<typeof QuestionsSchema>>({
		resolver: zodResolver(QuestionsSchema),
		defaultValues: {
			title: parsedQuestionDetails?.title || "",
			explanation: parsedQuestionDetails?.content || "",
			tags: groupTags || [],
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		// This is going to dis allowed us to press the button for the second time and cause some chaos in DB.
		setIsSubmitting(true);
		// console.log(values);

		try {
			if (type === "Edit") {
				await editQuestion({
					questionId: parsedQuestionDetails._id,
					title: values.title,
					content: values.explanation,
					path: pathname,
				});
				router.push(`/question/${parsedQuestionDetails._id}`);
			} else {
				// make an async call to your API -> create a question
				// contain all from data
				// navigate to home page
				await createQuestions({
					title: values.title,
					content: values.explanation,
					tags: values.tags,
					author: JSON.parse(mongoUserId),
					path: pathname,
				});
				router.push("/");
			}
		} catch (error) {
		} finally {
			setIsSubmitting(false);
		}
	}

	const handleInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		field: any
	) => {
		if (e.key === "Enter" && field.name === "tags") {
			e.preventDefault();

			const tagInput = e.target as HTMLInputElement;
			const tagValue = tagInput.value.trim();

			if (tagValue !== "") {
				if (tagValue.length > 15) {
					return form.setError("tags", {
						type: "required",
						message: "Tag must be less than 15 characters.",
					});
				}
				if (!field.value.includes(tagValue as never)) {
					form.setValue("tags", [...field.value, tagValue]);
					tagInput.value = "";
					form.clearErrors("tags");
				}
			} else {
				form.trigger();
			}
		}
	};

	const handleTagRemove = (tag: string, field: any) => {
		const newTags = field.value.filter((t: string) => t !== tag);
		form.setValue("tags", newTags);
	};

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
								Question Title <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
								<Input
									{...field}
									className="no-focus paragraph-regular background-light900_dark300 text-dark300_light700 light-border-2 min-h-[56px] border"
								/>
							</FormControl>
							<FormDescription className="body-regular text-light-500 mt-2.5">
								Be specific and imagine you&apos;re asking a question to another
								person.
							</FormDescription>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="explanation"
					render={({ field }) => (
						<FormItem className="flex flex-col w-full gap-3">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Detail explanation of your problem{" "}
								<span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
								{/* ToDo: Add an Editor Components */}
								<Editor
									apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
									onInit={(evt, editor) => {
										// @ts-ignore
										editorRef.current = editor;
									}}
									onBlur={field.onBlur}
									onEditorChange={(content) => field.onChange(content)}
									initialValue={parsedQuestionDetails?.content || ""}
									init={{
										height: 350,
										menubar: false,
										plugins: [
											"advlist",
											"autolink",
											"lists",
											"link",
											"image",
											"charmap",
											"preview",
											"anchor",
											"searchreplace",
											"visualblocks",
											"codesample",
											"fullscreen",
											"insertdatetime",
											"media",
											"table",
										],
										toolbar:
											"undo redo | codesample | " +
											"bold italic forecolor | alignleft aligncenter |" +
											"alignright alignjustify | bullist numlist | ",
										content_style: "body { font-family:Inter, font-size:16px }",
										skin: mode === "dark" ? "oxide-dark" : "oxide",
										content_css: mode === "dark" ? "dark" : "light",
									}}
								/>
							</FormControl>
							<FormDescription className="body-regular text-light-500 mt-2.5">
								Introduce the problem and expend on what you pull in the title.
								Minimum 20 characters.
							</FormDescription>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="tags"
					render={({ field }) => (
						<FormItem className="flex flex-col w-full">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Tags <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
								<>
									<Input
										disabled={type === "Edit"}
										placeholder="Add tags..."
										onKeyDown={(e) => handleInputKeyDown(e, field)}
										className="no-focus paragraph-regular background-light900_dark300 text-dark300_light700 light-border-2 min-h-[56px] border"
									/>
									{field.value.length > 0 && (
										<div className="mt-2.5 gap-2.5 flex-start">
											{field.value.map((tag: any) => (
												<Badge
													key={tag}
													onClick={(e) =>
														type !== "Edit"
															? handleTagRemove(tag, field)
															: () => {}
													}
													className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
												>
													{tag}
													{type !== "Edit" && (
														<Image
															src="assets/icons/close.svg"
															alt="Close icon"
															width={12}
															height={12}
															className="object-contain invert-0 dark:invert"
														/>
													)}
												</Badge>
											))}
										</div>
									)}
								</>
							</FormControl>
							<FormDescription className="body-regular text-light-500 mt-2.5">
								Add up to 3 tags to describe what your question is about. Start
								typing to see suggestions.
							</FormDescription>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					// onClick={() => onSubmit}
					disabled={isSubmitting}
					className="primary-gradient w-fit !text-light-900 mt-9"
				>
					{isSubmitting ? (
						<>{type === "Edit" ? "Editing..." : "Posting..."}</>
					) : (
						<>{type === "Edit" ? "Edit Question" : "Ask a Question"}</>
					)}
				</Button>
			</form>
		</Form>
	);
};

export default Question;
