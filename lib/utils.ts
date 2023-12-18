import { BADGE_CRITERIA } from "@/constants";
import { BadgeCounts } from "@/types";
import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date): string => {
	const now = new Date();
	const timeDifference = now.getTime() - createdAt.getTime();

	// Define time intervals in milliseconds
	const minute = 60 * 1000;
	const hour = minute * 60;
	const day = hour * 24;
	const week = day * 7;
	const month = day * 30; // Assuming a month is 30 days
	const year = day * 365; // Assuming a year is 365 days

	// Calculate the time ago
	if (timeDifference < minute) {
		const seconds = Math.floor(timeDifference / 1000);
		return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
	} else if (timeDifference < hour) {
		const minutes = Math.floor(timeDifference / minute);
		return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
	} else if (timeDifference < day) {
		const hours = Math.floor(timeDifference / hour);
		return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
	} else if (timeDifference < week) {
		const days = Math.floor(timeDifference / day);
		return `${days} ${days === 1 ? "day" : "days"} ago`;
	} else if (timeDifference < month) {
		const weeks = Math.floor(timeDifference / week);
		return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
	} else if (timeDifference < year) {
		const months = Math.floor(timeDifference / month);
		return `${months} ${months === 1 ? "month" : "months"} ago`;
	} else {
		const years = Math.floor(timeDifference / year);
		return `${years} ${years === 1 ? "year" : "years"} ago`;
	}
};

// Example usage:
// const createdAt = new Date("2023-11-20T12:00:00Z");
// console.log(getTimestamp(createdAt));

export const formatNumberWithExtension = (number: number): string => {
	if (number >= 1000000) {
		// If the number is in millions (1,000,000 or more)
		const millions = (number / 1000000).toFixed(1);
		return `${millions}M`;
	} else if (number >= 1000) {
		// If the number is in thousands (1,000 or more)
		const thousands = (number / 1000).toFixed(1);
		return `${thousands}K`;
	} else {
		// If the number is less than 1,000, simply return the number as is
		return `${number}`;
	}
};

// Example usage:
// const bigNumber = 1500000; // 1.5 million
// const formattedNumber = formatNumberWithExtension(bigNumber);
// console.log(formattedNumber);

export const getJoinedDate = (date: Date): string => {
	// Get the month and year from the date
	const month = date.toLocaleString("default", { month: "long" }); // Months are zero-based
	const year = date.getFullYear();

	// Format the date as MM/YYYY
	const joinedDate = `${month} ${year}`;

	return joinedDate;
};

// Example usage:
// const currentDate = new Date();
// const joinedDate = getJoinedDate(currentDate);
// console.log(joinedDate);

interface UrlQueryParams {
	params: string;
	key: string;
	value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
	const currentUrl = qs.parse(params);

	currentUrl[key] = value;

	return qs.stringifyUrl(
		{
			url: window.location.pathname,
			query: currentUrl,
		},
		{ skipNull: true }
	);
};

interface RemoveUrlQueryParams {
	params: string;
	keysToRemove: string[];
}

export const removeKeysFromQuery = ({
	params,
	keysToRemove,
}: RemoveUrlQueryParams) => {
	const currentUrl = qs.parse(params);

	keysToRemove.forEach((key) => {
		delete currentUrl[key];
	});

	return qs.stringifyUrl(
		{
			url: window.location.pathname,
			query: currentUrl,
		},
		{ skipNull: true }
	);
};

interface BadgeParams {
	criteria: {
		type: keyof typeof BADGE_CRITERIA;
		count: number;
	}[];
}

export const assignBadges = (params: BadgeParams) => {
	const badgeCounts: BadgeCounts = {
		GOLD: 0,
		SILVER: 0,
		BRONZE: 0,
	};

	const { criteria } = params;

	criteria.forEach((item) => {
		const { count, type } = item;
		const badgeLevels: any = BADGE_CRITERIA[type];

		Object.keys(badgeLevels).forEach((level: any) => {
			if (count >= badgeLevels[level]) {
				badgeCounts[level as keyof BadgeCounts] += 1;
			}
		});
	});

	return badgeCounts;
};
