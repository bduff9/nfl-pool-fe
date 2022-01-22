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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@bduff9/pro-duotone-svg-icons/faRedo';
import { faUserRobot } from '@bduff9/pro-duotone-svg-icons/faUserRobot';
import { faSave } from '@bduff9/pro-duotone-svg-icons/faSave';
import { faCloudUpload } from '@bduff9/pro-duotone-svg-icons/faCloudUpload';
import clsx from 'clsx';
import { ClientError } from 'graphql-request';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, {
	VFC,
	FocusEventHandler,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import type { DropResult, DragStart } from 'react-beautiful-dnd';
import Dropdown from 'react-bootstrap/Dropdown';
import { SkeletonTheme } from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';

import Authenticated from '../../components/Authenticated/Authenticated';
import CustomHead from '../../components/CustomHead/CustomHead';
import {
	autoPickMyPicks,
	resetMyPicksForWeek,
	setMyPick,
	submitMyPicks,
	updateMyTiebreakerScore,
	useMyTiebreakerForWeek,
	validateMyPicks,
} from '../../graphql/picksSet';
import { useViewMyPicks } from '../../graphql/picksView';
import { TUser } from '../../models/User';
import {
	isSignedInSSR,
	UNAUTHENTICATED_REDIRECT,
	isDoneRegisteringSSR,
	IS_NOT_DONE_REGISTERING_REDIRECT,
} from '../../utils/auth.server';
import { BackgroundLoadingContext, WeekContext } from '../../utils/context';
import { parseDragData } from '../../utils/strings';
import { AutoPickStrategy } from '../../generated/graphql';
import styles from '../../styles/picks/set.module.scss';
import TeamDetail from '../../components/TeamDetail/TeamDetail';
import { useWarningOnExit } from '../../utils/hooks';
import PickGameLoader from '../../components/PickGame/PickGameLoader';
import PickGame, { PointBankLoader, Point } from '../../components/PickGame/PickGame';
import { ErrorIcon, SuccessIcon } from '../../components/ToastUtils/ToastIcons';
import { logger } from '../../utils/logging';

const ConfirmationModal = dynamic(
	() => import('../../components/ConfirmationModal/ConfirmationModal'),
	{ ssr: false },
);

export type LoadingType = 'autopick' | 'reset' | 'save' | 'submit';

type MakePicksProps = {
	user: TUser;
};

const MakePicks: VFC<MakePicksProps> = () => {
	const router = useRouter();
	const [selectedWeek] = useContext(WeekContext);
	const {
		data: picksData,
		error: picksError,
		isValidating: picksIsValidating,
		mutate: picksMutate,
	} = useViewMyPicks(selectedWeek);
	const {
		data: tiebreakerData,
		error: tiebreakerError,
		isValidating: tiebreakerIsValidating,
		mutate: tiebreakerMutate,
	} = useMyTiebreakerForWeek(selectedWeek);
	const [, setBackgroundLoading] = useContext(BackgroundLoadingContext);
	const [selectedGame, setSelectedGame] = useState<null | number>(null);
	const [dragGameID, setDragGameID] = useState<null | string>(null);
	const [tiebreakerLastScoreError, setTiebreakerLastScoreError] = useState<null | string>(
		null,
	);
	const [picksUpdating, setPicksUpdating] = useState<boolean>(false);
	const [loading, setLoading] = useState<LoadingType | null>(null);
	const [callback, setCallback] = useState<{
		acceptButton: string;
		body: string | JSX.Element;
		onAccept: () => Promise<void>;
		title: string;
	} | null>(null);
	const lastGame =
		picksData?.getMyPicksForWeek[picksData.getMyPicksForWeek.length - 1].game;

	useEffect(() => {
		setBackgroundLoading(
			(!!picksData && picksIsValidating) || (!!tiebreakerData && tiebreakerIsValidating),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [picksData, picksIsValidating, tiebreakerData, tiebreakerIsValidating]);

	useWarningOnExit(
		picksUpdating,
		'Are you sure you want to leave?  You have unsaved changes that will be lost',
	);

	const onDragEnd = useCallback(
		async (result: DropResult): Promise<void> => {
			const { draggableId, source, destination } = result;

			setDragGameID(null);

			if (!destination) {
				return;
			}

			if (source.droppableId === destination.droppableId) {
				return;
			}

			const [points, sourceData, destinationData] = parseDragData(
				draggableId,
				source.droppableId,
				destination?.droppableId,
			);
			const gameID = destinationData?.gameID ?? null;
			const pick = picksData?.getMyPicksForWeek.find(pick => pick.game.gameID === gameID);
			const teamID =
				destinationData?.type === 'home'
					? pick?.game.homeTeam.teamID ?? null
					: destinationData?.type === 'visitor'
						? pick?.game.visitorTeam.teamID ?? null
						: null;

			try {
				setPicksUpdating(true);
				picksMutate(data => {
					if (!data) return data;

					const getMyPicksForWeek = data.getMyPicksForWeek.map(pick => {
						if (new Date(pick.game.gameKickoff) < new Date()) {
							return pick;
						}

						if (gameID === pick.game.gameID) {
							const team =
								pick.game.homeTeam.teamID === teamID
									? pick.game.homeTeam
									: pick.game.visitorTeam;

							return {
								...pick,
								pickPoints: points,
								team,
							};
						}

						if (points === pick.pickPoints) {
							return {
								...pick,
								pickPoints: null,
								team: null,
							};
						}

						return pick;
					});

					return { ...data, getMyPicksForWeek };
				}, false);
				await setMyPick(selectedWeek, gameID, teamID, points);
			} catch (error) {
				logger.error({
					text: 'Error setting user pick',
					destinationData,
					error,
					points,
					sourceData,
					teamID,
				});

				if (error instanceof ClientError) {
					error.response.errors?.forEach(error => {
						toast.error(error.message, {
							icon: ErrorIcon,
						});
					});
				} else {
					toast.error('Something went wrong, please try again', {
						icon: ErrorIcon,
					});
				}
			} finally {
				await picksMutate();
				setPicksUpdating(false);
			}
		},
		[picksData?.getMyPicksForWeek, picksMutate, selectedWeek],
	);

	const onDragStart = useCallback((initial: DragStart): void => {
		const {
			source: { droppableId },
		} = initial;

		setDragGameID(droppableId.replace('home-', '').replace('visitor-', ''));
	}, []);

	if (picksError) {
		logger.error({ text: 'Error when loading pick data for Make Picks', picksError });
	}

	if (tiebreakerData?.getMyTiebreakerForWeek?.tiebreakerHasSubmitted) {
		router.replace('/picks/view');

		return <></>;
	}

	if (tiebreakerError) {
		logger.error({
			text: 'Error when loading tiebreaker data for Make Picks',
			tiebreakerError,
		});
	}

	const used = (picksData?.getMyPicksForWeek ?? [])
		.map((pick): number => (pick.pickPoints && pick.team ? pick.pickPoints : 0))
		.filter(point => point > 0);
	const unavailable = (picksData?.getMyPicksForWeek ?? [])
		.map((pick): number => {
			const kickoff = new Date(pick.game.gameKickoff);
			const now = new Date();

			if (!pick.team && now.getTime() > kickoff.getTime()) {
				return pick.pickPoints ?? 0;
			}

			return 0;
		})
		.filter(point => point > 0);
	const allUsed = used.concat(unavailable);
	const available: Array<number> = [];

	if (picksData) {
		for (let i = 1; i <= picksData.getMyPicksForWeek.length; i++) {
			if (!allUsed.includes(i)) available.push(i);
		}
	}

	const updateTiebreakerScore: FocusEventHandler<HTMLInputElement> = async event => {
		const tiebreakerLastScore = +event.currentTarget.value;

		if (Number.isNaN(tiebreakerLastScore)) {
			setTiebreakerLastScoreError('Please enter a valid number');

			return;
		}

		if (tiebreakerLastScore < 1) {
			setTiebreakerLastScoreError('Tiebreaker score must be greater than 0');

			return;
		}

		setTiebreakerLastScoreError(null);

		try {
			setPicksUpdating(true);
			tiebreakerMutate(data => {
				if (!data?.getMyTiebreakerForWeek) return data;

				const getMyTiebreakerForWeek = {
					...data.getMyTiebreakerForWeek,
					tiebreakerLastScore,
				};

				return { getMyTiebreakerForWeek };
			}, false);
			await updateMyTiebreakerScore(selectedWeek, tiebreakerLastScore);
		} catch (error) {
			logger.error({
				text: 'Error updating tiebreakerLastScore',
				error,
				selectedWeek,
				tiebreakerLastScore,
			});

			if (error instanceof ClientError) {
				error.response.errors?.forEach(error => {
					toast.error(error.message, {
						icon: ErrorIcon,
					});
				});
			} else {
				toast.error('Something went wrong, please try again', {
					icon: ErrorIcon,
				});
			}
		} finally {
			await tiebreakerMutate();
			setPicksUpdating(false);
		}
	};

	const resetPicks = async (): Promise<void> => {
		try {
			setLoading('reset');
			setPicksUpdating(true);
			picksMutate(data => {
				if (!data) return data;

				const getMyPicksForWeek = data.getMyPicksForWeek.map(pick => {
					if (new Date(pick.game.gameKickoff) > new Date()) {
						return {
							...pick,
							pickPoints: null,
							team: null,
						};
					}

					return pick;
				});

				return { ...data, getMyPicksForWeek };
			}, false);

			await toast.promise(resetMyPicksForWeek(selectedWeek), {
				error: {
					icon: ErrorIcon,
					render ({ data }) {
						logger.debug({ text: '~~~~~~~ERROR DATA: ', data });

						if (data instanceof ClientError) {
							//TODO: toast all errors, not just first
							return data.response.errors?.[0]?.message;
						}

						return 'Something went wrong, please try again';
					},
				},
				pending: 'Resetting...',
				success: {
					icon: SuccessIcon,
					render () {
						return `Successfully reset your picks for week ${selectedWeek}`;
					},
				},
			});
		} catch (error) {
			logger.error({ text: 'Error resetting user picks', error, selectedWeek });
		} finally {
			setPicksUpdating(false);
			setLoading(null);
			setCallback(null);
			await picksMutate();
		}
	};

	const autoPick = async (type: AutoPickStrategy): Promise<void> => {
		try {
			setLoading('autopick');
			setPicksUpdating(true);

			await toast.promise(autoPickMyPicks(selectedWeek, type), {
				error: {
					icon: ErrorIcon,
					render ({ data }) {
						logger.debug({ text: '~~~~~~~ERROR DATA: ', data });

						if (data instanceof ClientError) {
							//TODO: toast all errors, not just first
							return data.response.errors?.[0]?.message;
						}

						return 'Something went wrong, please try again';
					},
				},
				pending: 'Auto picking...',
				success: {
					icon: SuccessIcon,
					render () {
						return `Successfully auto picked your picks for week ${selectedWeek}`;
					},
				},
			});
		} catch (error) {
			logger.error({ text: 'Error auto picking user picks', error, selectedWeek });
		} finally {
			setPicksUpdating(false);
			await picksMutate();
			setLoading(null);
		}
	};

	const savePicks = async (): Promise<void> => {
		try {
			setLoading('save');
			setPicksUpdating(true);

			await toast.promise(
				validateMyPicks(
					selectedWeek,
					available,
					tiebreakerData?.getMyTiebreakerForWeek?.tiebreakerLastScore ?? 0,
				),
				{
					error: {
						icon: ErrorIcon,
						render ({ data }) {
							logger.debug({ text: '~~~~~~~ERROR DATA: ', data });

							if (data instanceof ClientError) {
								//TODO: toast all errors, not just first
								return data.response.errors?.[0]?.message;
							}

							return 'Something went wrong, please try again';
						},
					},
					pending: 'Saving...',
					success: {
						icon: SuccessIcon,
						render () {
							return (
								<>
									<div className="mb-3">
										Successfully saved your picks for week {selectedWeek}!
									</div>
									<div>
										Please note that you will still need to submit your picks when ready as
										they are only saved, not submitted.
									</div>
								</>
							);
						},
					},
				},
			);
		} catch (error) {
			logger.error({ text: 'Error saving user picks', error, selectedWeek });
		} finally {
			setPicksUpdating(false);
			setLoading(null);
			await picksMutate();
		}
	};

	const submitPicks = async (): Promise<void> => {
		try {
			setLoading('submit');
			setPicksUpdating(true);

			if (!picksData || !tiebreakerData) {
				toast.error('No pick data found, please try again later', { icon: ErrorIcon });

				return;
			}

			if (available.length > 0) {
				toast.error('Missing point value found! Please use all points before submitting', {
					icon: ErrorIcon,
				});

				return;
			}

			const lastGameHasStarted = new Date(lastGame?.gameKickoff) < new Date();

			if (
				(tiebreakerData.getMyTiebreakerForWeek?.tiebreakerLastScore ?? 0) < 1 &&
				!lastGameHasStarted
			) {
				toast.error('Tiebreaker last score must be greater than zero', {
					icon: ErrorIcon,
				});

				return;
			}

			await toast.promise(submitMyPicks(selectedWeek), {
				error: {
					icon: ErrorIcon,
					render ({ data }) {
						logger.debug({ text: '~~~~~~~ERROR DATA: ', data });

						if (data instanceof ClientError) {
							//TODO: toast all errors, not just first
							return data.response.errors?.[0]?.message ?? data.message;
						}

						return 'Something went wrong, please try again';
					},
				},
				pending: 'Submitting...',
				success: {
					icon: SuccessIcon,
					render () {
						return `Successfully submitted your picks for week ${selectedWeek}`;
					},
				},
			});

			setPicksUpdating(false);
			await tiebreakerMutate();
		} catch (error) {
			logger.error({ text: 'Error submitting user picks', error, selectedWeek });

			await tiebreakerMutate();
		} finally {
			setPicksUpdating(false);
			setLoading(null);
			setCallback(null);
		}
	};

	return (
		<Authenticated isRegistered>
			<CustomHead title={`Make week ${selectedWeek} picks`} />
			<div
				className={clsx(
					'content-bg',
					'text-dark',
					'my-3',
					'mx-2',
					'pt-3',
					'col',
					'min-vh-100',
					styles['toolbar-placeholder'],
				)}
			>
				<SkeletonTheme>
					<div className="row min-vh-100">
						<h4 className="col-12 mb-3 text-center flex-shrink-1">
							Drag points to your chosen winning team or click a team to see the game
							details
						</h4>
						<DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
							<Droppable droppableId="pointBank" direction="horizontal">
								{(provided, snapshot) => (
									<div
										className={clsx(
											'col-12',
											'd-flex',
											'flex-wrap',
											'justify-content-start',
											'align-items-center',
											'p-3',
											'mb-3',
											'sticky-top',
											styles['point-bank'],
											snapshot.isDraggingOver && styles['dragging-over'],
										)}
										ref={provided.innerRef}
									>
										{!picksData ? (
											<PointBankLoader />
										) : (
											available.map((point, index) => (
												<Point
													index={index}
													isDragDisabled={loading !== null}
													key={`point-${point}`}
													maxValue={picksData.getMyPicksForWeek.length}
													value={point}
												/>
											))
										)}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
							<div className="col-12 mb-3">
								{!picksData ? (
									<PickGameLoader />
								) : (
									picksData.getMyPicksForWeek.map(pick => (
										<>
											<PickGame
												dragGameID={dragGameID}
												gameCount={picksData.getMyPicksForWeek.length}
												isBackgrounded={!!selectedGame && pick.game.gameID !== selectedGame}
												isSelected={pick.game.gameID === selectedGame}
												key={`pick-id-${pick.pickID}`}
												loading={loading}
												onClick={() =>
													setSelectedGame(gameID =>
														gameID === pick.game.gameID ? null : pick.game.gameID,
													)
												}
												pick={pick}
											/>
											{pick.game.gameID === selectedGame && (
												<TeamDetail
													gameID={selectedGame}
													onClose={() => setSelectedGame(null)}
												/>
											)}
										</>
									))
								)}
							</div>
						</DragDropContext>
						{tiebreakerData && (
							<div className="col-12 mb-3 px-md-5">
								<label className="form-label required" htmlFor="tiebreakerScore">
									Tiebreaker Score
									{lastGame &&
										` for ${lastGame.visitorTeam.teamName} @ ${lastGame.homeTeam.teamName} game`}
								</label>
								<input
									aria-label="Last score of week for tiebreaker"
									className="form-control"
									defaultValue={
										tiebreakerData.getMyTiebreakerForWeek?.tiebreakerLastScore ?? 0
									}
									id="tiebreakerScore"
									min="1"
									name="tiebreakerLastScore"
									onBlur={updateTiebreakerScore}
									pattern="[0-9]*"
									placeholder={`Guess the total final score${
										lastGame
											? ` of the ${lastGame.visitorTeam.teamName} @ ${lastGame.homeTeam.teamName} game`
											: ''
									}`}
									required
									type="text"
								/>
								{tiebreakerLastScoreError && (
									<div className="text-danger fs-6">{tiebreakerLastScoreError}</div>
								)}
							</div>
						)}
					</div>
					{callback && (
						<ConfirmationModal {...callback} onCancel={() => setCallback(null)} />
					)}
					<div
						className={clsx(
							'position-fixed',
							'd-flex',
							'justify-content-around',
							'align-content-center',
							'bottom-0',
							'end-0',
							'col-12',
							'col-sm-9',
							'col-lg-10',
							styles.toolbar,
						)}
					>
						<div className="col-3 px-1 px-md-2">
							<button
								className="btn btn-danger w-100 my-3"
								disabled={loading !== null || picksUpdating}
								type="button"
								onClick={() => {
									setCallback({
										acceptButton: 'Reset',
										body: (
											<>
												<div className="mb-3">
													Are you sure you want to reset all your picks?
												</div>
												<small>
													Note: Any games that have already started will not be affected.
													Only games that have not kicked off yet will be reset.
												</small>
											</>
										),
										onAccept: resetPicks,
										title: 'Are you sure you want to reset?',
									});
								}}
							>
								<div className="d-block d-md-none">
									<FontAwesomeIcon icon={faRedo} />
								</div>
								{loading === 'reset' ? (
									<>
										<span
											className="spinner-grow spinner-grow-sm d-none d-md-inline-block"
											role="status"
											aria-hidden="true"
										></span>
										Resetting...
									</>
								) : (
									'Reset'
								)}
							</button>
						</div>
						{/* Classes needed: dropdown dropdown-toggle dropdown-menu dropdown-item */}
						<div className="col-3 px-1 px-md-2">
							<Dropdown>
								<Dropdown.Toggle
									className="text-nowrap w-100 my-3"
									disabled={loading !== null || picksUpdating}
									id="auto-pick-button"
									variant="secondary"
								>
									<div className="d-block d-md-none">
										<FontAwesomeIcon
											className="d-inline-block d-md-none"
											icon={faUserRobot}
										/>
									</div>
									{loading === 'autopick' ? (
										<>
											<span
												className="spinner-grow spinner-grow-sm d-none d-md-inline-block"
												role="status"
												aria-hidden="true"
											></span>
											Picking...
										</>
									) : (
										'Auto Pick'
									)}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item onClick={() => autoPick(AutoPickStrategy.Away)}>
										Away
									</Dropdown.Item>
									<Dropdown.Item onClick={() => autoPick(AutoPickStrategy.Home)}>
										Home
									</Dropdown.Item>
									<Dropdown.Item onClick={() => autoPick(AutoPickStrategy.Random)}>
										Random
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
						<div className="col-3 px-1 px-md-2">
							<button
								className="btn btn-primary w-100 my-3"
								disabled={loading !== null || picksUpdating}
								type="button"
								onClick={savePicks}
							>
								<div className="d-block d-md-none">
									<FontAwesomeIcon className="d-inline-block d-md-none" icon={faSave} />
								</div>
								{loading === 'save' ? (
									<>
										<span
											className="spinner-grow spinner-grow-sm d-none d-md-inline-block"
											role="status"
											aria-hidden="true"
										></span>
										Saving...
									</>
								) : (
									'Save'
								)}
							</button>
						</div>
						<div className="col-3 px-1 px-md-2">
							<button
								className="btn btn-success w-100 my-3"
								disabled={loading !== null || picksUpdating}
								type="button"
								onClick={() =>
									setCallback({
										acceptButton: 'Submit',
										body: (
											<>
												<div className="mb-3">Are you sure you are ready to submit?</div>
												<small>
													Note: You will be unable to make any more changes to this
													week&apos;s picks once submitted and this cannot be undone.
												</small>
											</>
										),
										onAccept: submitPicks,
										title: 'Are you ready to submit?',
									})
								}
							>
								<div className="d-block d-md-none">
									<FontAwesomeIcon
										className="d-inline-block d-md-none"
										icon={faCloudUpload}
									/>
								</div>
								{loading === 'submit' ? (
									<>
										<span
											className="spinner-grow spinner-grow-sm d-none d-md-inline-block"
											role="status"
											aria-hidden="true"
										></span>
										Submitting...
									</>
								) : (
									'Submit'
								)}
							</button>
						</div>
					</div>
					{loading !== null && (
						<div className="position-absolute top-50 start-50 translate-middle text-center">
							<div
								className={clsx('spinner-border', 'text-primary', styles.spinner)}
								role="status"
							>
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					)}
				</SkeletonTheme>
			</div>
		</Authenticated>
	);
};

MakePicks.whyDidYouRender = true;

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
export default MakePicks;
