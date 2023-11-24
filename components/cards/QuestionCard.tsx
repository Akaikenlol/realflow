import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatNumberWithExtension, getTimestamp } from "@/lib/utils";

interface QuestionProps {
	_id: string;
	title: string;
	tags: {
		_id: string;
		name: string;
	}[];
	author: {
		_id: string;
		name: string;
		picture: string;
	};
	upvotes: number;
	views: number;
	answers: Array<object>;
	createdAt: Date;
}

const QuestionCard = ({
	_id,
	title,
	tags,
	author,
	upvotes,
	views,
	answers,
	createdAt,
}: QuestionProps) => {
	return (
		<div className="card-wrapper p-9 sm:px-11 rounded-[10px]">
			<div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
				<div>
					<span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
						{getTimestamp(createdAt)}
					</span>
					<Link href={`/question/${_id}`}>
						<h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
							{title}
						</h3>
					</Link>
				</div>
				{/* If signed in add edit delete action */}
			</div>
			<div className="mt-3.5 flex flex-wrap gap-2">
				{tags.map((tag) => (
					<RenderTag
						_id={tag._id}
						name={tag.name}
						key={tag._id}
						showCount={false}
					/>
				))}
			</div>
			<div className="flex-between flex-wrap mt-6 w-full gap-3">
				<Metric
					imgUrl="/assets/icons/avatar.svg"
					alt="user"
					value={author.name}
					title={`- asked ${getTimestamp(createdAt)}`}
					href={`/profile/${author._id}`}
					isAuthor
					textStyles="body-medium text-dark400_light700"
				/>
				<Metric
					imgUrl="/assets/icons/like.svg"
					alt="Upvote"
					value={formatNumberWithExtension(upvotes)}
					title="Votes"
					textStyles="small-medium text-dark400_light800"
				/>
				<Metric
					imgUrl="/assets/icons/message.svg"
					alt="Answer"
					value={formatNumberWithExtension(answers.length)}
					title="Answers"
					textStyles="small-medium text-dark400_light800"
				/>
				<Metric
					imgUrl="/assets/icons/eye.svg"
					alt="eye"
					value={formatNumberWithExtension(views)}
					title="Views"
					textStyles="small-medium text-dark400_light800"
				/>
			</div>
		</div>
	);
};

export default QuestionCard;