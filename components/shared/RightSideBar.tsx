import Image from "next/image";
import React from "react";

const RightSideBar = () => {
	return (
		<section className="background-light900_dark200 light-border sticky right-0 top-0 flex flex-col h-screen justify-between overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-md:hidden lg:-w[300px] gap-6 custom-scrollbar">
			<h1 className="base-bold text-dark300_light900 ">Top Questions</h1>
			<div className="flex flex-col gap-6 flex-1 max-w-[300px] text-dark300_light700">
				<div className="flex-between gap-6 paragraph-regular">
					<p>Is it only me or the font is bolder than necessary?</p>
					<Image
						src="/assets/icons/chevron-right.svg"
						alt="Arrow"
						width={20}
						height={20}
						className="invert-colors"
					/>
				</div>
				<div className="flex-between gap-6">
					<p>
						Best practices for data fetching in a Next.js application with
						Server-Side Rendering (SSR)?
					</p>
					<Image
						src="/assets/icons/chevron-right.svg"
						alt="Arrow"
						width={20}
						height={20}
						className="invert-colors"
					/>
				</div>
				<div className="flex-between gap-6">
					<p>Can I get the course for free?</p>
					<Image
						src="/assets/icons/chevron-right.svg"
						alt="Arrow"
						width={20}
						height={20}
						className="invert-colors"
					/>
				</div>
				<div className="flex-between gap-6">
					<p>Redux Toolkit Not Updating State as Expected</p>
					<Image
						src="/assets/icons/chevron-right.svg"
						alt="Arrow"
						width={20}
						height={20}
						className="invert-colors"
					/>
				</div>
				<div className="flex-between gap-6">
					<p>Async/Await Function Not Handling Errors Properly</p>
					<Image
						src="/assets/icons/chevron-right.svg"
						alt="Arrow"
						width={20}
						height={20}
						className="invert-colors"
					/>
				</div>
			</div>
			<h1 className="base-bold text-dark300_light900 ">Popular Tags</h1>
		</section>
	);
};

export default RightSideBar;
