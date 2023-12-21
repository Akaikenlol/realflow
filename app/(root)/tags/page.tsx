import UserCard from "@/components/cards/UserCard";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { TagFilters } from "@/constants/filter";
import { getAllTags } from "@/lib/actions/tag.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";
import React from "react";
import Loading from "./loading";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Tags | Dev Flow",
	description: "A place where developers share ideas and help each other grow",
};

const Page = async ({ searchParams }: SearchParamsProps) => {
	const result = await getAllTags({
		searchQuery: searchParams.q,
		filter: searchParams.filter,
		page: searchParams.page ? +searchParams.page : 1,
	});

	console.log(result.tags);

	// const isLoading = true;

	// if (isLoading) return <Loading />;

	return (
		<>
			<h1 className="h1-bold text-dark100_light900">All Tags</h1>

			<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
				<LocalSearchBar
					route="/tags"
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search by tag name..."
					otherClasses="flex-1"
				/>
				<Filters
					filters={TagFilters}
					otherClasses="min-h-[56px] sm:min-w-[170px]"
				/>
			</div>

			<section className="mt-12 flex flex-wrap gap-4">
				{result.tags.length > 0 ? (
					result.tags.map((tag) => (
						<Link
							href={`/tags/${tag._id}`}
							key={tag._id}
							className="shadow-light100_darknone"
						>
							<article className="background_light900_dark200 light-border flex flex-col w-full rounded-2xl sm:w-[260px] border px-8 py-10">
								<div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
									<p className="paragraph-semibold text-dark300_light900">
										{tag.name}
									</p>
								</div>
								<p className="small-medium text-dark400_light500 mt-3.5">
									<span className="body- semibold primary-text-gradient mr-2.5">
										{tag.questions.length}+
									</span>
									Questions
								</p>
							</article>
						</Link>
					))
				) : (
					<NoResult
						title="No Tags Found"
						description="It looks like there are no tags found"
						link="/ask-question"
						linkTitle="Ask a Questions"
					/>
				)}
			</section>
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
