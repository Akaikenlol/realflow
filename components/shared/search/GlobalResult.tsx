"use client";

import React, { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlobalFilter from "./GlobalFilter";

const GlobalResult = () => {
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState([
		{ type: "question", id: 1, title: "Next.js" },
		{ type: "tag", id: 1, title: "Next.js" },
		{ type: "user", id: 1, title: "Keith | Ken" },
	]);

	const global = searchParams.get("global");
	const type = searchParams.get("filter");

	useEffect(() => {
		const fetchResult = async () => {
			setResult([]);
			setIsLoading(true);

			try {
				// Fetch Everything all at once.. -> global search
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};
	}, [global, type]); // when global and type change re run the useEffect and re run the data

	const renderLink = (type: string, id: string) => {
		return "/";
	};

	return (
		<div className="absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 dark:bg-dark-400 py-5 shadow-sm ">
			<GlobalFilter />
			<div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50" />

			<div className="space-y-5">
				<p className="text-dark400_light900 paragraph-semibold px-5">
					Top Match
				</p>
				{isLoading ? (
					<div className="flex-center flex-col px-5">
						<ReloadIcon className="my-2 h-10 w-10 text-primary-500 animate-spin" />
						<p className="text-dark200_light800 body-regular">
							Browsing the entire database
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{result.length > 0 ? (
							result.map((item: any, index: number) => (
								<Link
									href={renderLink("type", "id")}
									key={item.type + item.id + index}
									className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 hover:dark:bg-dark-500/50"
								>
									<Image
										src="/assets/icons/tag.svg"
										alt="tags"
										width={18}
										height={18}
										className="invert-colors mt-1 object-contain"
									/>
									<div className="flex flex-col">
										<p className="body-medium text-dark200_light800 line-clamp-1">
											{item.title}
										</p>
										<p className="small-medium text-light400_light500 mt-1 font-bold capitalize">
											{item.type}
										</p>
									</div>
								</Link>
							))
						) : (
							<div className="flex-center flex-col px-5">
								<p className="text-dark200_light800 body-regular px-5 py-2.5">
									Oops, no result found
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default GlobalResult;
