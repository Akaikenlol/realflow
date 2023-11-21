import Link from "next/link";
import React from "react";
import Image from "next/image";
import RenderTag from "./RenderTag";

const RightSideBar = () => {
	const hotQuestions = [
		{ _id: 1, title: "Is it only me or the font is bolder than necessary?" },
		{
			_id: 2,
			title:
				"Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
		},
		{ _id: 3, title: "Can I get the course for free?" },
		{ _id: 4, title: "Redux Toolkit Not Updating State as Expected" },
		{ _id: 5, title: "Async/Await Function Not Handling Errors Properly" },
	];

	const popularTags = [
		{ _id: 1, title: "JavaScript", totalQuestions: 21 },
		{ _id: 2, title: "HTML", totalQuestions: 15 },
		{ _id: 3, title: "CSS", totalQuestions: 18 },
		{ _id: 4, title: "TypeScript", totalQuestions: 10 },
		{ _id: 5, title: "NEXT JS", totalQuestions: 8 },
	];

	return (
		<section className="background-light900_dark200 light-border sticky right-0 top-0 flex h-screen flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden w-[350px] custom-scrollbar">
			<div>
				<h3 className="h3-bold text-dark200_light900">Top Questions</h3>
				<div className="mt-7 flex flex-col gap-[30px] w-full">
					{hotQuestions.map((question) => (
						<Link
							href={`questions/${question._id}`}
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
							name={tag.title}
							totalQuestions={tag.totalQuestions}
							showCount
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default RightSideBar;
