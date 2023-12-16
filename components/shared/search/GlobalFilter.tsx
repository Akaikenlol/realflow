"use client";

import { GlobalSearchFilters } from "@/constants/filter";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

import React, { useState } from "react";

// Two different order of building out web application

// First approach
// 1. Build out the entire UI/UX -> frontend
// 2. Build out the backend

// Second approach
// Build out some features of the frontend,
// As soon as can connect one of those feature
// Connect with backend....
// Repeat
// 2nd feature frontend
// 2nd feature backend

const GlobalFilter = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const typeParams = searchParams.get("type");

	const [active, setActive] = useState(typeParams || "");

	const handleTypeClick = (item: string) => {
		if (active === item) {
			setActive("");
			const newUrl = formUrlQuery({
				params: searchParams.toString(),
				key: "type",
				value: null,
			});
			router.push(newUrl, { scroll: false });
		} else {
			setActive(item);
			const newUrl = formUrlQuery({
				params: searchParams.toString(),
				key: "type",
				value: item.toLowerCase(),
			});
			router.push(newUrl, { scroll: false });
		}
	};

	return (
		<div className="flex items-center gap-5 px-5">
			<p className="text-dark400_light900 body-medium">Type: </p>
			<div className="flex gap-3">
				{GlobalSearchFilters.map((item) => (
					<button
						key={item.value}
						type="button"
						className={`light-border-2 small-medium dark:text-light-800 rounded-2xl px-5 py-2 capitalize dark:hover:text-primary-500 ${
							active === item.value
								? "bg-primary-500 text-light-900"
								: "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500"
						}`}
						onClick={() => handleTypeClick(item.value)}
					>
						{item.name}
					</button>
				))}
			</div>
		</div>
	);
};

export default GlobalFilter;
