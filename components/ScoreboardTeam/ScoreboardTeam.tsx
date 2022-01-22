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
import { faFootballBall } from '@bduff9/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import Image from 'next/image';
import React, { VFC } from 'react';

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

const ScoreboardTeam: VFC<ScoreboardTeamProps> = ({
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
