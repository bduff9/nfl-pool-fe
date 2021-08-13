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
import React, { ChangeEventHandler, FC, useState } from 'react';

import { PaymentMethod } from '../../generated/graphql';

type PaymentSelectorProps = {
	amount: number;
	defaultPayment: PaymentMethod;
};

const PAYMENT_MESSAGE =
	'NOTE: Please be sure to use an account tied to your name or put your name in the memo field so we correctly attribute your payment to you';

const PaymentSelector: FC<PaymentSelectorProps> = ({ amount, defaultPayment }) => {
	const [paymentType, setPaymentType] = useState<PaymentMethod>(defaultPayment);

	const updatePayment: ChangeEventHandler<HTMLSelectElement> = event => {
		setPaymentType(event.currentTarget.value as PaymentMethod);
	};

	return (
		<div className="mt-2 mx-3">
			<div>How would you like to pay your balance?</div>
			<select className="form-select" onChange={updatePayment} value={paymentType}>
				{Object.values(PaymentMethod).map(paymentMethod => (
					<option value={paymentMethod} key={paymentMethod}>
						{paymentMethod}
					</option>
				))}
			</select>
			<div className="text-center mt-2">
				{paymentType === 'Paypal' && (
					<div className=" fs-3 fw-bold text-danger">
						Please pay ${amount} using PayPal:{' '}
						<a
							href={`https://www.paypal.me/brianduffey/${amount}`}
							rel="noopener noreferrer"
							target="_blank"
						>
							paypal.me/brianduffey/{amount}
						</a>
					</div>
				)}
				{paymentType === 'Venmo' && (
					<div className=" fs-3 fw-bold text-danger">
						Please pay ${amount} using Venmo to account @brianduffey
					</div>
				)}
				{paymentType === 'Zelle' && (
					<div className=" fs-3 fw-bold text-danger">
						Please pay ${amount} using your bank&apos;s Zelle service to account
						bduff9@gmail.com
					</div>
				)}
				<div className="mt-4 fw-bolder">{PAYMENT_MESSAGE}</div>
			</div>
		</div>
	);
};

PaymentSelector.whyDidYouRender = true;

export default PaymentSelector;
