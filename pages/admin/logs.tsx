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
import { faSortNumericUp } from '@bduff9/pro-duotone-svg-icons/faSortNumericUp';
import { faSortNumericDownAlt } from '@bduff9/pro-duotone-svg-icons/faSortNumericDownAlt';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import React, {
	ChangeEvent,
	Dispatch,
	VFC,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import Authenticated from '../../components/Authenticated/Authenticated';
import CustomHead from '../../components/CustomHead/CustomHead';
import { LogAction } from '../../generated/graphql';
import { useAdminLogs } from '../../graphql/adminLogs';
import { TUser } from '../../models/User';
import { getEmptyArray } from '../../utils/arrays';
import {
	isSignedInSSR,
	UNAUTHENTICATED_REDIRECT,
	isAdminSSR,
	IS_NOT_ADMIN_REDIRECT,
} from '../../utils/auth.server';
import { formatTimestampForLog } from '../../utils/dates';
import Pagination from '../../components/Pagination/Pagination';
import { BackgroundLoadingContext } from '../../utils/context';
import { DropdownUser, useUserDropdown } from '../../graphql/adminUserTrustModal';
import { logger } from '../../utils/logging';

type LogFilterProps = {
	id: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	options: Array<Array<any>>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	selected: null | any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	setter: Dispatch<SetStateAction<null | any>>;
	title: string;
};

const LogFilter: VFC<LogFilterProps> = ({ id, options, selected, setter, title }) => {
	return (
		<Dropdown className="d-inline-block">
			<Dropdown.Toggle className="text-nowrap w-100" id={id} variant="light">
				{selected ?? title}
			</Dropdown.Toggle>
			<Dropdown.Menu>
				{options.map(([description, value]) => (
					<Dropdown.Item
						key={`dropdown-${id}-item-${value}`}
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						onClick={() => setter((oldValue: any) => (oldValue === value ? null : value))}
					>
						{selected === description && (
							<FontAwesomeIcon className="me-2" icon={faCheck} />
						)}
						{description}
					</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
};

const getUserName = (users: Array<DropdownUser>, userID: null | number): null | string => {
	if (!userID) return null;

	const user = users.find(user => user.userID === userID);

	if (!user) return null;

	return `${user.userFirstName} ${user.userLastName}`;
};

type AdminLogsProps = {
	user: TUser;
};

const AdminLogs: VFC<AdminLogsProps> = () => {
	const [logAction, setLogAction] = useState<LogAction | null>(null);
	const [page, setPage] = useState<number>(1);
	const [perPage, setPerPage] = useState<number>(25);
	const [sort] = useState<'logID'>('logID');
	const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('DESC');
	const [userID, setUserID] = useState<null | number>(null);
	const { data, error, isValidating } = useAdminLogs({
		logAction,
		page,
		perPage,
		sort,
		sortDir,
		userID,
	});
	const {
		data: usersData,
		error: usersError,
		isValidating: usersIsValidating,
	} = useUserDropdown();
	const [, setBackgroundLoading] = useContext(BackgroundLoadingContext);

	useEffect(() => {
		setBackgroundLoading((!!data && isValidating) || (!!usersData && usersIsValidating));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isValidating, usersData, usersIsValidating]);

	useEffect(() => {
		setPage(1);
	}, [logAction, perPage, sort, sortDir, userID]);

	if (error) {
		logger.error({ text: 'Error when querying logs for admin logs screen: ', error });
	}

	if (usersError) {
		logger.error({ text: 'Error when loading user dropdown: ', usersError });
	}

	const updatePerPage = (event: ChangeEvent<HTMLInputElement>): void => {
		const value = +event.currentTarget.value;

		if (!Number.isNaN(value) && value > 0) {
			setPerPage(value);
		}
	};

	return (
		<Authenticated isAdmin>
			<CustomHead title="View All Logs" />
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
						<div className="col-6 col-md-2 mb-2">
							{data ? `${data.getLogs.totalCount} logs` : <Skeleton />}
						</div>
						<div className="col-6 col-md-3 mb-2">
							<span className="d-inline d-md-none">Log ID: </span>
							<div className="btn-group" role="group" aria-label="Sort direction">
								<input
									autoComplete="off"
									checked={sortDir === 'ASC'}
									className="btn-check"
									id="sortDirASC"
									name="sortDir"
									onChange={() => setSortDir('ASC')}
									type="radio"
								/>
								<label className="btn btn-outline-primary" htmlFor="sortDirASC">
									<span className="d-none d-md-inline">Log ID Asc</span>
									<FontAwesomeIcon className="d-md-none" icon={faSortNumericUp} />
								</label>
								<input
									autoComplete="off"
									checked={sortDir === 'DESC'}
									className="btn-check"
									id="sortDirDESC"
									name="sortDir"
									onChange={() => setSortDir('DESC')}
									type="radio"
								/>
								<label className="btn btn-outline-primary" htmlFor="sortDirDESC">
									<span className="d-none d-md-inline">Log ID Desc</span>
									<FontAwesomeIcon className="d-md-none" icon={faSortNumericDownAlt} />
								</label>
							</div>
						</div>
						<div className="col-12 col-md-3 mb-2">
							<div className="row">
								<label htmlFor="perPage" className="col-7 col-form-label">
									Results Per Page
								</label>
								<div className="col-5">
									<input
										className="form-control"
										id="perPage"
										onChange={updatePerPage}
										type="number"
										value={perPage}
									/>
								</div>
							</div>
						</div>
						<div className="col-12 col-md-4 mb-2">
							{data ? (
								<Pagination
									currentPage={page}
									setPage={setPage}
									totalPages={Math.ceil(data.getLogs.totalCount / perPage)}
								/>
							) : (
								<Skeleton height={38} width={245} />
							)}
						</div>
						<div className="col-12">
							<div className="content-bg rounded table-responsive">
								<table className="table table-hover align-middle">
									<thead>
										<tr>
											<th scope="col">
												<LogFilter
													id="logAction"
													options={Object.keys(LogAction).map(action => [action, action])}
													selected={logAction}
													setter={setLogAction}
													title="Action"
												/>
											</th>
											<th scope="col">
												{usersData ? (
													<LogFilter
														id="userID"
														options={usersData.userDropdown.map(user => [
															`${user.userFirstName} ${user.userLastName}`,
															user.userID,
														])}
														selected={getUserName(usersData.userDropdown, userID)}
														setter={setUserID}
														title="User"
													/>
												) : (
													'User'
												)}
											</th>
											<th scope="col">Message</th>
											<th scope="col">Date</th>
										</tr>
									</thead>
									{!data ? (
										<tbody>
											{getEmptyArray(25).map((_, i) => (
												<tr key={`table-loader-${i}`}>
													<th scope="row">
														<Skeleton height={20} width={75} />
													</th>
													<td>
														<Skeleton height={20} width={100} />
													</td>
													<td>
														<Skeleton height={20} width={200} />
													</td>
													<td>
														<Skeleton height={20} width={100} />
													</td>
												</tr>
											))}
										</tbody>
									) : (
										<tbody>
											{data.getLogs.results.map(log => (
												<tr key={`log-${log.logID}`}>
													<td>{log.logAction}</td>
													<td>{log.user?.userName}</td>
													<td>
														{log.logMessage} {log.logData !== 'null' && log.logData}
													</td>
													<td>{formatTimestampForLog(log.logDate)}</td>
												</tr>
											))}
										</tbody>
									)}
								</table>
							</div>
						</div>
					</div>
				</SkeletonTheme>
			</div>
		</Authenticated>
	);
};

AdminLogs.whyDidYouRender = true;

// ts-prune-ignore-next
export const getServerSideProps: GetServerSideProps = async context => {
	const session = await isSignedInSSR(context);

	if (!session) {
		return UNAUTHENTICATED_REDIRECT;
	}

	const isAdmin = isAdminSSR(session);

	if (!isAdmin) {
		return IS_NOT_ADMIN_REDIRECT;
	}

	const { user } = session;

	return { props: { user } };
};

// ts-prune-ignore-next
export default AdminLogs;
