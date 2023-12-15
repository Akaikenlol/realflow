import QuestionCard from "@/components/cards/QuestionCard";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { TagFilters } from "@/constants/filter";
import { IQuestion } from "@/database/question.model";
import { getQuestionsByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";
import React from "react";

const Page = async ({ params, searchParams }: URLProps) => {
	const result = await getQuestionsByTagId({
		tagId: params.id,
		page: searchParams.page ? +searchParams.page : 1,
		searchQuery: searchParams.q,
	});

	// console.log("result", result);
	return (
		<>
			<h1 className="h1-bold text-dark100_light900">
				{result.tagTitle.charAt(0).toUpperCase()}
				{result.tagTitle.slice(1)}
			</h1>

			<div className="mt-11 w-full">
				<LocalSearchBar
					route={`/tags/${params.id}`}
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search tag questions"
					otherClasses="flex-1"
				/>
			</div>

			<div className="mt-10 flex flex-col gap-6 w-full">
				{result.questions.length > 0 ? (
					result.questions.map((question: IQuestion) => (
						<QuestionCard
							key={question._id}
							_id={question._id}
							title={question.title}
							tags={question.tags}
							author={question.author}
							upvotes={question.upvotes}
							views={question.views}
							answers={question.answers}
							createdAt={question.createdAt}
						/>
					))
				) : (
					<NoResult
						title="There's no tag question to show"
						description="Be the first to break the silence!🚀 Ask a Question and kickstart the
					discussion, our query could be the next big thing others learn from. Get
					involved!.💡"
						link="/ask-question"
						linkTitle="Ask a Question"
					/>
				)}
			</div>
			<div className="mt-10">
				<Pagination
					pageNumber={searchParams?.page ? +searchParams.page : 1}
					isNext={result.isNext}
				/>
			</div>
		</>
	);
};

export default Page;
