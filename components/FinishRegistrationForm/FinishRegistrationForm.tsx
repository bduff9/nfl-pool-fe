/*
NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
Copyright (C) 2015-present Brian Duffey and Billy Alexander
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.  If not, see {http://www.gnu.org/licenses/}.
Home: https://asitewithnoname.com/
*/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons/faQuestionCircle';
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import React, { FC, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
// eslint-disable-next-line import/named
import { SubmitHandler, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { PaymentType } from '../../generated/graphql';
import { finishRegistration } from '../../graphql/finishRegistrationForm';
import { survivorPopover, paymentPopover } from '../Popover/Popover';
import SocialAuthButton from '../SocialAuthButton/SocialAuthButton';
import { ACCOUNT_TYPES } from '../../utils/constants';
import { TTrueFalse } from '../../utils/types';
import { getFullName, getFirstName, getLastName } from '../../utils/user';
import { GetCurrentUserResponse } from '../../graphql/create';

import styles from './FinishRegistrationForm.module.scss';

type FormData = {
	userEmail: string;
	userFirstName: string;
	userID: number;
	userLastName: string;
	userName: string;
	userPaymentAccount: string;
	userPaymentType: PaymentType;
	userPlaysSurvivor: TTrueFalse;
	userReferredByRaw: string;
	userTeamName: string;
};

const schema = Yup.object().shape({
	userFirstName: Yup.string()
		.min(2, 'Please enter your first name')
		.required('Please enter your first name'),
	userLastName: Yup.string()
		.min(2, 'Please enter your surname')
		.required('Please enter your surname'),
	userName: Yup.string().matches(/\w{2,}\s\w{2,}/),
	userTeamName: Yup.string(),
	userReferredByRaw: Yup.string()
		.matches(/\w{2,}\s\w{2,}/, 'Please input the full name of the person that invited you')
		.required('Please input the name of the person that invited you'),
	userPaymentType: Yup.string()
		.oneOf(ACCOUNT_TYPES, 'Please select a valid account type')
		.required('Please select an account type'),
	userPaymentAccount: Yup.string().when('userPaymentType', {
		is: 'Venmo',
		then: Yup.string().required('Please enter your Venmo user name'),
		otherwise: Yup.string()
			.email('Please enter your account email address')
			.required('Please enter your account email address'),
	}),
});

type FinishRegistrationFormProps = {
	currentUser: GetCurrentUserResponse;
	hasGoogle: boolean;
	hasTwitter: boolean;
};

const FinishRegistrationForm: FC<FinishRegistrationFormProps> = ({
	currentUser,
	hasGoogle,
	hasTwitter,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			userID: currentUser.userID,
			userName: getFullName(currentUser),
			userEmail: currentUser.userEmail,
			userFirstName: getFirstName(currentUser),
			userLastName: getLastName(currentUser),
			userPaymentAccount: currentUser.userPaymentAccount || '',
			userPaymentType: currentUser.userPaymentType || undefined,
			userPlaysSurvivor: `${currentUser.userPlaysSurvivor}` as TTrueFalse,
			userReferredByRaw: currentUser.userReferredByRaw || '',
			userTeamName: currentUser.userTeamName || '',
		},
		resolver: yupResolver(schema),
	});
	const [showUntrusted, setShowUntrusted] = useState<boolean>(
		!currentUser.userTrusted && !!currentUser.userReferredByRaw,
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const onSubmit: SubmitHandler<FormData> = async data => {
		const { userEmail: UUUserEmail, userID: UUUserID, userPlaysSurvivor, ...rest } = data;

		setIsLoading(true);

		try {
			if (!rest.userName) {
				rest.userName = getFullName(rest);
			}

			const result = await finishRegistration({
				...rest,
				userPlaysSurvivor: userPlaysSurvivor === 'true',
			});

			if (
				result.finishRegistration.userDoneRegistering &&
				result.finishRegistration.userTrusted
			) {
				window.location.assign('/users/payments');

				return;
			}

			setShowUntrusted(true);
		} catch (error) {
			console.error('Error during finish registration submit:', error);
		} finally {
			setIsLoading(false);
		}
	};

	if (showUntrusted) {
		return (
			<div className="text-center">
				<h2 className="mb-4">Thanks for requesting access!</h2>
				<h2 className="mb-5 fw-normal">
					An admin will review your information and will notify you via email shortly.
				</h2>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate>
			<div className="row mb-3">
				<div className="col">
					<label htmlFor="userEmail" className="form-label required">
						Email
					</label>
					<input
						aria-label="Email"
						className="form-control-plaintext"
						id="userEmail"
						readOnly
						type="email"
						{...register('userEmail')}
					/>
					<input type="hidden" {...register('userName')} />
					{errors.userEmail?.message && (
						<span className="text-danger fs-6">{errors.userEmail.message}</span>
					)}
					{errors.userName?.message && (
						<span className="text-danger fs-6">{errors.userName.message}</span>
					)}
				</div>
			</div>
			<div className="row mb-3">
				<div className="col-md mb-3 mb-md-0">
					<label htmlFor="userFirstName" className="form-label required">
						First Name
					</label>
					<input
						aria-label="First Name"
						className={clsx('form-control', errors.userFirstName?.message && 'is-invalid')}
						id="userFirstName"
						type="text"
						{...register('userFirstName')}
					/>
					{errors.userFirstName?.message && (
						<span className="text-danger fs-6">{errors.userFirstName.message}</span>
					)}
				</div>
				<div className="col-md">
					<label htmlFor="userLastName" className="form-label required">
						Last Name
					</label>
					<input
						aria-label="Last Name"
						className={clsx('form-control', errors.userLastName?.message && 'is-invalid')}
						id="userLastName"
						type="text"
						{...register('userLastName')}
					/>
					{errors.userLastName?.message && (
						<span className="text-danger fs-6">{errors.userLastName.message}</span>
					)}
				</div>
			</div>
			<div className="row mb-3">
				<div className="col">
					<label htmlFor="userTeamName" className="form-label">
						Team Name <span className="form-text">(optional)</span>
					</label>
					<input
						aria-label="Team Name"
						className={clsx('form-control', errors.userTeamName?.message && 'is-invalid')}
						id="userTeamName"
						type="text"
						{...register('userTeamName')}
					/>
					{errors.userTeamName?.message && (
						<span className="text-danger fs-6">{errors.userTeamName.message}</span>
					)}
				</div>
			</div>
			{currentUser.userTrusted ? (
				<input type="hidden" {...register('userReferredByRaw')} />
			) : (
				<div className="row mb-3">
					<div className="col">
						<label htmlFor="userReferredByRaw" className="form-label required">
							Who referred you to play?
						</label>
						<input
							aria-label="Referred By"
							className={clsx(
								'form-control',
								errors.userReferredByRaw?.message && 'is-invalid',
							)}
							id="userReferredByRaw"
							placeholder="Enter their full name for immediate access"
							type="text"
							{...register('userReferredByRaw')}
						/>
						{errors.userReferredByRaw?.message && (
							<span className="text-danger fs-6">{errors.userReferredByRaw.message}</span>
						)}
					</div>
				</div>
			)}
			<div className="row mb-3">
				<div className="col">
					<label htmlFor="userPlaysSurvivor" className="form-label required">
						Add on survivor game?&nbsp;
						<OverlayTrigger overlay={survivorPopover} placement="auto" trigger="click">
							<button className={styles['btn-popover']} type="button">
								<FontAwesomeIcon icon={faQuestionCircle} size="sm" />
							</button>
						</OverlayTrigger>
					</label>
					<div className="btn-group ms-4" role="group" aria-label="Play survivor game?">
						<input
							autoComplete="off"
							className="btn-check"
							id="userPlaysSurvivorN"
							type="radio"
							value="false"
							{...register('userPlaysSurvivor')}
						/>
						<label className="btn btn-outline-secondary" htmlFor="userPlaysSurvivorN">
							No
						</label>
						<input
							autoComplete="off"
							className="btn-check"
							id="userPlaysSurvivorY"
							type="radio"
							value="true"
							{...register('userPlaysSurvivor')}
						/>
						<label className="btn btn-outline-secondary" htmlFor="userPlaysSurvivorY">
							Yes
						</label>
					</div>
					{errors.userPlaysSurvivor?.message && (
						<span className="text-danger fs-6">{errors.userPlaysSurvivor.message}</span>
					)}
				</div>
			</div>
			<div className="row mb-3">
				<div className="col-md mb-3 mb-md-0">
					<label htmlFor="userPaymentType" className="form-label required">
						Payment Type
					</label>
					<select
						aria-label="Payment Type"
						className={clsx('form-select', errors.userPaymentType?.message && 'is-invalid')}
						id="userPaymentType"
						{...register('userPaymentType')}
					>
						<option value="">-- Select a payment type --</option>
						<option value="Paypal">Paypal</option>
						<option value="Venmo">Venmo</option>
						<option value="Zelle">Zelle</option>
					</select>
					{errors.userPaymentType?.message && (
						<span className="text-danger fs-6">{errors.userPaymentType.message}</span>
					)}
				</div>
				<div className="col-md">
					<label htmlFor="userPaymentAccount" className="form-label required">
						Payment Account&nbsp;
						<OverlayTrigger overlay={paymentPopover} placement="auto" trigger="focus">
							<button className={styles['btn-popover']} type="button">
								<FontAwesomeIcon icon={faQuestionCircle} size="sm" />
							</button>
						</OverlayTrigger>
					</label>
					<input
						aria-label="Payment Account"
						className={clsx(
							'form-control',
							errors.userPaymentAccount?.message && 'is-invalid',
						)}
						id="userPaymentAccount"
						type="text"
						{...register('userPaymentAccount')}
					/>
					{errors.userPaymentAccount?.message && (
						<span className="text-danger fs-6">{errors.userPaymentAccount.message}</span>
					)}
				</div>
			</div>
			<div className="d-grid gap-2 d-md-flex mb-2">
				<SocialAuthButton isLinked={hasGoogle} type="Google" />
				<SocialAuthButton isLinked={hasTwitter} type="Twitter" />
			</div>
			<div className="d-grid">
				<button className="btn btn-primary" disabled={isLoading} type="submit">
					{isLoading ? 'Submitting...' : 'Register'}
				</button>
			</div>
		</form>
	);
};

FinishRegistrationForm.whyDidYouRender = true;

export default FinishRegistrationForm;
