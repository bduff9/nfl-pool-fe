/*******************************************************************************
 * NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
 * Copyright (C) 2015-present Brian Duffey
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
import { logger } from './logging';

export const getRandomInteger = (from = 0, to = 10): number => {
	if (to <= from) {
		logger.error({ text: 'Invalid to passed in: ', from, to });

		return 0;
	}

	return Math.floor(Math.random() * (to - from)) + from;
};

export const isNumber = (value: unknown): value is number => {
	if (!['number', 'string'].includes(typeof value)) return false;

	const num = typeof value === 'string' ? +value : value;

	return !Number.isNaN(num);
};
