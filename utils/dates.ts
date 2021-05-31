import {
	HOURS_IN_DAY,
	MILLISECONDS_IN_SECOND,
	MINUTES_IN_HOUR,
	SECONDS_IN_MINUTE,
} from './constants';

type TimeParts = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	total: number;
};

export const getTimeRemaining = (end: Date): TimeParts => {
	const now = new Date();
	const total = end.getTime() - now.getTime();
	const seconds = Math.floor((total / MILLISECONDS_IN_SECOND) % SECONDS_IN_MINUTE);
	const minutes = Math.floor(
		(total / (MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE)) % MINUTES_IN_HOUR,
	);
	const hours = Math.floor(
		(total / (MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR)) % HOURS_IN_DAY,
	);
	const days = Math.floor(
		total / (MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY),
	);

	return {
		days,
		hours,
		minutes,
		seconds,
		total,
	};
};

export const getTimeRemainingString = ({
	days,
	hours,
	minutes,
	seconds,
	total,
}: TimeParts): string => {
	if (total <= 0) return '';

	let remaining = '';
	let hasParts = 0;

	if ((days > 0 || hasParts > 0) && hasParts < 2) {
		remaining += `${days} days, `;
		hasParts++;
	}

	if ((hours > 0 || hasParts > 0) && hasParts < 2) {
		remaining += `${hours} hours, `;
		hasParts++;
	}

	if ((minutes > 0 || hasParts > 0) && hasParts < 2) {
		remaining += `${minutes} minutes, `;
		hasParts++;
	}

	if ((seconds > 0 || hasParts > 0) && hasParts < 2) {
		remaining += `${seconds} seconds, `;
		hasParts++;
	}

	return `${remaining.substring(0, remaining.length - 2)} remaining`;
};
