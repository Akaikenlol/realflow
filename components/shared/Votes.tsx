"use client";

import Image from "next/image";
import React from "react";

interface Props {
	type: string;
	itemId: string;
	userId: string;
	upvotes: number;
	downvotes: number;
	hasupVoted: boolean;
	hasdownVoted: boolean;
	hasSaved?: boolean;
}

const Votes = ({
	type,
	itemId,
	userId,
	upvotes,
	downvotes,
	hasupVoted,
	hasdownVoted,
	hasSaved,
}: Props) => {
	const handleSaved = () => {};

	const handleVote = (action: string) => {};
	return (
		<div className="flex gap-5">
			<div className="flex-center gap-2.5">
				<div className="flex-center gap-1.5">
					<Image
						src={
							hasupVoted
								? "/assets/icons/upvoted.svg"
								: "/assets/icons/upvote.svg"
						}
						alt="upvote"
						width={18}
						height={18}
						className="cursor-pointer"
						onClick={() => handleVote("upvote")}
					/>
					<div className="flex-center background-light700_dark400 min-w-[18px] p-1 rounded-sm">
						<p className="subtle-medium text-dark400_light900">
							{/* {formatAndDivideNumber(upvotes)} */}
							{upvotes}
						</p>
					</div>
				</div>
				<div className="flex-center gap-1.5">
					<Image
						src={
							hasdownVoted
								? "/assets/icons/downvoted.svg"
								: "/assets/icons/downvote.svg"
						}
						alt="downvote"
						width={18}
						height={18}
						className="cursor-pointer"
						onClick={() => handleVote("downvote")}
					/>
					<div className="flex-center background-light700_dark400 min-w-[18px] p-1 rounded-sm">
						<p className="subtle-medium text-dark400_light900">
							{/* {formatAndDivideNumber(upvotes)} */}
							{downvotes}
						</p>
					</div>
				</div>
			</div>
			<Image
				src={
					hasSaved
						? "/assets/icons/star-filled.svg"
						: "/assets/icons/star-red.svg"
				}
				alt="star"
				width={18}
				height={18}
				className="cursor-pointer"
				onClick={() => handleSaved}
			/>
		</div>
	);
};

export default Votes;
