import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

const RightSideBar = () => {
	return (
		<section className="background-light900_dark200 light-border sticky right-0 top-0 flex flex-col h-screen justify-between overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-md:hidden lg:-w[300px] gap-6 custom-scrollbar">
			<h1 className="base-bold text-dark300_light900 ">Top Questions</h1>
			<div className="flex flex-col gap-6 flex-1 max-w-[300px] text-dark300_light700">
				<div className="flex-between gap-6 body-regular">
					<p>Is it only me or the font is bolder than necessary?</p>
					<Image
						src="/assets/icons/chevron-right.svg"
						alt="Arrow"
						width={20}
						height={20}
						className="invert-colors"
					/>
				</div>
				<div className="flex-between gap-6 body-regular">
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
				<div className="flex-between gap-6 body-regular">
					<p>Can I get the course for free?</p>
					<Image
						src="/assets/icons/chevron-right.svg"
						alt="Arrow"
						width={20}
						height={20}
						className="invert-colors"
					/>
				</div>
				<div className="flex-between gap-6 body-regular">
					<p>Redux Toolkit Not Updating State as Expected</p>
					<Image
						src="/assets/icons/chevron-right.svg"
						alt="Arrow"
						width={20}
						height={20}
						className="invert-colors"
					/>
				</div>
				<div className="flex-between gap-6 body-regular">
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
			<h1 className="base-bold text-dark300_light900 mt-20 ">Popular Tags</h1>
			<div className="flex gap-2 flex-col">
				<div className="flex justify-between text-light400_light500 ">
					<Button className="btn-secondary subtle-regular">NEXT JS</Button>
					<p className="text-dark300_light900 subtle-regular">21</p>
				</div>
				<div className="flex justify-between text-light400_light500 ">
					<Button className="btn-secondary subtle-regular">NUXT JS</Button>
					<p className="text-dark300_light900 subtle-regular">15</p>
				</div>
				<div className="flex justify-between text-light400_light500 ">
					<Button className="btn-secondary subtle-regular">NEST JS</Button>
					<p className="text-dark300_light900 subtle-regular">13</p>
				</div>
				<div className="flex justify-between text-light400_light500 ">
					<Button className="btn-secondary subtle-regular">React JS</Button>
					<p className="text-dark300_light900 subtle-regular">10</p>
				</div>
				<div className="flex justify-between text-light400_light500 ">
					<Button className="btn-secondary subtle-regular">Tailwind CSS</Button>
					<p className="text-dark300_light900 subtle-regular">8</p>
				</div>
			</div>
		</section>
	);
};

export default RightSideBar;
