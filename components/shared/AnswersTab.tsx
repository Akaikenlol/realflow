import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionCard from "../cards/QuestionCard";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
	userId: string;
	clerkId?: string | null;
}

const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
	const result = await getUserAnswers({
		userId,
		page: searchParams.page ? +searchParams.page : 1,
	});

	console.log(result.answers);
	return (
		<>
			{result.answers.map((item) => (
				<AnswerCard
					key={item._id}
					_id={item._id}
					clerkId={clerkId}
					question={item.question}
					author={item.author}
					upvotes={item.upvotes}
					createdAt={item.createdAt}
				/>
			))}
			<div className="mt-10">
				<Pagination
					pageNumber={searchParams?.page ? +searchParams.page : 1}
					isNext={result.isNextAnswers}
				/>
			</div>
		</>
	);
};

export default QuestionTab;
