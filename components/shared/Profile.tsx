"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { ProfileSchema } from "@/lib/validation";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";
import { toast } from "../ui/use-toast";

interface Props {
	user: string;
	clerkId: string;
}

const Profile = ({ user, clerkId }: Props) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isUpdate, setIsUpdate] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const parsedUser = JSON.parse(user);

	const form = useForm<z.infer<typeof ProfileSchema>>({
		resolver: zodResolver(ProfileSchema),
		defaultValues: {
			name: parsedUser.name || "",
			username: parsedUser.username || "",
			portfolioWebsite: parsedUser.portfolioWebsite || "",
			bio: parsedUser.bio || "",
			location: parsedUser.location || "",
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof ProfileSchema>) {
		setIsSubmitting(true);
		try {
			// updateUser
			await updateUser({
				clerkId,
				updateData: {
					name: values.name,
					username: values.username,
					portfolioWebsite: values.portfolioWebsite,
					location: values.location,
					bio: values.bio,
				},
				path: pathname,
			});
			router.back();
			// router.push(`/profile/${parsedUser._id}`);
		} catch (error) {
			console.log(error);
		} finally {
			setIsSubmitting(false);
		}
		return toast({
			title: `Profile ${
				!isUpdate ? "Successfully Updated!" : "Failed to Update!"
			}`,
			variant: !isUpdate ? "default" : "destructive",
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mt-9 flex flex-col w-full gap-9"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem className="space-y-3.5">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Full Name <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="Your name"
									className="no-focus paragraph-regular background-light700_dark300 text-dark300_light700 light-border-2 min-h-[56px] border"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem className="space-y-3.5">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Username <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="Your username"
									className="no-focus paragraph-regular background-light700_dark300 text-dark300_light700 light-border-2 min-h-[56px] border"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="portfolioWebsite"
					render={({ field }) => (
						<FormItem className="space-y-3.5">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Portfolio Link
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="url"
									placeholder="Your portfolio URL"
									className="no-focus paragraph-regular background-light700_dark300 text-dark300_light700 light-border-2 min-h-[56px] border"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem className="space-y-3.5">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Location <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="Where are you from?"
									className="no-focus paragraph-regular background-light700_dark300 text-dark300_light700 light-border-2 min-h-[56px] border"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="bio"
					render={({ field }) => (
						<FormItem className="space-y-3.5">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Bio <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									placeholder="What special about you?"
									className="no-focus paragraph-regular background-light700_dark300 text-dark300_light700 light-border-2 min-h-[56px] border"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-end mt-7">
					<Button
						type="submit"
						className="primary-gradient w-fit"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Saving..." : "Save"}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default Profile;
