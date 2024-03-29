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
	VFC,
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
	useCurrentWeek,
	useSelectedWeek,
} from '../../graphql/sidebar';
import { WEEKS_IN_SEASON } from '../../utils/constants';
import { BackgroundLoadingContext, TitleContext, WeekContext } from '../../utils/context';
import { TSessionUser } from '../../utils/types';
import { useMyTiebreakerForWeek } from '../../graphql/picksSet';
import { useWeeklyCounts } from '../../graphql/weeklyDashboard';
import { useOverallCounts } from '../../graphql/overallDashboard';
import { useSurvivorIsAlive } from '../../graphql/survivorDashboard';
import { logger } from '../../utils/logging';

import styles from './Sidebar.module.scss';
import SidebarLoader from './SidebarLoader';

type SidebarProps = {
	user: TSessionUser;
};

const Sidebar: VFC<SidebarProps> = ({ user }) => {
	const router = useRouter();
	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const toggleMenu = useCallback((): void => {
		setOpenMenu(!openMenu);
	}, [openMenu]);
	const [title] = useContext(TitleContext);
	const [selectedWeek, setSelectedWeek] = useContext(WeekContext);
	const { data, error, isValidating } = useSurvivorIsAlive();
	const {
		data: tiebreakerData,
		error: tiebreakerError,
		isValidating: tiebreakerIsValidating,
	} = useMyTiebreakerForWeek(selectedWeek);
	const {
		data: currentWeekData,
		error: currentWeekError,
		isValidating: currentWeekIsValidating,
	} = useCurrentWeek();
	const {
		data: selectedWeekData,
		error: selectedWeekError,
		isValidating: selectedWeekIsValidating,
	} = useSelectedWeek(selectedWeek);
	const {
		data: weeklyCountData,
		error: weeklyCountError,
		isValidating: weeklyCountIsValidating,
	} = useWeeklyCounts(selectedWeek);
	const {
		data: overallCountData,
		error: overallCountError,
		isValidating: overallCountIsValidating,
	} = useOverallCounts();
	const [, setBackgroundLoading] = useContext(BackgroundLoadingContext);
	const isLoading = user.doneRegistering && !data;
	const hasSeasonStarted =
		currentWeekData?.getWeek.seasonStatus !== SeasonStatus.NotStarted;
	let currentPage = '';

	useEffect(() => {
		setBackgroundLoading(
			(!!data && isValidating) ||
				(!!tiebreakerData && tiebreakerIsValidating) ||
				(!!currentWeekData && currentWeekIsValidating) ||
				(!!selectedWeekData && selectedWeekIsValidating) ||
				(!!weeklyCountData && weeklyCountIsValidating) ||
				(!!overallCountData && overallCountIsValidating),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		data,
		isValidating,
		tiebreakerData,
		tiebreakerIsValidating,
		currentWeekData,
		currentWeekIsValidating,
		selectedWeekData,
		selectedWeekIsValidating,
		weeklyCountData,
		weeklyCountIsValidating,
		overallCountData,
		overallCountIsValidating,
	]);

	if (user.doneRegistering && error) {
		logger.error({ text: 'Failed to load survivor is alive: ', error });
	}

	if (tiebreakerError) {
		logger.error({ text: 'Failed to load my tiebreaker data for week: ', error });
	}

	if (currentWeekError) {
		logger.error({ text: 'Error when loading current week: ', currentWeekError });
	}

	if (selectedWeekError) {
		logger.error({
			text: `Error when loading selected week ${selectedWeek}: `,
			selectedWeekError,
		});
	}

	if (weeklyCountError) {
		logger.error({
			text: `Error when loading weekly counts ${selectedWeek}: `,
			weeklyCountError,
		});
	}

	if (overallCountError) {
		logger.error({ text: 'Error when loading overall counts: ', overallCountError });
	}

	useEffect(() => {
		if (selectedWeek < 1 || selectedWeek > WEEKS_IN_SEASON) {
			setSelectedWeek(selectedWeekData?.getWeek.weekNumber ?? 0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedWeekData?.getWeek.weekNumber]);

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
		const currentWeek = currentWeekData?.getWeek.weekNumber;

		if (currentWeek) {
			setSelectedWeek(currentWeek);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWeekData?.getWeek.weekNumber]);

	if (router.pathname.startsWith('/picks')) {
		currentPage = 'Picks';
	} else if (router.pathname.startsWith('/survivor')) {
		currentPage = 'Survivor';
	} else if (router.pathname.startsWith('/users')) {
		currentPage = 'My Account';
	} else if (router.pathname.startsWith('/admin')) {
		currentPage = 'Admin';
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
					className={clsx('position-absolute', 'cursor-pointer', styles['mobile-menu'])}
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
							<FontAwesomeIcon
								className={clsx('cursor-pointer', styles['close-menu'])}
								icon={faTimes}
							/>
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
										className={clsx(
											'text-center',
											'px-2',
											'cursor-pointer',
											styles['week-picker'],
										)}
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
									{currentWeekData?.getWeek.weekNumber !== selectedWeek && (
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
									show={(weeklyCountData?.getWeeklyRankingsTotalCount ?? 0) > 0}
								>
									Week Results
								</NavLink>
								<NavLink
									href="/overall"
									isNested
									show={(overallCountData?.getOverallRankingsTotalCount ?? 0) > 0}
								>
									Overall Results
								</NavLink>
							</MenuAccordion>
							<MenuAccordion show={user.doneRegistering} title="Picks">
								<NavLink
									href="/picks/set"
									isNested
									show={!tiebreakerData?.getMyTiebreakerForWeek?.tiebreakerHasSubmitted}
								>
									Make Picks
								</NavLink>
								<NavLink href="/picks/view" isNested>
									View My Picks
								</NavLink>
								<NavLink
									href="/picks/viewall"
									isNested
									show={
										(weeklyCountData?.getWeeklyRankingsTotalCount ?? 0) > 0 &&
										tiebreakerData?.getMyTiebreakerForWeek?.tiebreakerHasSubmitted
									}
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
									show={
										user.hasSurvivor &&
										data?.isAliveInSurvivor &&
										selectedWeekData?.getWeek.weekStatus === 'NotStarted'
									}
								>
									Make Picks
								</NavLink>
								<NavLink
									href="/survivor/view"
									isNested
									show={
										selectedWeekData?.getWeek.weekStatus &&
										selectedWeekData?.getWeek.weekStatus !== 'NotStarted'
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
								{/* TODO: generate stats page
								<NavLink href="/users/stats" isNested show={user.doneRegistering}>
									Statistics
								</NavLink> */}
							</MenuAccordion>
							<NavLink href="/support">Help</NavLink>
							<MenuAccordion show={user.isAdmin} title="Admin">
								<NavLink href="/admin/api" isNested>
									API Logs
								</NavLink>
								<NavLink href="/admin/backups" isNested>
									Backups
								</NavLink>
								<NavLink href="/admin/email" isNested>
									Emails
								</NavLink>
								<NavLink href="/admin/logs" isNested>
									Logs
								</NavLink>
								<NavLink href="/admin/payments" isNested>
									Payments
								</NavLink>
								<NavLink href="/admin/users" isNested>
									Users
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
