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
			<br />
			{timeLeft}
		</>
	);
};

GameStatusDisplay.whyDidYouRender = true;

export default GameStatusDisplay;
