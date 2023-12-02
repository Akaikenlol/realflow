import { AnswerFilters, TagFilters } from "@/constants/filter";
import Filters from "@/components/shared/Filters";
import React from "react";
import { getAnswer } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Vote from "./Votes";
import Votes from "./Votes";

interface Props {
	questionId: string;
	userId: string;
	totalAnswer: number;
	page?: number;
	filter?: number;
}

const AllAnswers = async ({
	questionId,
	userId,
	totalAnswer,
	page,
	filter,
}: Props) => {
	const result = await getAnswer({ questionId });
	return (
		<div className="mt-11">
			<div className="flex justify-between items-center">
				<h3 className="tex-primary-500">{totalAnswer} Answers</h3>
				<Filters filters={AnswerFilters} />
			</div>
			<div>
				{result.answers.map((answer) => (
					<article key={answer._id} className="light-border border-b py-10">
						<div className="flex justify-between items-center">
							<div className="flex flex-col-reverse justify-between mb-8 gap-5 sm:flex-row sm:items-center sm:gap-2">
								<Link
									href={`/profile/${answer.author.clerkId}`}
									className="flex flex-1 items-start gap-1 sm:items-center"
								>
									<Image
										src={answer.author.picture}
										alt="profile"
										width={18}
										height={18}
										className="object-cover rounded-full max-sm:mt-0.5"
									/>
									<div className="flex flex-col sm:flex-row sm:items-center">
										<p className="body-semibold text-dark300_light700">
											{answer.author.name}
										</p>
										<p className="small-regular text-light400_light500 mt-0.5 line-clamp-1 ml-1.5">
											answered {getTimestamp(answer.createdAt)}{" "}
										</p>
									</div>
								</Link>
								<div className="flex justify-end">
									<Votes />
								</div>
							</div>
						</div>
						<ParseHTML data={answer.content} />
					</article>
				))}
			</div>
		</div>
	);
};

export default AllAnswers;