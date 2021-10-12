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
import { GetServerSideProps } from 'next';
import React, { VFC, useContext, useEffect } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import Link from 'next/link';

import Authenticated from '../../components/Authenticated/Authenticated';
import {
	isSignedInSSR,
	UNAUTHENTICATED_REDIRECT,
	isDoneRegisteringSSR,
	IS_NOT_DONE_REGISTERING_REDIRECT,
} from '../../utils/auth.server';
import { useGetPayments } from '../../graphql/payments';
import { PaymentMethod } from '../../generated/graphql';
import PaymentSelector from '../../components/PaymentSelector/PaymentSelector';
import CustomHead from '../../components/CustomHead/CustomHead';
import { BackgroundLoadingContext } from '../../utils/context';
import { useCurrentUser } from '../../graphql/create';
import { logger } from '../../utils/logging';

const ViewPayments: VFC = () => {
	const { data, error, isValidating } = useGetPayments();
	const {
		data: currentUserData,
		error: currentUserError,
		isValidating: currentUserIsValidating,
	} = useCurrentUser();
	const [, setBackgroundLoading] = useContext(BackgroundLoadingContext);
	let owed = 0;

	useEffect(() => {
		setBackgroundLoading(
			(!!data && isValidating) || (!!currentUserData && currentUserIsValidating),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isValidating, currentUserData, currentUserIsValidating]);

	if (error) {
		logger.error({ text: 'Error during GetPayments query: ', error });
	}

	if (currentUserError) {
		logger.error({ text: 'Error when loading current user: ', currentUserError });
	}

	return (
		<Authenticated isRegistered>
			<CustomHead title="View Payments" />
			<SkeletonTheme>
				<div className="content-bg text-dark my-3 mx-2 pt-5 pt-md-3 min-vh-100 pb-4 col">
					<table className="table table-hover">
						<thead>
							<tr>
								<th className="text-start" scope="col">
									Description
								</th>
								<th className="text-center" scope="col">
									Week
								</th>
								<th className="text-end" scope="col">
									Amount
								</th>
							</tr>
						</thead>
						<tbody>
							{!data ? (
								<>
									<tr className="table-danger">
										<td className="text-start">
											<Skeleton height={39} />
										</td>
										<td className="text-center">
											<Skeleton height={39} />
										</td>
										<td className="text-end">
											<Skeleton height={39} />
										</td>
									</tr>
									<tr className="table-danger">
										<td className="text-start">
											<Skeleton height={39} />
										</td>
										<td className="text-center">
											<Skeleton height={39} />
										</td>
										<td className="text-end">
											<Skeleton height={39} />
										</td>
									</tr>
									<tr className="table-success">
										<td className="text-start">
											<Skeleton height={39} />
										</td>
										<td className="text-center">
											<Skeleton height={39} />
										</td>
										<td className="text-end">
											<Skeleton height={39} />
										</td>
									</tr>
									<tr className="table-success">
										<td className="text-start">
											<Skeleton height={39} />
										</td>
										<td className="text-center">
											<Skeleton height={39} />
										</td>
										<td className="text-end">
											<Skeleton height={39} />
										</td>
									</tr>
								</>
							) : (
								data.getMyPayments.map(payment => {
									owed += payment.paymentAmount;

									return (
										<tr
											className={
												payment.paymentAmount < 0 ? 'table-danger' : 'table-success'
											}
											key={`payment-${payment.paymentDescription}${
												payment.paymentWeek ?? ''
											}`}
										>
											<td className="text-start">{payment.paymentDescription}</td>
											<td className="text-center">{payment.paymentWeek}</td>
											<td className="text-end">${Math.abs(payment.paymentAmount)}</td>
										</tr>
									);
								})
							)}
						</tbody>
						<tfoot>
							{!data ? (
								<tr>
									<td className="text-start" colSpan={2}>
										<Skeleton height={39} />
									</td>
									<td className="text-end">
										<Skeleton height={39} />
									</td>
								</tr>
							) : (
								<tr>
									<td className="text-start" colSpan={2}>
										{owed < 0 ? 'Total you owe:' : 'Total you are owed:'}
									</td>
									<td className="text-end">${Math.abs(owed)}</td>
								</tr>
							)}
						</tfoot>
					</table>
					{currentUserData && owed < 0 && (
						<PaymentSelector
							amount={Math.abs(owed)}
							defaultPayment={
								currentUserData.getCurrentUser.userPaymentType ?? PaymentMethod.Paypal
							}
						/>
					)}
					<h3 className="text-center text-danger">
						{!data ? (
							<Skeleton height={28} width={450} />
						) : (
							'*** All prizes are paid at the end of the year ***'
						)}
					</h3>
					<div className="separator">
						{!data ? <Skeleton height={17} width={150} /> : 'My Prize Payment Info'}
					</div>
					<div className="mx-3">
						{!currentUserData ? (
							<Skeleton height={23} width={200} />
						) : (
							`Payment Type: ${currentUserData.getCurrentUser.userPaymentType}`
						)}
					</div>
					<div className="mx-3">
						{!currentUserData ? (
							<Skeleton height={23} width={250} />
						) : (
							`Payment Account: ${currentUserData.getCurrentUser.userPaymentAccount}`
						)}
					</div>
					<div className="mx-3">
						<Link href="/users/edit">
							<a>Change the account to be paid out</a>
						</Link>
					</div>
				</div>
			</SkeletonTheme>
		</Authenticated>
	);
};

ViewPayments.whyDidYouRender = true;

// ts-prune-ignore-next
export const getServerSideProps: GetServerSideProps = async context => {
	const session = await isSignedInSSR(context);

	if (!session) {
		return UNAUTHENTICATED_REDIRECT;
	}

	const isDoneRegistering = isDoneRegisteringSSR(session);

	if (!isDoneRegistering) {
		return IS_NOT_DONE_REGISTERING_REDIRECT;
	}

	const { user } = session;

	return { props: { user } };
};

// ts-prune-ignore-next
export default ViewPayments;
