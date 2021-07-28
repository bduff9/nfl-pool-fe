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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@bduff9/pro-duotone-svg-icons/faInfoCircle';
import { faAt } from '@bduff9/pro-duotone-svg-icons/faAt';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { FC, useContext, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import Authenticated from '../../components/Authenticated/Authenticated';
import CustomHead from '../../components/CustomHead/CustomHead';
import { makeSurvivorPick, useMakeSurvivorPickView } from '../../graphql/survivorSet';
import { TUser } from '../../models/User';
import {
	isSignedInSSR,
	UNAUTHENTICATED_REDIRECT,
	isDoneRegisteringSSR,
	IS_NOT_DONE_REGISTERING_REDIRECT,
} from '../../utils/auth.server';
import { WeekContext } from '../../utils/context';
import { formatDateForKickoff, formatTimeFromKickoff } from '../../utils/dates';
import styles from '../../styles/survivor/set.module.scss';
import { getEmptyArray } from '../../utils/arrays';
import TeamDetail from '../../components/TeamDetail/TeamDetail';
import SurvivorTeam from '../../components/SurvivorTeam/SurvivorTeam';
import Alert from '../../components/Alert/Alert';
import AlertContainer from '../../components/AlertContainer/AlertContainer';

type SurvivorTeamLoaderProps = {
	isHome?: boolean;
};

const SurvivorTeamLoader: FC<SurvivorTeamLoaderProps> = ({ isHome = false }) => {
	return (
		<div
			className={clsx(
				!isHome && 'border-start',
				'border-bottom',
				'border-end',
				'border-dark',
				'position-relative',
				'pt-2',
				'px-2',
				'text-center',
				'w-50',
				styles['game-team'],
			)}
		>
			<Skeleton height={70} width={70} />
			<br />
			<span className="d-none d-md-inline">
				<Skeleton width={100} />{' '}
			</span>
			<Skeleton width={75} />
		</div>
	);
};

const MakeSurvivorPickLoader: FC = () => (
	<>
		{getEmptyArray(16).map((_, i) => (
			<div
				className={clsx(
					'col-12',
					'col-md-6',
					'col-lg-4',
					'col-xxl-3',
					'd-flex',
					'flex-wrap',
					'pb-3',
					'position-relative',
				)}
				key={`survivor-game-loader-${i}`}
			>
				<div
					className={clsx(
						'w-100',
						'text-muted',
						'border',
						'border-dark',
						'd-flex',
						'justify-content-around',
						'overflow-hidden',
						styles['game-header'],
					)}
				>
					<div>
						<Skeleton width={136} />
					</div>
					<div>
						<Skeleton width={100} />
					</div>
					<div>
						<FontAwesomeIcon icon={faInfoCircle} />
					</div>
				</div>
				<SurvivorTeamLoader />
				<SurvivorTeamLoader isHome />
				<div
					className={clsx(
						'position-absolute',
						'top-50',
						'start-50',
						'translate-middle',
						'rounded-circle',
						'border',
						'border-dark',
						styles.at,
					)}
				>
					<FontAwesomeIcon icon={faAt} />
				</div>
			</div>
		))}
	</>
);

type SetSurvivorProps = {
	user: TUser;
};

const SetSurvivor: FC<SetSurvivorProps> = () => {
	const router = useRouter();
	const [selectedWeek] = useContext(WeekContext);
	const { data, error, mutate } = useMakeSurvivorPickView(selectedWeek);
	const [selectedGame, setSelectedGame] = useState<null | number>(null);
	const [errorMessage, setErrorMessage] = useState<null | string>(null);
	const [successMessage, setSuccessMessage] = useState<null | string>(null);

	const setSurvivorPick = async (gameID: number, teamID: number): Promise<void> => {
		try {
			mutate(data => {
				if (!data) return data;

				const getMySurvivorPicks = data.getMySurvivorPicks.map(pick => {
					if (pick.survivorPickWeek === selectedWeek) {
						return {
							game: { gameID },
							survivorPickWeek: selectedWeek,
							team: { teamID },
						};
					}

					return pick;
				});

				return { ...data, getMySurvivorPicks };
			}, false);
			await makeSurvivorPick(selectedWeek, gameID, teamID);
			setSuccessMessage(`Successfully saved survivor pick for week ${selectedWeek}`);
		} catch (error) {
			console.error('Error making survivor pick', { error, gameID, selectedWeek, teamID });
			setErrorMessage(
				error?.response?.errors?.[0]?.message ?? 'Something went wrong, please try again',
			);
		} finally {
			await mutate();
		}
	};

	if (typeof window !== 'undefined') {
		if (selectedWeek <= (data?.getWeekInProgress ?? 0)) {
			router.replace('/survivor/view');

			return <></>;
		}

		if (data?.isAliveInSurvivor === false) {
			router.replace('/');

			return <></>;
		}
	}

	if (error) {
		console.error('Error when loading data for Make Survivor Pick', error);
	}

	return (
		<Authenticated isSurvivorPlayer>
			<CustomHead title="Make Survivor Picks" />
			<AlertContainer>
				{errorMessage && (
					<Alert
						autoHide
						delay={5000}
						message={errorMessage}
						onClose={() => setErrorMessage(null)}
						title="Failed to set survivor pick"
						type="danger"
					/>
				)}
				{successMessage && (
					<Alert
						autoHide
						delay={5000}
						message={successMessage}
						onClose={() => setSuccessMessage(null)}
						title="Success!"
						type="success"
					/>
				)}
			</AlertContainer>
			<div className="content-bg text-dark my-3 mx-2 pt-5 pt-md-3 min-vh-100 pb-4 col">
				<SkeletonTheme>
					<div className="row min-vh-100">
						<h4 className="mb-5 text-center">
							Pick one team you think will win by clicking a team’s logo. You cannot pick
							the same team more than once during the season.
						</h4>
						{!data ? (
							<MakeSurvivorPickLoader />
						) : (
							<>
								{data.getGamesForWeek
									.filter(game => !selectedGame || game.gameID === selectedGame)
									.map(game => (
										<div
											className={clsx(
												'col-12',
												'col-md-6',
												'col-lg-4',
												'col-xxl-3',
												'd-flex',
												'flex-wrap',
												'pb-3',
												'position-relative',
											)}
											key={`survivor-game-${game.gameID}`}
											style={{ height: '12rem' }}
										>
											<div
												className={clsx(
													'w-100',
													'text-muted',
													'border',
													'border-dark',
													'd-flex',
													'justify-content-around',
													'overflow-hidden',
													styles['game-header'],
													styles['bg-game'],
												)}
												onClick={() =>
													setSelectedGame(gameID => (gameID ? null : game.gameID))
												}
											>
												<div>{formatDateForKickoff(game.gameKickoff)}</div>
												<div>{formatTimeFromKickoff(game.gameKickoff)}</div>
												<div>
													<FontAwesomeIcon icon={faInfoCircle} />
												</div>
											</div>
											<SurvivorTeam
												onClick={() =>
													setSurvivorPick(game.gameID, game.visitorTeam.teamID)
												}
												pick={data.getMySurvivorPicks.find(
													pick => pick.team?.teamID === game.visitorTeam.teamID,
												)}
												team={game.visitorTeam}
												weekInProgress={data.getWeekInProgress ?? 0}
											/>
											<SurvivorTeam
												isHome
												onClick={() => setSurvivorPick(game.gameID, game.homeTeam.teamID)}
												pick={data.getMySurvivorPicks.find(
													pick => pick.team.teamID === game.homeTeam.teamID,
												)}
												team={game.homeTeam}
												weekInProgress={data.getWeekInProgress ?? 0}
											/>
											<div
												className={clsx(
													'position-absolute',
													'top-50',
													'start-50',
													'translate-middle',
													'rounded-circle',
													'border',
													'border-dark',
													styles.at,
												)}
											>
												<FontAwesomeIcon icon={faAt} />
											</div>
										</div>
									))}
								{selectedGame ? (
									<TeamDetail gameID={selectedGame} />
								) : (
									<>
										<div className="w-100"></div>
										<h5 className="text-center pt-4">Teams on Bye Week</h5>
										{data.getTeamsOnBye.map(team => (
											<SurvivorTeam
												key={`bye-week-team-${team.teamID}`}
												isOnBye
												pick={data.getMySurvivorPicks.find(
													pick => pick.team.teamID === team.teamID,
												)}
												team={team}
												weekInProgress={data.getWeekInProgress ?? 0}
											/>
										))}
									</>
								)}
							</>
						)}
					</div>
				</SkeletonTheme>
			</div>
		</Authenticated>
	);
};

SetSurvivor.whyDidYouRender = true;

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
export default SetSurvivor;
