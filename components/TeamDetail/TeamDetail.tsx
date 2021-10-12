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
import { faTimesCircle } from '@bduff9/pro-duotone-svg-icons/faTimesCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import React, { VFC, useContext, useEffect } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { DetailTeam, useTeamDetails } from '../../graphql/teamDetail';
import { BackgroundLoadingContext } from '../../utils/context';
import { logger } from '../../utils/logging';

import styles from './TeamDetail.module.scss';

type TeamBlockProps = {
	onClose?: () => void;
	spread?: null | number;
	team?: DetailTeam;
};

const TeamBlock: VFC<TeamBlockProps> = ({ onClose, spread, team }) => (
	<div className={clsx('col-6')}>
		<div
			className={clsx(
				'position-relative',
				'border',
				'border-dark',
				'rounded',
				'p-3',
				styles['team-wrapper'],
			)}
		>
			{onClose && (
				<FontAwesomeIcon
					className="position-absolute top-0 end-0 mt-1 me-1 d-inline-block d-md-none text-danger"
					icon={faTimesCircle}
					onClick={onClose}
				/>
			)}
			<h4 className="text-center">
				{team ? (
					<u
						style={{
							color: team.teamPrimaryColor,
							textDecorationColor: team.teamSecondaryColor,
						}}
					>
						{team.teamCity} {team.teamName}
					</u>
				) : (
					<Skeleton width={250} />
				)}
			</h4>
			<div className="row">
				<div className="col-12 col-md-6 text-start">Record:</div>
				<div className="col-12 col-md-6 text-start text-md-end">
					{team ? team.teamRecord : <Skeleton width={45} />}
				</div>
			</div>
			<div className="row">
				<div className="col-12 col-md-6 text-start">Division:</div>
				<div className="col-12 col-md-6 text-start text-md-end">
					{team ? `${team.teamConference} ${team.teamDivision}` : <Skeleton width={76} />}
				</div>
			</div>
			{spread && (
				<div className="row">
					<div className="col-12 col-md-6 text-start">Spread:</div>
					<div className="col-12 col-md-6 text-start text-md-end">{spread}</div>
				</div>
			)}
			<h5 className="mt-2 text-center">Rankings</h5>
			<div className="row">
				<div className="col-12 col-md-6 text-start">Rushing Offense:</div>
				<div className="col-12 col-md-6 text-start text-md-end">
					{team ? team.teamRushOffenseRank : <Skeleton width={18} />}
				</div>
			</div>
			<div className="row">
				<div className="col-12 col-md-6 text-start">Passing Offense:</div>
				<div className="col-12 col-md-6 text-start text-md-end">
					{team ? team.teamPassOffenseRank : <Skeleton width={18} />}
				</div>
			</div>
			<div className="row">
				<div className="col-12 col-md-6 text-start">Rushing Defense:</div>
				<div className="col-12 col-md-6 text-start text-md-end">
					{team ? team.teamRushDefenseRank : <Skeleton width={18} />}
				</div>
			</div>
			<div className="row">
				<div className="col-12 col-md-6 text-start">Passing Defense:</div>
				<div className="col-12 col-md-6 text-start text-md-end">
					{team ? team.teamPassDefenseRank : <Skeleton width={18} />}
				</div>
			</div>
			{(team?.teamHistory?.length ?? 0) > 0 && (
				<h5 className="mt-2 text-center">History</h5>
			)}
			{team?.teamHistory.map(game => {
				const won = game.winnerTeam?.teamID === team.teamID;
				const isHome = game.homeTeam.teamID === team.teamID;
				const lost = isHome
					? game.winnerTeam?.teamID === game.visitorTeam.teamID
					: game.winnerTeam?.teamID === game.homeTeam.teamID;

				return (
					<div className="row" key={`history-for-game-${game.gameID}`}>
						<div className="col-12 col-md-6 text-start">
							Wk {game.gameWeek} {isHome ? 'vs' : '@'}{' '}
							{isHome ? game.visitorTeam.teamShortName : game.homeTeam.teamShortName}
						</div>
						<div
							className={clsx(
								'col-12',
								'col-md-6',
								'text-start',
								'text-md-end',
								won && 'text-success',
								lost && 'text-danger',
							)}
						>
							{won ? 'W' : lost ? 'L' : 'T'} (
							{isHome ? game.gameHomeScore : game.gameVisitorScore}-
							{isHome ? game.gameVisitorScore : game.gameHomeScore})
						</div>
					</div>
				);
			})}
		</div>
	</div>
);

type TeamDetailProps = {
	gameID: number;
	onClose?: () => void;
};

const TeamDetail: VFC<TeamDetailProps> = ({ gameID, onClose }) => {
	const { data, error, isValidating } = useTeamDetails(gameID);
	const [, setBackgroundLoading] = useContext(BackgroundLoadingContext);

	useEffect(() => {
		setBackgroundLoading(!!data && isValidating);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isValidating]);

	if (error) {
		logger.error({
			text: `Error when loading data for Team Details component game ${gameID}: `,
			error,
		});
	}

	return (
		<SkeletonTheme>
			<div className="row">
				<TeamBlock
					onClose={onClose}
					spread={data?.getGame.gameVisitorSpread}
					team={data?.getGame.visitorTeam}
				/>
				<TeamBlock
					onClose={onClose}
					spread={data?.getGame.gameHomeSpread}
					team={data?.getGame.homeTeam}
				/>
			</div>
		</SkeletonTheme>
	);
};

TeamDetail.whyDidYouRender = true;

export default TeamDetail;
