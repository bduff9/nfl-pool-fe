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
import Image from 'next/image';
import React, { FC } from 'react';

import { SurvivorPick, Game, Team } from '../../generated/graphql';

import styles from './SurvivorTeam.module.scss';

type SurvivorTeamProps = {
	isHome?: boolean;
	isOnBye?: boolean;
	onClick?: () => void;
	pick?: Pick<SurvivorPick, 'survivorPickWeek'> & {
		game: Pick<Game, 'gameID'>;
		team: Pick<Team, 'teamID'>;
	};
	team: Pick<Team, 'teamID' | 'teamCity' | 'teamName' | 'teamLogo'>;
	weekInProgress: number;
};

const SurvivorTeam: FC<SurvivorTeamProps> = ({
	isHome = false,
	isOnBye = false,
	onClick,
	pick,
	team,
	weekInProgress,
}) => {
	return (
		<div
			className={clsx(
				...(pick
					? [
						styles['picked'],
						pick.survivorPickWeek < weekInProgress && styles['past-pick'],
						pick.survivorPickWeek === weekInProgress && styles['current-pick'],
						pick.survivorPickWeek > weekInProgress && styles['future-pick'],
					]
					: isOnBye
						? ['border', 'border-dark', styles['bg-game']]
						: [
							styles['not-picked'],
							styles['bg-game'],
							!isHome && 'border-start',
							'border-bottom',
							'border-end',
							'border-dark',
						]),
				'position-relative',
				'pt-2',
				'px-2',
				'text-center',
				isOnBye ? 'col-6 col-md-3 col-lg-2' : 'w-50',
				styles['game-team'],
			)}
			onClick={!pick ? onClick : undefined}
		>
			{!!pick && (
				<div
					className={clsx(
						'badge',
						'rounded-circle',
						'position-absolute',
						'top-0',
						'start-0',
						pick.survivorPickWeek < weekInProgress && styles['badge-past'],
						pick.survivorPickWeek === weekInProgress && styles['badge-current'],
						pick.survivorPickWeek > weekInProgress && styles['badge-future'],
					)}
				>
					{pick.survivorPickWeek}
				</div>
			)}
			<Image
				alt={`${team.teamCity} ${team.teamName}`}
				height={70}
				layout="intrinsic"
				src={`/NFLLogos/${team.teamLogo}`}
				title={`${team.teamCity} ${team.teamName}`}
				width={70}
			/>
			<br />
			<span className="d-none d-md-inline">
				{team.teamCity}
				<br />
			</span>
			{team.teamName}
		</div>
	);
};

SurvivorTeam.whyDidYouRender = true;

export default SurvivorTeam;
