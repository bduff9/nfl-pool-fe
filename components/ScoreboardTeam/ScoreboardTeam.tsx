import { faFootballBall } from '@bduff9/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import Image from 'next/image';
import React, { FC } from 'react';

import { GameStatus, Team } from '../../generated/graphql';

import styles from './ScoreboardTeam.module.scss';

type ScoreboardTeamProps = {
	gameStatus: GameStatus;
	hasPossession: boolean;
	isInRedzone: boolean;
	isWinner: boolean;
	score: number;
	team: Pick<Team, 'teamCity' | 'teamID' | 'teamLogo' | 'teamName' | 'teamShortName'>;
};

const ScoreboardTeam: FC<ScoreboardTeamProps> = ({
	gameStatus,
	hasPossession,
	isInRedzone,
	isWinner,
	score,
	team,
}) => {
	const isLoser = !isWinner && gameStatus === GameStatus.Final;

	return (
		<>
			<div className="team-logo">
				<Image
					alt={`${team.teamCity} ${team.teamName}`}
					className={clsx(isLoser && styles.loser)}
					height={70}
					layout="intrinsic"
					src={`/NFLLogos/${team.teamLogo}`}
					title={`${team.teamCity} ${team.teamName}`}
					width={70}
				/>
			</div>
			<div
				className={clsx(
					'flex-grow-1',
					'd-flex',
					'align-items-center',
					'ps-3',
					isWinner && 'text-success',
					isWinner && 'fw-bold',
					isLoser && 'text-muted',
					isInRedzone && 'text-danger',
				)}
			>
				<span className="d-none d-md-inline">
					{team.teamCity} {team.teamName}
				</span>
				<span className="d-md-none">{team.teamShortName}</span>
			</div>
			<div
				className={clsx(
					'd-flex',
					'align-items-center',
					'pe-3',
					isWinner && 'text-success',
					isWinner && 'fw-bold',
					isLoser && 'text-muted',
					isInRedzone && 'text-danger',
				)}
			>
				{gameStatus !== GameStatus.Pregame && (
					<>
						{hasPossession && (
							<FontAwesomeIcon
								className={clsx('me-2', !isInRedzone && styles.football)}
								icon={faFootballBall}
							/>
						)}
						{score}
					</>
				)}
			</div>
			<div className="w-100"></div>
		</>
	);
};

ScoreboardTeam.whyDidYouRender = true;

export default ScoreboardTeam;
