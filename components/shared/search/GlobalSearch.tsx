"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const query = searchParams.get("q");

	const [search, setSearch] = useState(query || "");
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (search) {
				const newUrl = formUrlQuery({
					params: searchParams.toString(),
					key: "global",
					value: search,
				});
				router.push(newUrl, { scroll: false });
			} else {
				if (query) {
					const newUrl = removeKeysFromQuery({
						params: searchParams.toString(),
						keysToRemove: ["global", "type"],
					});
					router.push(newUrl, { scroll: false });
				}
			}
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [search, searchParams, router, pathname, query]);

	// console.log(query);
	return (
		<div className="w-full max-w-[600px] max-lg:hidden relative">
			<div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center px-4 rounded-lg gap-1">
				<Image
					src="/assets/icons/search.svg"
					alt="search"
					width={24}
					height={24}
					className="cursor-pointer"
				/>
				<Input
					type="text"
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);

						if (!isOpen) setIsOpen(true);
						if (e.target.value === "" && isOpen) setIsOpen(false);
					}}
					placeholder="Search globally"
					className="no-focus paragraph-regular placeholder text-dark400_light900 background-light800_darkgradient border-none shadow-none outline-none"
				/>
			</div>
			{isOpen && <GlobalResult />}
		</div>
	);
};

export default GlobalSearch;
