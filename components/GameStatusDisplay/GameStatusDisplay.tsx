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
import React, { FC } from 'react';

import { GameStatus } from '../../generated/graphql';
import { formatTimeFromKickoff } from '../../utils/dates';
import { convertGameStatusToDB, getShortQuarter } from '../../utils/strings';

type GameStatusDisplayProps = {
	kickoff: string;
	status: GameStatus;
	timeLeft: string;
};

const GameStatusDisplay: FC<GameStatusDisplayProps> = ({ kickoff, status, timeLeft }) => {
	if (status === GameStatus.Final) {
		return <>{status}</>;
	}

	if (status === GameStatus.Pregame) {
		return <>{formatTimeFromKickoff(kickoff)}</>;
	}

	const gameStatus = convertGameStatusToDB(status);

	return (
		<>
			<span className="d-none d-md-inline">{gameStatus}</span>
			<span className="d-md-none">{getShortQuarter(gameStatus)}</span>
			{status !== GameStatus.HalfTime && (
				<>
					<br />
					{timeLeft}
				</>
			)}
		</>
	);
};

GameStatusDisplay.whyDidYouRender = true;

export default GameStatusDisplay;
