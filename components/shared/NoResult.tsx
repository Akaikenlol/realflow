import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

interface Props {
	title: string;
	description: string;
	link: string;
	linkTitle: string;
}

const NoResult = ({ title, description, link, linkTitle }: Props) => {
	return (
		<div className="flex flex-col justify-center items-center w-full mt-10">
			<Image
				src="/assets/images/light-illustration.png"
				alt="No result illustration"
				width={270}
				height={200}
				className="object-contain block dark:hidden"
			/>
			<Image
				src="/assets/images/dark-illustration.png"
				alt="No result illustration"
				width={270}
				height={200}
				className="object-contain hidden dark:flex"
			/>
			<h1 className="h2-bold text-dark200_light900 mt-8">{title}</h1>
			<p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
				{description}
			</p>

			<Link href={link}>
				<Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 hover:bg-primary-500 px-4 py-3 text-light-900 dark:bg-primary-500 dark:text-light-900">
					{linkTitle}
				</Button>
			</Link>
		</div>
	);
};

export default NoResult;
