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
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { VFC, useContext, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { SkeletonTheme } from 'react-loading-skeleton';

import Authenticated from '../../components/Authenticated/Authenticated';
import CustomHead from '../../components/CustomHead/CustomHead';
import ViewAllTable from '../../components/ViewAllTable/ViewAllTable';
import { useMyTiebreakerForWeek } from '../../graphql/picksSet';
import { useViewAllPicks } from '../../graphql/viewAll';
import { useWeeklyRankings } from '../../graphql/weekly';
import { TUser } from '../../models/User';
import { sortPicks } from '../../utils/arrays';
import {
	isSignedInSSR,
	UNAUTHENTICATED_REDIRECT,
	isDoneRegisteringSSR,
	IS_NOT_DONE_REGISTERING_REDIRECT,
} from '../../utils/auth.server';
import { BackgroundLoadingContext, WeekContext } from '../../utils/context';
import styles from '../../styles/picks/viewall.module.scss';
import ViewAllModal from '../../components/ViewAllModal/ViewAllModal';
import { GameForWeek, useGamesForWeek } from '../../graphql/scoreboard';
import { logger } from '../../utils/logging';

type ViewAllPicksProps = {
	user: TUser;
};

const ViewAllPicks: VFC<ViewAllPicksProps> = () => {
	const router = useRouter();
	const [selectedWeek] = useContext(WeekContext);
	const { data, error, isValidating } = useGamesForWeek(selectedWeek);
	const {
		data: ranksData,
		error: ranksError,
		isValidating: ranksIsValidating,
	} = useWeeklyRankings(selectedWeek);
	const {
		data: picksData,
		error: picksError,
		isValidating: picksIsValidating,
	} = useViewAllPicks(selectedWeek);
	const {
		data: tiebreakerData,
		error: tiebreakerError,
		isValidating: tiebreakerIsValidating,
	} = useMyTiebreakerForWeek(selectedWeek);
	const [, setBackgroundLoading] = useContext(BackgroundLoadingContext);
	const [mode, setMode] = useState<'Live Results' | 'What If'>('Live Results');
	const [games, setGames] = useState<Record<number, GameForWeek>>({});
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [hasWhatIfBeenSet, setHasWhatIfBeenSet] = useState<boolean>(false);

	useEffect(() => {
		setBackgroundLoading(
			(!!data && isValidating) ||
				(!!ranksData && ranksIsValidating) ||
				(!!picksData && picksIsValidating) ||
				(!!tiebreakerData && tiebreakerIsValidating),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		data,
		error,
		ranksData,
		ranksIsValidating,
		picksData,
		picksIsValidating,
		tiebreakerData,
		tiebreakerIsValidating,
	]);

	const updateGames = (games: Array<GameForWeek>) => {
		const gamesMap = games.reduce((acc, game) => {
			const gameID = game.gameID;

			if (!acc[gameID]) {
				acc[gameID] = game;
			}

			return acc;
		}, {} as Record<number, GameForWeek>);

		setGames(gamesMap);
	};

	useEffect(() => {
		if (data) {
			updateGames(data.getGamesForWeek);
		}
	}, [data]);

	if (error) {
		logger.error({ text: `Error when loading week ${selectedWeek} games: `, error });
	}

	if (ranksError) {
		logger.error({
			text: 'Error when loading weekly rank data for View All Picks',
			ranksError,
		});
	}

	if (picksError) {
		logger.error({
			text: 'Error when loading all pick data for View All Picks',
			picksError,
		});
	}

	if (tiebreakerError) {
		logger.error({
			text: 'Error when loading tiebreaker data for View All Picks',
			tiebreakerError,
		});
	}

	if (
		tiebreakerData?.getMyTiebreakerForWeek &&
		!tiebreakerData.getMyTiebreakerForWeek?.tiebreakerHasSubmitted
	) {
		router.replace('/picks/set');

		return <></>;
	}

	if ((ranksData?.getWeeklyRankings.length ?? -1) === 0) {
		router.replace('/picks/view');

		return <> </>;
	}

	const saveModalChanges = (customGames: Array<GameForWeek>): void => {
		updateGames(customGames);
		setIsModalOpen(false);
		setHasWhatIfBeenSet(true);
	};

	return (
		<Authenticated isRegistered>
			<CustomHead title={`View all week ${selectedWeek} picks`} />
			<div
				className={clsx(
					'content-bg',
					'text-dark',
					'my-3',
					'mx-2',
					'pt-3',
					'col',
					'min-vh-100',
				)}
			>
				<SkeletonTheme>
					<div className="row min-vh-100">
						<div className="col-12 text-center text-md-start">
							Current Viewing Mode
							<br />
							<Dropdown as={ButtonGroup} className={clsx(styles['mode-button'])}>
								<Button
									className={clsx(
										'px-7',
										'text-nowrap',
										'flex-grow-1',
										'flex-shrink-0',
										mode === 'What If' && styles['btn-blue'],
									)}
									disabled={mode === 'Live Results'}
									onClick={() => setIsModalOpen(true)}
									variant={mode === 'Live Results' ? 'primary' : undefined}
								>
									{mode}
								</Button>
								<Dropdown.Toggle
									className={clsx(
										'flex-grow-0',
										'flex-shrink-1',
										mode === 'What If' && styles['btn-blue'],
									)}
									split
									variant={mode === 'Live Results' ? 'primary' : undefined}
								></Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item
										onClick={() => {
											setMode('What If');
											setIsModalOpen(true);
										}}
									>
										What If
									</Dropdown.Item>
									<Dropdown.Item
										onClick={() => {
											setMode('Live Results');
											setHasWhatIfBeenSet(false);

											if (data) {
												updateGames(data.getGamesForWeek);
											}
										}}
									>
										Live Results
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
						<div className="col-12">
							{mode === 'Live Results' || !hasWhatIfBeenSet ? (
								<ViewAllTable
									games={games}
									picks={picksData?.getAllPicksForWeek}
									ranks={ranksData?.getWeeklyRankings}
								/>
							) : (
								<ViewAllTable
									games={games}
									picks={picksData?.getAllPicksForWeek}
									ranks={sortPicks(
										picksData?.getAllPicksForWeek,
										games,
										ranksData?.getWeeklyRankings,
									)}
								/>
							)}
						</div>
						{mode === 'What If' && (
							<ViewAllModal
								closeModal={() => setIsModalOpen(false)}
								games={data?.getGamesForWeek ?? []}
								isOpen={isModalOpen}
								saveChanges={saveModalChanges}
							/>
						)}
					</div>
				</SkeletonTheme>
			</div>
		</Authenticated>
	);
};

ViewAllPicks.whyDidYouRender = true;

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
export default ViewAllPicks;
