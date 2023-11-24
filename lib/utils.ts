import { type ClassValue, clsx } from "clsx";
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

export const formatNumberWithExtension = (num: number): string => {
	if (num >= 1e6) {
		const formattedNumber = (num / 1e6).toFixed(2);
		return `${formattedNumber}M`;
	} else if (num >= 1e3) {
		const formattedNumber = (num / 1e3).toFixed(2);
		return `${formattedNumber}K`;
	} else {
		return num.toString();
	}
};

// Example usage:
// const bigNumber = 1500000; // 1.5 million
// const formattedNumber = formatNumberWithExtension(bigNumber);
// console.log(formattedNumber);
