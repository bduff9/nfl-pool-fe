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
import { GameStatus } from '../generated/graphql';

export const convertGameStatusToDB = (gameStatus: GameStatus): string => {
	switch (gameStatus) {
		case GameStatus.FirstQuarter:
			return '1st Quarter';
		case GameStatus.SecondQuarter:
			return '2nd Quarter';
		case GameStatus.HalfTime:
			return 'Half Time';
		case GameStatus.ThirdQuarter:
			return '3rd Quarter';
		case GameStatus.FourthQuarter:
			return '4th Quarter';
		default:
			return gameStatus;
	}
};

export const getAbbreviation = (sentence: string): string => {
	const words = sentence.split(/\s/g);
	const letters = words.map(word => word.charAt(0).toUpperCase());

	return letters.join('');
};

export const getBackgroundColor = (
	value: number,
	maxValue: number,
	defaultColor = '#fff',
): string => {
	if (value === 0) return defaultColor;

	const MAX_COLOR = 255;
	const DOUBLE_MAX_COLOR = MAX_COLOR * 2;
	const percent = value / maxValue;
	const red = Math.min(Math.round((1 - percent) * DOUBLE_MAX_COLOR), MAX_COLOR);
	const green = Math.min(Math.round(percent * DOUBLE_MAX_COLOR), MAX_COLOR);
	const blue = 0;

	return `rgb(${red}, ${green}, ${blue})`;
};

export const getShortQuarter = (quarter: string): string => {
	if (quarter === 'Overtime') return 'OT';

	if (quarter === 'Half Time') return 'Half';

	return quarter
		.split(' ')
		.map(word => word.charAt(0))
		.reverse()
		.join('');
};

export const isEmailAddress = (value: string): boolean => !!value.match(/^.+@.+\..+$/);

export const isPhoneNumber = (value: string): boolean => !!value.match(/^[\d() -]+$/);

export const isUsername = (value: string): boolean => !!value.match(/^[\w-]{3,}$/);

type DragData =
	| { gameID: number; type: 'home' | 'visitor' }
	| { gameID: null; type: 'pointBank' };

export const parseDragData = (
	id: string,
	sourceID: string,
	destinationID?: string,
): [number, DragData | null, DragData | null] => {
	const pointMatch = id.match(/point-(\d+)/);
	const points = pointMatch ? +pointMatch[1] : 0;
	let source: DragData | null = null;
	let destination: DragData | null = null;

	if (sourceID === 'pointBank') {
		source = { gameID: null, type: 'pointBank' };
	} else {
		const sourceMatch = sourceID.match(/(home|visitor)-pick-for-game-(\d+)/);

		if (sourceMatch) {
			source = { gameID: +sourceMatch[2], type: sourceMatch[1] as 'home' | 'visitor' };
		}
	}

	if (destinationID) {
		if (destinationID === 'pointBank') {
			destination = { gameID: null, type: 'pointBank' };
		} else {
			const destinationMatch = destinationID.match(/(home|visitor)-pick-for-game-(\d+)/);

			if (destinationMatch) {
				destination = {
					gameID: +destinationMatch[2],
					type: destinationMatch[1] as 'home' | 'visitor',
				};
			}
		}
	}

	return [points, source, destination];
};
