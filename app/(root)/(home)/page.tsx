import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filter";
import Link from "next/link";

const questions = [
	{
		_id: "1",
		title:
			"Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
		tags: [
			{ _id: "1", name: "NEXT JS" },
			{ _id: "2", name: "Server Side Rendering" },
		],
		author: { _id: "1", name: "John Doe", picture: "john-doe.png" },
		upvotes: 100000,
		views: 1000000,
		answers: [],
		createdAt: new Date("2023-11-21T12:00:00.000Z"),
	},
	{
		_id: "2",
		title: "Redux Toolkit Not Updating State as Expected",
		tags: [
			{ _id: "1", name: "NEXT JS" },
			{ _id: "2", name: "Server Side Rendering" },
		],
		author: { _id: "1", name: "Sujata", picture: "sujata.png" },
		upvotes: 2550000,
		views: 400000,
		answers: [],
		createdAt: new Date("2023-11-19T12:00:00.000Z"),
	},
];

export default function Home() {
	return (
		<>
			<div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="h1-bold text-dark100_light900">All Questions</h1>
				<Link href="/ask-question" className="flex justify-end max-sm:w-full">
					<Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
						Ask a Question
					</Button>
				</Link>
			</div>
			<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
				<LocalSearchBar
					route="/"
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search for questions"
					otherClasses="flex-1"
				/>
				<Filters
					filters={HomePageFilters}
					otherClasses="min-h-[56px] sm:min-w-[170px]"
					containerClasses="hidden max-md:flex"
				/>
			</div>
			<HomeFilters />

			<div className="mt-10 flex flex-col gap-6 w-full">
				{questions.length > 0 ? (
					questions.map((question) => (
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
						title="There's no question to show"
						description="Be the first to break the silence!🚀 Ask a Question and kickstart the
					discussion, our query could be the next big thing others learn from. Get
					involved!.💡"
						link="/ask-question"
						linkTitle="Ask a Question"
					/>
				)}
			</div>
		</>
	);
}
