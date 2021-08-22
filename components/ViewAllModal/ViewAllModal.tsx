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
import { faAt } from '@bduff9/pro-duotone-svg-icons/faAt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';

import { Game, Team } from '../../generated/graphql';
import { getAbbreviation } from '../../utils/strings';

import styles from './ViewAllModal.module.scss';

type ViewAllModalProps = {
	closeModal: () => void;
	games: Array<
		Pick<Game, 'gameID'> & {
			homeTeam: Pick<Team, 'teamID' | 'teamCity' | 'teamName' | 'teamLogo'>;
			visitorTeam: Pick<Team, 'teamID' | 'teamCity' | 'teamName' | 'teamLogo'>;
			winnerTeam: Pick<Team, 'teamID'> | null;
		}
	>;
	isOpen?: boolean;
	saveChanges: (
		games: Array<
			Pick<Game, 'gameID'> & {
				homeTeam: Pick<Team, 'teamID' | 'teamCity' | 'teamName' | 'teamLogo'>;
				visitorTeam: Pick<Team, 'teamID' | 'teamCity' | 'teamName' | 'teamLogo'>;
				winnerTeam: Pick<Team, 'teamID'> | null;
			}
		>,
	) => void;
};

const ViewAllModal: FC<ViewAllModalProps> = ({
	closeModal,
	games,
	isOpen = false,
	saveChanges,
}) => {
	const [customGames, setCustomGames] = useState<
		Array<
			Pick<Game, 'gameID'> & {
				homeTeam: Pick<Team, 'teamID' | 'teamCity' | 'teamName' | 'teamLogo'>;
				visitorTeam: Pick<Team, 'teamID' | 'teamCity' | 'teamName' | 'teamLogo'>;
				winnerTeam: Pick<Team, 'teamID'> | null;
			}
		>
	>([]);

	useEffect(() => {
		if (customGames.length === 0) {
			setCustomGames(games);
		}
	}, [customGames, games]);

	const selectWinner = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		gameID: number,
		teamID: number,
	): void => {
		event.stopPropagation();

		const newCustomGames = customGames.map(game => {
			if (game.gameID !== gameID) return game;

			return { ...game, winnerTeam: { teamID } };
		});

		setCustomGames(newCustomGames);
	};

	return (
		<>
			<div
				aria-describedby="whatIfModalBody"
				aria-hidden={isOpen}
				aria-labelledby="whatIfModalLabel"
				aria-modal="true"
				className={clsx('modal', 'fade', isOpen && 'd-block show')}
				onClick={closeModal}
				role="dialog"
				tabIndex={-1}
			>
				<div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
					<div className="modal-content">
						<div className={clsx('modal-header', 'text-center', styles['modal-header'])}>
							<div className="modal-title" id="whatIfModalLabel">
								<h5 className="d-none d-md-block">What If Version</h5>
								Click a team logo to view the updated ranks in a &ldquo;What If&rdquo;
								version if that team were to win.
							</div>
							<button
								aria-label="Close"
								className="btn-close"
								onClick={closeModal}
								type="button"
							></button>
						</div>
						<div className="modal-body" id="whatIfModalBody">
							{customGames.map(game => (
								<div
									className="d-flex justify-content-around align-items-center text-center"
									key={`what-if-for-game-${game.gameID}`}
								>
									<div className={clsx('col-5')}>
										<div
											className={clsx(
												'rounded-circle',
												styles['what-if'],
												...(game.winnerTeam?.teamID === game.visitorTeam.teamID
													? ['cursor-default', styles.winner]
													: ['cursor-pointer']),
											)}
											onClick={event =>
												selectWinner(event, game.gameID, game.visitorTeam.teamID)
											}
										>
											<Image
												alt={`${game.visitorTeam.teamCity} ${game.visitorTeam.teamName}`}
												height={50}
												layout="fixed"
												src={`/NFLLogos/${game.visitorTeam.teamLogo}`}
												title={`${game.visitorTeam.teamCity} ${game.visitorTeam.teamName}`}
												width={50}
											/>
											{game.visitorTeam.teamName.includes(' ') ? (
												<div style={{ marginTop: '-.5rem' }}>
													{getAbbreviation(game.visitorTeam.teamName)}
												</div>
											) : (
												<div style={{ marginTop: '-1rem' }}>
													{game.visitorTeam.teamName}
												</div>
											)}
										</div>
									</div>
									<div className="col-2">
										<FontAwesomeIcon icon={faAt} />
									</div>
									<div className={clsx('col-5')}>
										<div
											className={clsx(
												'rounded-circle',
												styles['what-if'],
												...(game.winnerTeam?.teamID === game.homeTeam.teamID
													? ['cursor-default', styles.winner]
													: ['cursor-pointer']),
											)}
											onClick={event =>
												selectWinner(event, game.gameID, game.homeTeam.teamID)
											}
										>
											<Image
												alt={`${game.homeTeam.teamCity} ${game.homeTeam.teamName}`}
												height={50}
												layout="fixed"
												src={`/NFLLogos/${game.homeTeam.teamLogo}`}
												title={`${game.homeTeam.teamCity} ${game.homeTeam.teamName}`}
												width={50}
											/>
											{game.homeTeam.teamName.includes(' ') ? (
												<div style={{ marginTop: '-.5rem' }}>
													{getAbbreviation(game.homeTeam.teamName)}
												</div>
											) : (
												<div style={{ marginTop: '-1rem' }}>{game.homeTeam.teamName}</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
						<div className="modal-footer">
							<button className="btn btn-secondary" onClick={closeModal} type="button">
								Cancel
							</button>
							<button
								className="btn btn-primary"
								onClick={() => saveChanges(customGames)}
								type="button"
							>
								Save changes
							</button>
						</div>
					</div>
				</div>
			</div>
			{isOpen && <div className={clsx('modal-backdrop', 'fade', 'show')}></div>}
		</>
	);
};

ViewAllModal.whyDidYouRender = true;

export default ViewAllModal;
