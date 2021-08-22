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
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import React, { FC, useState, useEffect } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import Authenticated from '../../components/Authenticated/Authenticated';
import CustomHead from '../../components/CustomHead/CustomHead';
import { APICallObject, loadAPICalls } from '../../graphql/adminAPI';
import { TUser } from '../../models/User';
import { getEmptyArray } from '../../utils/arrays';
import {
	isAdminSSR,
	isSignedInSSR,
	IS_NOT_ADMIN_REDIRECT,
	UNAUTHENTICATED_REDIRECT,
} from '../../utils/auth.server';
import { getRandomInteger } from '../../utils/numbers';

const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });

type AdminAPICallsProps = {
	user: TUser;
};

const AdminAPICalls: FC<AdminAPICallsProps> = () => {
	const [data, setData] = useState<null | Array<APICallObject>>(null);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [lastKey, setLastKey] = useState<null | string>(null);

	const loadMore = async (): Promise<void> => {
		if (!hasMore) return;

		try {
			setLoading(true);

			const results = await loadAPICalls(20, lastKey);

			setData(data => [...(data ?? []), ...results.loadAPICalls.results]);
			setHasMore(results.loadAPICalls.hasMore);
			setLastKey(results.loadAPICalls.lastKey ?? null);
		} catch (error) {
			console.error('Failed to load API calls: ', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadMore();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [sentryRef] = useInfiniteScroll({
		hasNextPage: hasMore,
		loading,
		onLoadMore: loadMore,
		rootMargin: '0px 0px 400px 0px',
	});

	return (
		<Authenticated isAdmin>
			<CustomHead title="API History" />
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
							{!data ? <Skeleton height={20} width={125} /> : `${data.length} logs`}
						</div>
						<div className="col-12 mt-3">
							<div className="content-bg rounded table-responsive">
								<table className="table table-hover align-middle">
									<thead>
										<tr>
											<th scope="col">URL</th>
											<th scope="col">Year</th>
											<th scope="col">Week</th>
											<th scope="col">Date</th>
											<th scope="col">Response</th>
										</tr>
									</thead>
									{!data ? (
										<tbody>
											{getEmptyArray(20).map((_, i) => (
												<tr key={`table-loader-${i}`}>
													<td>
														<Skeleton height={20} width={getRandomInteger(125, 175)} />
													</td>
													<td>
														<Skeleton height={20} width={50} />
													</td>
													<td>
														<Skeleton height={20} width={40} />
													</td>
													<td>
														<Skeleton height={20} width={125} />
													</td>
													<td>
														<Skeleton height={20} width={getRandomInteger(100, 200)} />
													</td>
												</tr>
											))}
										</tbody>
									) : (
										<tbody>
											{data.map(apiCall => (
												<tr key={`api-call-${apiCall.apiCallID}`}>
													<td>{apiCall.apiCallUrl}</td>
													<td>{apiCall.apiCallYear}</td>
													<td>{apiCall.apiCallWeek}</td>
													<td>{apiCall.createdAt}</td>
													<td>
														{apiCall.apiCallResponse && (
															<DynamicReactJson
																collapsed
																src={JSON.parse(apiCall.apiCallResponse)}
																theme="shapeshifter"
															/>
														)}
													</td>
												</tr>
											))}
											{(loading || hasMore) && (
												<tr ref={sentryRef}>
													<td>
														<Skeleton height={20} width={getRandomInteger(125, 175)} />
													</td>
													<td>
														<Skeleton height={20} width={50} />
													</td>
													<td>
														<Skeleton height={20} width={40} />
													</td>
													<td>
														<Skeleton height={20} width={125} />
													</td>
													<td>
														<Skeleton height={20} width={getRandomInteger(100, 200)} />
													</td>
												</tr>
											)}
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

AdminAPICalls.whyDidYouRender = true;

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
export default AdminAPICalls;
