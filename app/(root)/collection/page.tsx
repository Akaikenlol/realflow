import QuestionCard from "@/components/cards/QuestionCard";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { QuestionFilters } from "@/constants/filter";
import { getSavedQuestion } from "@/lib/actions/user.action";
import React from "react";
import { auth } from "@clerk/nextjs";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";
import Loading from "./loading";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Collection | Dev Flow",
	description: "A place where developers share ideas and help each other grow",
};

const Page = async ({ searchParams }: SearchParamsProps) => {
	const { userId } = auth();

	if (!userId) return null;

	const result = await getSavedQuestion({
		clerkId: userId,
		searchQuery: searchParams.q,
		filter: searchParams.filter,
		page: searchParams.page ? +searchParams.page : 1,
	});

	// const isLoading = true;

	// if (isLoading) return <Loading />;

	return (
		<>
			<h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

			<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
				<LocalSearchBar
					route="/"
					// route={`/collection/${searchParams.id}`}
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search for questions"
					otherClasses="flex-1"
				/>
				<Filters
					filters={QuestionFilters}
					otherClasses="min-h-[56px] sm:min-w-[170px]"
				/>
			</div>

			<div className="mt-10 flex flex-col gap-6 w-full">
				{result.questions.length > 0 ? (
					result.questions.map((question: any) => (
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
						title="There's no saved question to show"
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
