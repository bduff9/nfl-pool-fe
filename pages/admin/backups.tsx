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
import { faDatabase } from '@bduff9/pro-duotone-svg-icons/faDatabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import React, { FC, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import Alert from '../../components/Alert/Alert';
import AlertContainer from '../../components/AlertContainer/AlertContainer';
import Authenticated from '../../components/Authenticated/Authenticated';
import CustomHead from '../../components/CustomHead/CustomHead';
import { TUser } from '../../models/User';
import { getEmptyArray } from '../../utils/arrays';
import {
	isSignedInSSR,
	UNAUTHENTICATED_REDIRECT,
	isAdminSSR,
	IS_NOT_ADMIN_REDIRECT,
} from '../../utils/auth.server';
import { restoreBackup, useAdminBackups } from '../../graphql/adminBackups';
import { formatDateForBackup } from '../../utils/dates';

type AdminBackupsProps = {
	user: TUser;
};

const AdminBackups: FC<AdminBackupsProps> = () => {
	const { data, error } = useAdminBackups();
	const [errorMessage, setErrorMessage] = useState<null | string>(null);
	const [successMessage, setSuccessMessage] = useState<null | string>(null);
	const [loading, setLoading] = useState<null | string>(null);

	if (error) {
		console.error('Error when rendering backups for admin backups screen', error);
	}

	const restoreABackup = async (backupName: string): Promise<void> => {
		try {
			setLoading(backupName);
			await restoreBackup(backupName);
			setSuccessMessage(`Successfully restored backup ${backupName}!`);
		} catch (error) {
			console.error('Error updating user amount paid', {
				backupName,
				error,
			});
			setErrorMessage(
				error?.response?.errors?.[0]?.message ?? 'Something went wrong, please try again',
			);
		} finally {
			setLoading(null);
		}
	};

	return (
		<Authenticated isAdmin>
			<CustomHead title="Backups Admin" />
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
						<div className="col-12 text-center text-md-start">
							{!data ? (
								<Skeleton height={20} width={75} />
							) : (
								`${data.getBackups.length} backups`
							)}
						</div>
						<div className="col-12" style={{ height: '90vh' }}>
							<div className="content-bg rounded table-responsive">
								<table className="table table-hover align-middle">
									<thead>
										<tr className="d-none d-md-table-row">
											<th scope="col">Restore</th>
											<th scope="col">Name</th>
											<th scope="col">Date</th>
											<th scope="col">AM/PM</th>
										</tr>
									</thead>
									{!data ? (
										<tbody>
											{getEmptyArray(10).map((_, i) => (
												<tr key={`table-loader-${i}`}>
													<th className="text-center" scope="row">
														<Skeleton height={40} width={40} />
													</th>
													<td>
														<Skeleton height={20} width={200} />
													</td>
													<td>
														<Skeleton height={20} width={150} />
													</td>
													<td>
														<Skeleton height={20} width={30} />
													</td>
												</tr>
											))}
										</tbody>
									) : (
										<tbody>
											{data.getBackups.map(backup => (
												<tr key={`backup-${backup.backupName}`}>
													<th className="text-center" scope="row">
														{loading === null && (
															<FontAwesomeIcon
																className="cursor-pointer"
																icon={faDatabase}
																onClick={() => restoreABackup(backup.backupName)}
															/>
														)}
														{loading === backup.backupName && (
															<div className="spinner-border" role="status">
																<span className="visually-hidden">Loading...</span>
															</div>
														)}
													</th>
													<td>{backup.backupName}</td>
													<td>{formatDateForBackup(backup.backupDate)}</td>
													<td>{backup.backupWhen}</td>
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

AdminBackups.whyDidYouRender = true;

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
export default AdminBackups;
