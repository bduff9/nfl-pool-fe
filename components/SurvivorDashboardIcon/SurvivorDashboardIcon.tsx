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
import { faFootballHelmet } from '@bduff9/pro-duotone-svg-icons/faFootballHelmet';
import { faQuestion } from '@bduff9/pro-duotone-svg-icons/faQuestion';
import { faUsersClass } from '@bduff9/pro-duotone-svg-icons/faUsersClass';
import Image from 'next/image';
import React, { VFC } from 'react';
import clsx from 'clsx';

import { Team } from '../../generated/graphql';

import styles from './SurvivorDashboardIcon.module.scss';

type SurvivorDashboardIconProps = {
	isAlive?: boolean;
	isPlaying: boolean;
	lastPick?: Pick<Team, 'teamCity' | 'teamLogo' | 'teamName'>;
	pickForWeek?: Pick<Team, 'teamCity' | 'teamLogo' | 'teamName'>;
};

const SurvivorDashboardIcon: VFC<SurvivorDashboardIconProps> = ({
	isAlive = false,
	isPlaying,
	lastPick,
	pickForWeek,
}) => {
	if (!isPlaying) {
		return (
			<>
				<div className={clsx('mx-auto', styles.icon)}>
					<FontAwesomeIcon className="h-100 w-100" icon={faUsersClass} />
				</div>
				<h3 className="position-relative">Observer</h3>
			</>
		);
	}

	if (!isAlive) {
		if (lastPick) {
			return (
				<>
					<Image
						className={styles.dead}
						height={206}
						src={`/NFLLogos/${lastPick.teamLogo}`}
						width={206}
						layout="intrinsic"
						alt={`${lastPick.teamCity} ${lastPick.teamName}`}
						title={`${lastPick.teamCity} ${lastPick.teamName}`}
					/>
					<h3 className="mt-n4 fw-bold text-danger position-relative">You&lsquo;re Out</h3>
				</>
			);
		}

		return (
			<>
				<div className={clsx('mx-auto', styles.icon, styles.dead)}>
					<span className="fa-layers fa-fw h-100 w-100">
						<FontAwesomeIcon className="h-100 w-100" icon={faFootballHelmet} />
						<FontAwesomeIcon className="h-100 w-100 text-danger" icon={faQuestion} />
					</span>
				</div>
				<h3 className="fw-bold text-danger position-relative">You&lsquo;re Out</h3>
			</>
		);
	}

	if (!pickForWeek) {
		return (
			<>
				<div className={clsx('mx-auto', styles.icon)}>
					<span className="fa-layers fa-fw h-100 w-100">
						<FontAwesomeIcon className="h-100 w-100" icon={faFootballHelmet} />
						<FontAwesomeIcon className="h-100 w-100 text-danger" icon={faQuestion} />
					</span>
				</div>
				<h3 className="fw-bold text-danger position-relative">No Pick Made</h3>
			</>
		);
	}

	return (
		<>
			<Image
				height={206}
				src={`/NFLLogos/${pickForWeek.teamLogo}`}
				width={206}
				layout="intrinsic"
				alt={`${pickForWeek.teamCity} ${pickForWeek.teamName}`}
				title={`${pickForWeek.teamCity} ${pickForWeek.teamName}`}
			/>
			<h3 className="mt-n4 fw-bold text-success position-relative">Still Alive</h3>
		</>
	);
};

SurvivorDashboardIcon.whyDidYouRender = true;

export default SurvivorDashboardIcon;
