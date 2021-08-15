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
import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import { getEmptyArray } from '../../utils/arrays';

const ViewAdminEmails: FC = () => {
	//TODO: load actual data and paginate through results
	const { data, error } = { data: null, error: null };

	if (error) {
		console.error('Error when rendering winners for admin payments screen', error);
	}

	return (
		<div className="row">
			<div className="col-12 content-bg mt-4 p-4 border border-secondary rounded table-responsive">
				<table className="table table-hover align-middle">
					<thead>
						<tr>
							<th scope="col">View</th>
							<th scope="col">To</th>
							<th scope="col">Subject</th>
							<th scope="col">Sent</th>
						</tr>
					</thead>
					{!data ? (
						<tbody>
							{getEmptyArray(10).map((_, i) => (
								<tr key={`table-loader-${i}`}>
									<th scope="row">
										<Skeleton height={20} width={45} />
									</th>
									<td>
										<div>
											<Skeleton height={20} width={65} />
										</div>
										<div>
											<Skeleton height={20} width={80} />
										</div>
									</td>
									<td>
										<Skeleton height={20} width={150} />
									</td>
									<td>
										<Skeleton height={20} width={150} />
									</td>
								</tr>
							))}
						</tbody>
					) : (
						<tbody></tbody>
					)}
				</table>
			</div>
		</div>
	);
};

ViewAdminEmails.whyDidYouRender = true;

export default ViewAdminEmails;
