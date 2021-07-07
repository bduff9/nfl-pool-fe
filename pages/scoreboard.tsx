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
import { faFootballBall } from '@bduff9/pro-solid-svg-icons/faFootballBall';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import React, { FC, useContext } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';

import Authenticated from '../components/Authenticated/Authenticated';
import CustomHead from '../components/CustomHead/CustomHead';
import { useGamesForWeek } from '../graphql/scoreboard';
import { TUser } from '../models/User';
import {
	isDoneRegisteringSSR,
	isSignedInSSR,
	IS_NOT_DONE_REGISTERING_REDIRECT,
	UNAUTHENTICATED_REDIRECT,
} from '../utils/auth.server';
import { WeekContext } from '../utils/context';
import { formatDateForKickoff, formatTimeFromKickoff } from '../utils/dates';
import styles from '../styles/scoreboard.module.scss';
import { GameStatus, Team } from '../generated/graphql';
import { convertGameStatusToDB, getShortQuarter } from '../utils/strings';

//TODO: start functions to move to other files
const ScoreboardLoader: FC = () => <>TODO: Skeleton loader here</>;

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

//TODO: end exports

type ScoreboardProps = {
	user: TUser;
};

const Scoreboard: FC<ScoreboardProps> = () => {
	const [selectedWeek] = useContext(WeekContext);
	const { data, error } = useGamesForWeek(selectedWeek);
	let lastKickoff: string;

	if (error) {
		console.error('Error when loading weekly games for NFL scoreboard', error);
	}

	return (
		<Authenticated isRegistered>
			<CustomHead title="Scoreboard" />
			<div className="content-bg text-dark my-3 mx-2 pt-5 pt-md-3 min-vh-100 pb-4 col">
				<SkeletonTheme>
					<div className="row min-vh-100">
						{!data ? (
							<ScoreboardLoader />
						) : (
							data.getGamesForWeek.map(game => {
								const currentKickoff = formatDateForKickoff(game.gameKickoff);
								const differentKickoff = currentKickoff !== lastKickoff;
								const isFirst = !lastKickoff;

								lastKickoff = currentKickoff;

								return (
									<>
										{differentKickoff && (
											<>
												<div
													className={clsx(
														'w-100',
														'text-start',
														'fw-bold',
														!isFirst && 'mt-3',
													)}
												>
													{currentKickoff}
												</div>
											</>
										)}
										<div className="col-12 col-md-6 mb-3">
											<div
												className={clsx('p-3', 'd-flex', styles.game)}
												key={`game-${game.gameID}`}
											>
												<div className={clsx('d-flex', 'flex-grow-1', 'flex-wrap')}>
													<ScoreboardTeam
														gameStatus={game.gameStatus}
														hasPossession={
															game.teamHasPossession?.teamID === game.homeTeam.teamID
														}
														isInRedzone={
															game.teamInRedzone?.teamID === game.homeTeam.teamID
														}
														isWinner={game.winnerTeam?.teamID === game.homeTeam.teamID}
														score={game.gameHomeScore}
														team={game.homeTeam}
													/>
													<ScoreboardTeam
														gameStatus={game.gameStatus}
														hasPossession={
															game.teamHasPossession?.teamID === game.visitorTeam.teamID
														}
														isInRedzone={
															game.teamInRedzone?.teamID === game.visitorTeam.teamID
														}
														isWinner={game.winnerTeam?.teamID === game.visitorTeam.teamID}
														score={game.gameVisitorScore}
														team={game.visitorTeam}
													/>
												</div>
												<div
													className={clsx(
														'text-center',
														'pt-4',
														'fs-4',
														styles['game-status'],
													)}
												>
													<GameStatusDisplay
														kickoff={game.gameKickoff}
														status={game.gameStatus}
														timeLeft={game.gameTimeLeftInQuarter}
													/>
												</div>
											</div>
										</div>
									</>
								);
							})
						)}
					</div>
				</SkeletonTheme>
			</div>
		</Authenticated>
	);
};

Scoreboard.whyDidYouRender = true;

// ts-prune-ignore-next
export const getServerSideProps: GetServerSideProps = async context => {
	const session = await isSignedInSSR(context);

	if (!session) {
		return UNAUTHENTICATED_REDIRECT;
	}

	const isDoneRegistering = isDoneRegisteringSSR(session);

	if (!isDoneRegistering) {
		return IS_NOT_DONE_REGISTERING_REDIRECT;
	}

	const { user } = session;

	return { props: { user } };
};

// ts-prune-ignore-next
export default Scoreboard;
