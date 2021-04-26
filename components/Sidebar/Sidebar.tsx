import { faBars } from '@bduff9/pro-solid-svg-icons/faBars';
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
import useSWR from 'swr';
import { gql } from 'graphql-request';

import NavLink from '../NavLink/NavLink';
import MenuAccordion from '../MenuAccordion/MenuAccordion';
import { TitleContext, WeekContext } from '../../utils/context';
import { fetcher } from '../../utils/graphql';
import { WeekStatus } from '../../generated/graphql';
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
	const getSidebarGQL = gql`
		query GetSidebar($week: Int!) {
			currentWeek: getWeek {
				weekNumber
				weekStarts
				weekStatus
			}
			selectedWeek: getWeek(Week: $week) {
				weekNumber
				weekStarts
				weekStatus
			}
			getMyTiebreakerForWeek(Week: $week) {
				tiebreakerHasSubmitted
			}
			isAliveInSurvivor
		}
	`;
	const getSidebarVars = { week: selectedWeek };
	const { data, error } = useSWR<{
		currentWeek: {
			weekNumber: number;
			weekStarts: Date;
			weekStatus: WeekStatus;
		};
		selectedWeek: {
			weekNumber: number;
			weekStarts: Date;
			weekStatus: WeekStatus;
		};
		getMyTiebreakerForWeek: {
			tiebreakerHasSubmitted: boolean;
		};
		isAliveInSurvivor: boolean;
	}>([getSidebarGQL, getSidebarVars], fetcher);
	const isLoading = user.doneRegistering && !data;
	const hasSeasonStarted =
		(data?.currentWeek.weekNumber || 0) > 1 ||
		data?.currentWeek.weekStatus !== 'NotStarted';
	let currentPage = '';

	if (error) {
		console.error('Failed to load sidebar data', error);
		throw error;
	}

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
			if (week < 18) {
				return ++week;
			}

			return week;
		});
	};

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
					'left-0',
					'right-0',
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
							<FontAwesomeIcon
								className={styles['close-menu']}
								icon={faTimes}
							/>
						</span>
						<div
							className={clsx(
								'text-center',
								'mb-4',
								'sidebar-greeting',
								!user.doneRegistering && 'invisible',
							)}
						>
							Welcome, {user.firstName}
						</div>
						<div
							className={clsx(
								'text-center',
								'mb-4',
								'd-flex',
								'justify-content-around',
								'sidebar-week',
								!user.doneRegistering && 'invisible',
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
								{Array.from({ length: 18 }).map((_, i) => (
									<option key={`week-${i + 1}`} value={i + 1}>
										Week {i + 1}
									</option>
								))}
							</select>
							<button
								className={clsx(
									'p-0',
									'm-0',
									selectedWeek === 18 && 'invisible',
									styles['btn-week-picker'],
								)}
								onClick={goToNextWeek}
							>
								<FontAwesomeIcon icon={faChevronRight} />
							</button>
						</div>
						{/* collapse, collapsing, show, accordion */}
						<Accordion defaultActiveKey={currentPage}>
							<MenuAccordion show={user.doneRegistering} title="Dashboard">
								<NavLink href="/" isNested>
									My Dashboard
								</NavLink>
								<NavLink
									href="/weekly"
									isNested
									show={data?.selectedWeek.weekStatus !== 'NotStarted'}
								>
									Week Results
								</NavLink>
								<NavLink href="/overall" isNested show={hasSeasonStarted}>
									Overall Results
								</NavLink>
							</MenuAccordion>
							<MenuAccordion show={user.doneRegistering} title="Picks">
								<NavLink
									href="/picks/make"
									isNested
									show={!data?.getMyTiebreakerForWeek.tiebreakerHasSubmitted}
								>
									Make Picks
								</NavLink>
								<NavLink href="/picks/view" isNested>
									View My Picks
								</NavLink>
								<NavLink
									href="/picks/viewall"
									isNested
									show={data?.getMyTiebreakerForWeek.tiebreakerHasSubmitted}
								>
									View All Picks
								</NavLink>
							</MenuAccordion>
							<MenuAccordion show={user.doneRegistering} title="Survivor">
								<NavLink
									isNested
									onClick={() => alert('TODO:')}
									show={!hasSeasonStarted && !user.hasSurvivor}
								>
									Register for Survivor
								</NavLink>
								<NavLink
									isNested
									onClick={() => alert('TODO:')}
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
								<NavLink href="/survivor/view" isNested>
									View Picks
								</NavLink>
							</MenuAccordion>
							<NavLink
								onClick={() => alert('TODO:')}
								show={user.doneRegistering}
							>
								NFL Scoreboard
							</NavLink>
							<MenuAccordion title="My Account">
								<NavLink
									href="/users/create"
									isNested
									show={!user.doneRegistering}
								>
									Finish Registration
								</NavLink>
								<NavLink
									href="/users/edit"
									isNested
									show={user.doneRegistering}
								>
									Edit My Profile
								</NavLink>
								<NavLink
									href="/users/payments"
									isNested
									show={user.doneRegistering}
								>
									View Payments
								</NavLink>
								<NavLink
									href="/users/stats"
									isNested
									show={user.doneRegistering}
								>
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
								<NavLink isNested onClick={() => alert('TODO:')}>
									Refresh Games
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
