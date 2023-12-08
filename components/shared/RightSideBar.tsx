import Link from "next/link";
import React from "react";
import Image from "next/image";
import RenderTag from "./RenderTag";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopPopularTags } from "@/lib/actions/tag.action";

const RightSideBar = async () => {
	const hotQuestions = await getHotQuestions();
	const popularTags = await getTopPopularTags();

	return (
		<section className="background-light900_dark200 light-border sticky right-0 top-0 flex h-screen flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden w-[350px] custom-scrollbar">
			<div>
				<h3 className="h3-bold text-dark200_light900">Top Questions</h3>
				<div className="mt-7 flex flex-col gap-[30px] w-full">
					{hotQuestions.map((question) => (
						<Link
							href={`question/${question._id}`}
							key={question._id}
							className="cursor-pointer flex justify-between items-center gasp-7"
						>
							<p className="text-dark500_light700 body-medium">
								{question.title}
							</p>
							<Image
								src="/assets/icons/chevron-right.svg"
								alt="Chevron Right"
								width={20}
								height={20}
								className="invert-colors"
							/>
						</Link>
					))}
				</div>
			</div>
			<div className="mt-16">
				<h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
				<div className="mt-7 flex flex-col gap-4">
					{popularTags.map((tag) => (
						<RenderTag
							key={tag._id}
							_id={tag._id}
							name={tag.name}
							totalQuestions={tag.numberOfQuestions}
							showCount
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default RightSideBar;
