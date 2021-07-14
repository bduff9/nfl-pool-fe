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
import { faBars } from '@bduff9/pro-solid-svg-icons/faBars';
import { faReply } from '@bduff9/pro-solid-svg-icons/faReply';
import { faTimes } from '@bduff9/pro-solid-svg-icons/faTimes';
import { faChevronLeft } from '@bduff9/pro-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@bduff9/pro-solid-svg-icons/faChevronRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, {
	ChangeEvent,
	FC,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import Accordion from 'react-bootstrap/Accordion';

import NavLink from '../NavLink/NavLink';
import MenuAccordion from '../MenuAccordion/MenuAccordion';
import { SeasonStatus } from '../../generated/graphql';
import {
	registerForSurvivor,
	unregisterForSurvivor,
	useSidebarData,
} from '../../graphql/sidebar';
import { WEEKS_IN_SEASON } from '../../utils/constants';
import { TitleContext, WeekContext } from '../../utils/context';
import { TSessionUser } from '../../utils/types';

import styles from './Sidebar.module.scss';
import SidebarLoader from './SidebarLoader';

type SidebarProps = {
	user: TSessionUser;
};

const Sidebar: FC<SidebarProps> = ({ user }) => {
	const router = useRouter();
	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const toggleMenu = useCallback((): void => {
		setOpenMenu(!openMenu);
	}, [openMenu]);
	const [title] = useContext(TitleContext);
	const [selectedWeek, setSelectedWeek] = useContext(WeekContext);
	const { data, error } = useSidebarData(user.doneRegistering, selectedWeek);
	const isLoading = user.doneRegistering && !data;
	const hasSeasonStarted = data?.currentWeek.seasonStatus !== SeasonStatus.NotStarted;
	let currentPage = '';

	if (user.doneRegistering && error) {
		console.error('Failed to load sidebar data', error);
	}

	useEffect(() => {
		if (selectedWeek < 1 || selectedWeek > WEEKS_IN_SEASON) {
			setSelectedWeek(data?.selectedWeek.weekNumber ?? 0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data?.selectedWeek.weekNumber]);

	const updateWeek = (event: ChangeEvent<HTMLSelectElement>) => {
		setSelectedWeek(parseInt(event.target.value, 10));
	};

	const goToPreviousWeek = () => {
		setSelectedWeek(week => {
			if (week > 1) {
				return --week;
			}

			return week;
		});
	};

	const goToNextWeek = () => {
		setSelectedWeek(week => {
			if (week < WEEKS_IN_SEASON) {
				return ++week;
			}

			return week;
		});
	};

	const goToCurrentWeek = useCallback((): void => {
		const currentWeek = data?.currentWeek.weekNumber;

		if (currentWeek) {
			setSelectedWeek(currentWeek);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data?.currentWeek.weekNumber]);

	if (router.pathname.startsWith('/picks')) {
		currentPage = 'Picks';
	} else if (router.pathname.startsWith('/survivor')) {
		currentPage = 'Survivor';
	} else if (router.pathname.startsWith('/users')) {
		currentPage = 'My Account';
	} else if (['/', '/weekly', '/overall'].includes(router.pathname)) {
		currentPage = 'Dashboard';
	}

	useEffect((): void => {
		setOpenMenu(false);
	}, [router.pathname]);

	return (
		<>
			<div
				className={clsx(
					'd-md-none',
					'd-print-none',
					'position-absolute',
					'text-center',
					'top-0',
					'start-0',
					'end-0',
					styles['mobile-top-bar'],
				)}
			>
				<span
					className={clsx('position-absolute', styles['mobile-menu'])}
					onClick={toggleMenu}
				>
					<FontAwesomeIcon icon={faBars} size="lg" />
				</span>
				<h1 className="m-0">{title}</h1>
			</div>
			<div
				className={clsx(
					'position-fixed',
					'top-0',
					'bottom-0',
					'start-0',
					'd-block',
					'pt-2',
					'h-100',
					'col-10',
					'col-sm-3',
					'col-lg-2',
					'd-md-block',
					!openMenu && 'd-none',
					'd-print-none',
					styles.sidebar,
				)}
			>
				{isLoading ? (
					<SidebarLoader />
				) : (
					<>
						<span className="d-md-none" onClick={toggleMenu}>
							<FontAwesomeIcon className={styles['close-menu']} icon={faTimes} />
						</span>
						{user.doneRegistering && (
							<>
								<div className={clsx('text-center', 'mb-4', 'sidebar-greeting')}>
									Welcome, {user.firstName}
								</div>
								<div
									className={clsx(
										'text-center',
										'd-flex',
										'justify-content-around',
										'sidebar-week',
									)}
								>
									<button
										className={clsx(
											'p-0',
											'm-0',
											selectedWeek === 1 && 'invisible',
											styles['btn-week-picker'],
										)}
										onClick={goToPreviousWeek}
									>
										<FontAwesomeIcon icon={faChevronLeft} />
									</button>
									<select
										className={clsx('text-center', 'px-2', styles['week-picker'])}
										onChange={updateWeek}
										value={selectedWeek}
									>
										{Array.from({ length: WEEKS_IN_SEASON }).map((_, i) => (
											<option key={`week-${i + 1}`} value={i + 1}>
												Week {i + 1}
											</option>
										))}
									</select>
									<button
										className={clsx(
											'p-0',
											'm-0',
											selectedWeek === WEEKS_IN_SEASON && 'invisible',
											styles['btn-week-picker'],
										)}
										onClick={goToNextWeek}
									>
										<FontAwesomeIcon icon={faChevronRight} />
									</button>
								</div>
								<div className={clsx('text-center', styles['current-week-link'])}>
									{data?.currentWeek.weekNumber !== selectedWeek && (
										<button
											className={styles['btn-current-week']}
											onClick={goToCurrentWeek}
										>
											<FontAwesomeIcon icon={faReply} />
											&nbsp;Go to current week
										</button>
									)}
								</div>
							</>
						)}
						{/* collapse, collapsing, show, accordion */}
						<Accordion defaultActiveKey={currentPage}>
							<MenuAccordion show={user.doneRegistering} title="Dashboard">
								<NavLink href="/" isNested>
									My Dashboard
								</NavLink>
								<NavLink
									href="/weekly"
									isNested
									show={(data?.getWeeklyRankingsTotalCount ?? 0) > 0}
								>
									Week Results
								</NavLink>
								<NavLink
									href="/overall"
									isNested
									show={(data?.getOverallRankingsTotalCount ?? 0) > 0}
								>
									Overall Results
								</NavLink>
							</MenuAccordion>
							<MenuAccordion show={user.doneRegistering} title="Picks">
								<NavLink
									href="/picks/make"
									isNested
									show={!data?.getMyTiebreakerForWeek?.tiebreakerHasSubmitted}
								>
									Make Picks
								</NavLink>
								<NavLink href="/picks/view" isNested>
									View My Picks
								</NavLink>
								<NavLink
									href="/picks/viewall"
									isNested
									show={data?.getMyTiebreakerForWeek?.tiebreakerHasSubmitted}
								>
									View All Picks
								</NavLink>
							</MenuAccordion>
							<MenuAccordion show={user.doneRegistering} title="Survivor">
								<NavLink
									isNested
									onClick={async () => {
										await registerForSurvivor();
										router.reload();
									}}
									show={!hasSeasonStarted && !user.hasSurvivor}
								>
									Register for Survivor
								</NavLink>
								<NavLink
									isNested
									onClick={async () => {
										await unregisterForSurvivor();
										router.reload();
									}}
									show={!hasSeasonStarted && user.hasSurvivor}
								>
									Drop out of Survivor
								</NavLink>
								<NavLink
									href="/survivor/set"
									isNested
									show={user.hasSurvivor && data?.isAliveInSurvivor}
								>
									Make Picks
								</NavLink>
								<NavLink
									href="/survivor/view"
									isNested
									show={
										data?.selectedWeek.weekStatus &&
										data?.selectedWeek.weekStatus !== 'NotStarted'
									}
								>
									View Picks
								</NavLink>
							</MenuAccordion>
							<NavLink href="/scoreboard" show={user.doneRegistering}>
								NFL Scoreboard
							</NavLink>
							<MenuAccordion title="My Account">
								<NavLink href="/users/create" isNested show={!user.doneRegistering}>
									Finish Registration
								</NavLink>
								<NavLink href="/users/edit" isNested show={user.doneRegistering}>
									Edit My Profile
								</NavLink>
								<NavLink href="/users/payments" isNested show={user.doneRegistering}>
									View Payments
								</NavLink>
								<NavLink href="/users/stats" isNested show={user.doneRegistering}>
									Statistics
								</NavLink>
							</MenuAccordion>
							<NavLink href="/support">Help</NavLink>
							<MenuAccordion show={user.isAdmin} title="Admin">
								<NavLink href="/admin/users" isNested>
									Manage Users
								</NavLink>
								<NavLink href="/admin/payments" isNested>
									Manage Payments
								</NavLink>
								<NavLink href="/admin/logs" isNested>
									View Logs
								</NavLink>
								<NavLink href="/admin/email" isNested>
									Email Users
								</NavLink>
								<NavLink href="/admin/api" isNested>
									View API Logs
								</NavLink>
							</MenuAccordion>
							<NavLink href="/auth/logout">Signout</NavLink>
						</Accordion>
					</>
				)}
			</div>
		</>
	);
};

Sidebar.whyDidYouRender = true;

export default Sidebar;
