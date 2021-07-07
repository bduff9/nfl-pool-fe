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

export const getShortQuarter = (quarter: string): string => {
	if (quarter === 'Overtime') return 'OT';

	if (quarter === 'Half Time') return 'Half';

	return quarter
		.split(' ')
		.map(word => word.charAt(0))
		.reverse()
		.join('');
};
