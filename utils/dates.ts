/*******************************************************************************
 * NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
 * Copyright (C) 2015-present Brian Duffey and Billy Alexander
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see {http://www.gnu.org/licenses/}.
 * Home: https://asitewithnoname.com/
 */
import {
	HOURS_IN_DAY,
	MILLISECONDS_IN_SECOND,
	MINUTES_IN_HOUR,
	SECONDS_IN_MINUTE,
} from './constants';

export const formatDateForKickoff = (dateStr: string): string => {
	const options: Intl.DateTimeFormatOptions = {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
	};
	const date = new Date(dateStr);

	return date.toLocaleDateString('en-US', options);
};

export const formatTimeFromKickoff = (dateStr: string): string => {
	const options: Intl.DateTimeFormatOptions = {
		hour: 'numeric',
		minute: '2-digit',
		timeZoneName: 'short',
	};
	const date = new Date(dateStr);

	return date.toLocaleTimeString('en-US', options);
};

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
