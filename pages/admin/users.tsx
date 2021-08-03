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
import { faDollarSign } from '@bduff9/pro-duotone-svg-icons/faDollarSign';
import { faEnvelope } from '@bduff9/pro-duotone-svg-icons/faEnvelope';
import { faIslandTropical } from '@bduff9/pro-duotone-svg-icons/faIslandTropical';
import { faThumbsDown } from '@bduff9/pro-duotone-svg-icons/faThumbsDown';
import { faThumbsUp } from '@bduff9/pro-duotone-svg-icons/faThumbsUp';
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import React, { FC, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import Alert from '../../components/Alert/Alert';
import AlertContainer from '../../components/AlertContainer/AlertContainer';
import Authenticated from '../../components/Authenticated/Authenticated';
import CustomHead from '../../components/CustomHead/CustomHead';
import {
	AdminUserType,
	Notification,
	NotificationType,
	User,
} from '../../generated/graphql';
import {
	removeUser,
	setUserPaid,
	toggleSurvivor,
	trustUser,
	useAdminUsers,
} from '../../graphql/adminUsers';
import { TUser } from '../../models/User';
import { getEmptyArray } from '../../utils/arrays';
import {
	isSignedInSSR,
	UNAUTHENTICATED_REDIRECT,
	isAdminSSR,
	IS_NOT_ADMIN_REDIRECT,
} from '../../utils/auth.server';
import styles from '../../styles/admin/users.module.scss';
import AdminUserPaymentModal from '../../components/AdminUserPaymentModal/AdminUserPaymentModal';
import AdminUserTrustModal from '../../components/AdminUserTrustModal/AdminUserTrustModal';

type AdminUserStatusProps = {
	user: Pick<
		User,
		| 'userID'
		| 'userEmail'
		| 'userName'
		| 'userFirstName'
		| 'userLastName'
		| 'userTeamName'
		| 'userReferredByRaw'
		| 'userEmailVerified'
		| 'userTrusted'
		| 'userDoneRegistering'
		| 'userIsAdmin'
		| 'userPlaysSurvivor'
		| 'userPaymentType'
		| 'userPaymentAccount'
		| 'userPaid'
		| 'userAutoPicksLeft'
		| 'userAutoPickStrategy'
		| 'userCommunicationsOptedOut'
	> & {
		userReferredByUser: Pick<User, 'userID' | 'userName'> | null;
		notifications: Array<
			Pick<
				Notification,
				| 'notificationID'
				| 'notificationEmail'
				| 'notificationEmailHoursBefore'
				| 'notificationSMS'
				| 'notificationSMSHoursBefore'
			> & {
				notificationDefinition: Pick<NotificationType, 'notificationTypeDescription'>;
			}
		>;
	};
};

const AdminUserStatus: FC<AdminUserStatusProps> = ({ user }) => {
	if (!user.userEmailVerified) return <span className="text-danger">Unverified</span>;

	if (!user.userTrusted) return <span className="text-warning">Untrusted</span>;

	if (!user.userDoneRegistering) {
		return <span className="text-info">Verified</span>;
	}

	return <span className="text-success">Registered</span>;
};

type AdminUserNotificationsProps = {
	notifications: Array<
		Pick<
			Notification,
			| 'notificationID'
			| 'notificationEmail'
			| 'notificationEmailHoursBefore'
			| 'notificationSMS'
			| 'notificationSMSHoursBefore'
		> & {
			notificationDefinition: Pick<NotificationType, 'notificationTypeDescription'>;
		}
	>;
};

const AdminUserNotifications: FC<AdminUserNotificationsProps> = ({ notifications }) => {
	return (
		<>
			{notifications
				.filter(
					notification => notification.notificationEmail || notification.notificationSMS,
				)
				.map(notification => (
					<div
						className="col-6 text-nowrap"
						key={`notification-${notification.notificationID}`}
					>
						{notification.notificationDefinition.notificationTypeDescription}:{' '}
						{notification.notificationEmail
							? `E${notification.notificationEmailHoursBefore ?? ''}`
							: ''}{' '}
						{notification.notificationSMS
							? `S${notification.notificationSMSHoursBefore ?? ''}`
							: ''}
					</div>
				))}
		</>
	);
};

type AdminUsersProps = {
	user: TUser;
};

const AdminUsers: FC<AdminUsersProps> = () => {
	const [userType, setUserType] = useState<AdminUserType>(AdminUserType.Registered);
	const { data, error, mutate } = useAdminUsers(userType);
	const [errorMessage, setErrorMessage] = useState<null | string>(null);
	const [successMessage, setSuccessMessage] = useState<null | string>(null);
	const [userExpanded, setUserExpanded] = useState<null | number>(null);
	const [modalOpen, setModalOpen] = useState<
		| null
		| { type: 'payment'; owe: number; paid: number; userID: number }
		| { type: 'referredBy'; referredBy: null | string; userID: number }
	>(null);

	if (error) {
		console.error('Error when rendering users for admin users screen', error);
	}

	const updateUserPaid = async (
		userID: number | undefined,
		amountPaid: number,
	): Promise<void> => {
		if (!userID) {
			setErrorMessage('Missing user ID to update, please try again');

			return;
		}

		try {
			mutate(data => {
				if (!data) return data;

				const getUsersForAdmins = data.getUsersForAdmins.map(user => {
					if (user.userID === userID) {
						return {
							...user,
							userPaid: amountPaid,
						};
					}

					return user;
				});

				return { getUsersForAdmins };
			}, false);
			await setUserPaid(userID, amountPaid);
			setModalOpen(null);
			setSuccessMessage('Successfully updated user paid amount!');
		} catch (error) {
			console.error('Error updating user amount paid', {
				amountPaid,
				error,
				userID,
			});
			setErrorMessage(
				error?.response?.errors?.[0]?.message ?? 'Something went wrong, please try again',
			);
		} finally {
			await mutate();
		}
	};

	const markUserTrusted = async (
		userID: number | undefined,
		referredBy: null | number,
	): Promise<void> => {
		if (!userID) {
			setErrorMessage('Missing user ID to update, please try again');

			return;
		}

		if (!referredBy) {
			setErrorMessage('Missing referred by user ID, please try again');

			return;
		}

		try {
			mutate(data => {
				if (!data) return data;

				const getUsersForAdmins = data.getUsersForAdmins.map(user => {
					if (user.userID === userID) {
						return {
							...user,
							userTrusted: true,
							userReferredBy: referredBy,
						};
					}

					return user;
				});

				return { getUsersForAdmins };
			}, false);
			await trustUser(userID, referredBy);
			setModalOpen(null);
			setSuccessMessage('Successfully marked user as trusted!');
		} catch (error) {
			console.error('Error marking user as trusted', {
				error,
				referredBy,
				userID,
			});
			setErrorMessage(
				error?.response?.errors?.[0]?.message ?? 'Something went wrong, please try again',
			);
		} finally {
			await mutate();
		}
	};

	const deleteUser = async (userID: number): Promise<void> => {
		try {
			await removeUser(userID);
			setSuccessMessage(`Successfully removed untrusted user!`);
		} catch (error) {
			console.error('Failed to remove untrusted user:', { error, userID });
			setErrorMessage(
				`Failed to remove untrusted user from pool, please see logs for more details`,
			);
		}
	};

	const updateSurvivor = async (userID: number, isPlaying: boolean): Promise<void> => {
		try {
			await toggleSurvivor(userID, isPlaying);
			setSuccessMessage(`Successfully updated user's survivor status!`);
		} catch (error) {
			console.error('Failed to update survivor status:', { error, isPlaying, userID });
			setErrorMessage(
				`Failed to update user's survivor status, please see logs for more details`,
			);
		}
	};

	return (
		<Authenticated isAdmin>
			<CustomHead title="User Admin" />
			<AlertContainer>
				{errorMessage && (
					<Alert
						autoHide
						delay={5000}
						message={errorMessage}
						onClose={() => setErrorMessage(null)}
						title="Error!"
						type="danger"
					/>
				)}
				{successMessage && (
					<Alert
						autoHide
						delay={5000}
						message={successMessage}
						onClose={() => setSuccessMessage(null)}
						title="Success!"
						type="success"
					/>
				)}
			</AlertContainer>
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
						<div className="col-12 col-md-6 order-2 order-md-1 text-center text-md-start">
							{!data ? (
								<Skeleton height={20} width={75} />
							) : (
								`${data.getUsersForAdmins.length} users`
							)}
						</div>
						<div className="col-12 col-md-6 order-1 order-md-2 text-center text-md-start">
							<span className="d-none d-md-inline">Filter By: </span>
							<Dropdown className={clsx('d-inline-block', styles['btn-filter'])}>
								<Dropdown.Toggle
									className="text-nowrap w-100"
									disabled={!data}
									id="filter-users"
									variant="primary"
								>
									{userType}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item onClick={() => setUserType(AdminUserType.All)}>
										All
									</Dropdown.Item>
									<Dropdown.Item onClick={() => setUserType(AdminUserType.Inactive)}>
										Inactive
									</Dropdown.Item>
									<Dropdown.Item onClick={() => setUserType(AdminUserType.Incomplete)}>
										Incomplete
									</Dropdown.Item>
									<Dropdown.Item onClick={() => setUserType(AdminUserType.Owes)}>
										Owes
									</Dropdown.Item>
									<Dropdown.Item onClick={() => setUserType(AdminUserType.Registered)}>
										Registered
									</Dropdown.Item>
									<Dropdown.Item onClick={() => setUserType(AdminUserType.Rookies)}>
										Rookies
									</Dropdown.Item>
									<Dropdown.Item onClick={() => setUserType(AdminUserType.Veterans)}>
										Veterans
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
						<div className="col-12 order-3 mt-3">
							<div className="content-bg rounded table-responsive">
								<table className="table table-hover align-middle">
									<thead>
										<tr className="d-none d-md-table-row">
											<th scope="col">Name</th>
											<th scope="col"></th>
											<th scope="col">Email</th>
											<th scope="col">Referral</th>
											<th scope="col">Status</th>
											<th scope="col">Notifications</th>
											<th className="text-nowrap" scope="col">
												Auto Picks
											</th>
											<th scope="col">Logins</th>
										</tr>
									</thead>
									{!data ? (
										<tbody>
											{getEmptyArray(20).map((_, i) => (
												<tr key={`table-loader-${i}`}>
													<th
														className="d-flex justify-content-between flex-wrap"
														scope="row"
													>
														<div className="">
															<Skeleton height={20} width={65} />
														</div>
														<div className="w-100 d-none d-md-block"></div>
														<div className="">
															<Skeleton height={20} width={80} />
														</div>
													</th>
													<td className="d-none d-md-table-cell">
														<Skeleton height={40} width={40} />
														<Skeleton className="ms-3" height={40} width={40} />
														<Skeleton className="ms-3" height={40} width={40} />
													</td>
													<td className="d-none d-md-table-cell">
														<Skeleton height={20} width={100} />
													</td>
													<td className="d-none d-md-table-cell">
														<Skeleton height={20} width={75} />
													</td>
													<td className="d-none d-md-table-cell">
														<Skeleton height={20} width={75} />
													</td>
													<td className="d-none d-md-table-cell">
														<Skeleton height={40} width={60} />
														<Skeleton className="ms-3" height={40} width={60} />
													</td>
													<td className="d-none d-md-table-cell">
														<Skeleton height={20} width={60} />
													</td>
													<td className="d-none d-md-table-cell">
														<Skeleton height={20} width={20} />
													</td>
												</tr>
											))}
										</tbody>
									) : (
										<tbody>
											{data.getUsersForAdmins.map(user => (
												<tr key={`user-id-${user.userID}`}>
													<th scope="row">
														<div className="d-flex justify-content-between flex-wrap">
															<div title={user.userName ?? ''}>
																<FontAwesomeIcon
																	className={clsx(
																		'd-inline-block',
																		'd-md-none',
																		'cursor-pointer',
																		'me-2',
																		styles.caret,
																	)}
																	icon={faCaretRight}
																	onClick={() =>
																		setUserExpanded(expandedID =>
																			expandedID === user.userID ? null : user.userID,
																		)
																	}
																	rotation={userExpanded === user.userID ? 90 : undefined}
																/>
																{user.userFirstName} {user.userLastName}
															</div>
															<div className="w-100 d-none d-md-block"></div>
															<div className="text-muted fw-lighter">
																{user.userTeamName || `${user.userFirstName}'s Team`}
															</div>
														</div>
														{userExpanded === user.userID && (
															<div className="d-md-none">
																<div className="d-flex justify-content-between border-top border-secondary py-2">
																	<div className="text-start">Email:</div>
																	<div className="text-end fw-light">
																		{user.userEmail}
																		{user.userCommunicationsOptedOut && (
																			<div className="text-danger">Unsubscribed</div>
																		)}
																	</div>
																</div>
																<div className="d-flex justify-content-between border-top border-secondary py-2">
																	<div className="text-start">Referral:</div>
																	<div className="text-end fw-light">
																		{user.userReferredByUser
																			? user.userReferredByUser.userName
																			: user.userReferredByRaw}
																	</div>
																</div>
																<div className="d-flex justify-content-between border-top border-secondary py-2">
																	<div className="text-start">Status:</div>
																	<div className="text-end fw-light">
																		<AdminUserStatus user={user} />
																	</div>
																</div>
																<div className="d-flex justify-content-between border-top border-secondary py-2">
																	<div className="text-start">Auto Picks:</div>
																	<div className="text-end fw-light">
																		{user.userAutoPickStrategy}: {user.userAutoPicksLeft}
																	</div>
																</div>
																<div className="d-flex justify-content-between border-top border-secondary py-2">
																	<div className="text-start">Logins:</div>
																	<div className="text-end">
																		<FontAwesomeIcon
																			className={styles['text-email']}
																			icon={faEnvelope}
																			title="Email sign in"
																		/>
																		{user.accounts.find(
																			account => account.accountProviderID === 'google',
																		) && (
																			<FontAwesomeIcon
																				className={clsx('ms-2', styles['text-google'])}
																				icon={faGoogle}
																				title="Google sign in"
																			/>
																		)}
																		{user.accounts.find(
																			account => account.accountProviderID === 'twitter',
																		) && (
																			<FontAwesomeIcon
																				className={clsx('ms-2', styles['text-twitter'])}
																				icon={faTwitter}
																				title="Twitter sign in"
																			/>
																		)}
																	</div>
																</div>
																<div className="d-flex justify-content-between flex-wrap border-top border-secondary py-2">
																	<div className="text-start w-100">Notifications:</div>
																	<div className="w-100 ps-3 fw-light">
																		<AdminUserNotifications
																			notifications={user.notifications}
																		/>
																	</div>
																</div>
																<div className="d-flex justify-content-around border-top border-secondary fs-1 py-2">
																	{user.userDoneRegistering && (
																		<FontAwesomeIcon
																			className={clsx(
																				'cursor-pointer',
																				user.userPaid === 0
																					? 'text-danger'
																					: user.userPaid === user.userOwes
																						? 'text-success'
																						: 'text-warning',
																			)}
																			icon={faDollarSign}
																			onClick={() =>
																				setModalOpen({
																					owe: user.userOwes,
																					paid: user.userPaid,
																					type: 'payment',
																					userID: user.userID,
																				})
																			}
																			title={`${user.userFirstName} ${user.userLastName} has paid $${user.userPaid} / $${user.userOwes}`}
																		/>
																	)}
																	{!user.userTrusted && (
																		<>
																			<FontAwesomeIcon
																				className="text-success ms-3 cursor-pointer"
																				icon={faThumbsUp}
																				onClick={() =>
																					setModalOpen({
																						referredBy: user.userReferredByRaw ?? null,
																						type: 'referredBy',
																						userID: user.userID,
																					})
																				}
																				title={`Mark ${user.userFirstName} ${user.userLastName} as trusted`}
																			/>
																			<FontAwesomeIcon
																				className="text-danger ms-3 cursor-pointer"
																				icon={faThumbsDown}
																				onClick={() => deleteUser(user.userID)}
																				title={`Mark ${user.userFirstName} ${user.userLastName} as untrusted`}
																			/>
																		</>
																	)}
																	{user.userDoneRegistering && (
																		<FontAwesomeIcon
																			className={clsx(
																				'ms-3',
																				'cursor-pointer',
																				user.userPlaysSurvivor
																					? 'text-success'
																					: 'text-danger',
																			)}
																			icon={faIslandTropical}
																			onClick={() =>
																				updateSurvivor(user.userID, !user.userPlaysSurvivor)
																			}
																			title={`${
																				user.userPlaysSurvivor ? 'Remove' : 'Register'
																			} ${user.userFirstName} ${user.userLastName} ${
																				user.userPlaysSurvivor ? 'from' : 'to'
																			} survivor pool`}
																		/>
																	)}
																</div>
															</div>
														)}
													</th>
													<td
														className={clsx(
															'd-none',
															'd-md-table-cell',
															'fs-4',
															'text-nowrap',
														)}
													>
														{user.userDoneRegistering && (
															<FontAwesomeIcon
																className={clsx(
																	'cursor-pointer',
																	user.userPaid === 0
																		? 'text-danger'
																		: user.userPaid === user.userOwes
																			? 'text-success'
																			: 'text-warning',
																)}
																icon={faDollarSign}
																onClick={() =>
																	setModalOpen({
																		owe: user.userOwes,
																		paid: user.userPaid,
																		type: 'payment',
																		userID: user.userID,
																	})
																}
																title={`${user.userFirstName} ${user.userLastName} has paid $${user.userPaid} / $${user.userOwes}`}
															/>
														)}
														{!user.userTrusted && (
															<>
																<FontAwesomeIcon
																	className="text-success ms-3 cursor-pointer"
																	icon={faThumbsUp}
																	onClick={() =>
																		setModalOpen({
																			referredBy: user.userReferredByRaw ?? null,
																			type: 'referredBy',
																			userID: user.userID,
																		})
																	}
																	title={`Mark ${user.userFirstName} ${user.userLastName} as trusted`}
																/>
																<FontAwesomeIcon
																	className="text-danger ms-3 cursor-pointer"
																	icon={faThumbsDown}
																	onClick={() => deleteUser(user.userID)}
																	title={`Mark ${user.userFirstName} ${user.userLastName} as untrusted`}
																/>
															</>
														)}
														{user.userDoneRegistering && (
															<FontAwesomeIcon
																className={clsx(
																	'ms-3',
																	'cursor-pointer',
																	user.userPlaysSurvivor ? 'text-success' : 'text-danger',
																)}
																icon={faIslandTropical}
																onClick={() =>
																	updateSurvivor(user.userID, !user.userPlaysSurvivor)
																}
																title={`${user.userPlaysSurvivor ? 'Remove' : 'Register'} ${
																	user.userFirstName
																} ${user.userLastName} ${
																	user.userPlaysSurvivor ? 'from' : 'to'
																} survivor pool`}
															/>
														)}
													</td>
													<td className="d-none d-md-table-cell">
														{user.userEmail}
														{user.userCommunicationsOptedOut && (
															<div className="text-danger">Unsubscribed</div>
														)}
													</td>
													<td className="d-none d-md-table-cell">
														{user.userReferredByUser
															? user.userReferredByUser.userName
															: user.userReferredByRaw}
													</td>
													<td
														className="d-none d-md-table-cell"
														title={`Years played: ${user.yearsPlayed}`}
													>
														<AdminUserStatus user={user} />
													</td>
													<td className="d-none d-md-table-cell">
														<div className="d-flex flex-wrap">
															<AdminUserNotifications notifications={user.notifications} />
														</div>
													</td>
													<td className="d-none d-md-table-cell text-nowrap">
														{user.userAutoPickStrategy}: {user.userAutoPicksLeft}
													</td>
													<td className="d-none d-md-table-cell">
														<FontAwesomeIcon
															className={styles['text-email']}
															icon={faEnvelope}
															title="Email sign in"
														/>
														{user.accounts.find(
															account => account.accountProviderID === 'google',
														) && (
															<FontAwesomeIcon
																className={clsx('ms-2', styles['text-google'])}
																icon={faGoogle}
																title="Google sign in"
															/>
														)}
														{user.accounts.find(
															account => account.accountProviderID === 'twitter',
														) && (
															<FontAwesomeIcon
																className={clsx('ms-2', styles['text-twitter'])}
																icon={faTwitter}
																title="Twitter sign in"
															/>
														)}
													</td>
												</tr>
											))}
										</tbody>
									)}
								</table>
							</div>
						</div>
					</div>
					<AdminUserPaymentModal
						handleClose={() => setModalOpen(null)}
						owe={modalOpen?.type === 'payment' ? modalOpen.owe : null}
						paid={modalOpen?.type === 'payment' ? modalOpen.paid : null}
						show={modalOpen?.type === 'payment'}
						updateAmount={updateUserPaid}
						userID={modalOpen?.userID}
					/>
					<AdminUserTrustModal
						handleClose={() => setModalOpen(null)}
						referredByRaw={modalOpen?.type === 'referredBy' ? modalOpen.referredBy : null}
						show={modalOpen?.type === 'referredBy'}
						trustUser={markUserTrusted}
						userID={modalOpen?.userID}
					/>
				</SkeletonTheme>
			</div>
		</Authenticated>
	);
};

AdminUsers.whyDidYouRender = true;

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
export default AdminUsers;
