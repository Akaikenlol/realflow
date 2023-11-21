import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

const LocalSearchBar = () => {
	return (
		<div className="w-full max-w-[800px] relative">
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
					placeholder="Search globally"
					value=""
					className="no-focus paragraph-regular placeholder background-light800_darkgradient border-none shadow-none outline-none"
				/>
			</div>
		</div>
	);
};

export default LocalSearchBar;
