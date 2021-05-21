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
import React, { FC, useEffect, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
// eslint-disable-next-line import/named
import { SubmitHandler, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import 'yup-phone';

import { AutoPickStrategy, NotificationInput, PaymentType } from '../../generated/graphql';
import { editProfile } from '../../graphql/editProfileForm';
import {
	autoPickPopover,
	dynamicPopover,
	paymentPopover,
	phonePopover,
} from '../Popover/Popover';
import SocialAuthButton from '../SocialAuthButton/SocialAuthButton';
import { ACCOUNT_TYPES } from '../../utils/constants';
import { GetCurrentUserResponse, GetMyNotificationsResponse } from '../../graphql/edit';

import styles from './EditProfileForm.module.scss';

Yup.addMethod(Yup.string, 'validatePhone', function () {
	return this.test('test-phone', 'Please enter a valid SMS-capable phone number', value => {
		if (value) return this.phone('US', true).isValidSync(value);

		return true;
	});
});

type FormData = {
	userAutoPickStrategy: AutoPickStrategy | null;
	userAutoPicksLeft: number;
	userEmail: string;
	userFirstName: string;
	userLastName: string;
	userPaymentAccount: string;
	userPaymentType: PaymentType;
	userPhone: string;
	userTeamName: string;
	notifications: Array<NotificationInput & { hasValidPhone: boolean }>;
};

const schema = Yup.object().shape({
	userEmail: Yup.string()
		.email('Account email must be valid')
		.required('You must have an email to be able to sign in'),
	userFirstName: Yup.string()
		.min(2, 'Please enter your first name')
		.required('Please enter your first name'),
	userLastName: Yup.string()
		.min(2, 'Please enter your surname')
		.required('Please enter your surname'),
	userTeamName: Yup.string(),
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
	userPhone: (Yup.string() as Yup.StringSchema & {
		validatePhone: () => Yup.StringSchema;
	})
		.validatePhone()
		.transform(value => {
			if (!value) return null;

			return value;
		})
		.nullable(),
	userAutoPickStrategy: Yup.string()
		.oneOf(Object.keys(AutoPickStrategy), 'Please select a valid auto pick strategy')
		.required('Please select an auto pick strategy'),
	userAutoPicksLeft: Yup.number()
		.max(3, 'Not authorized to change auto pick count')
		.min(0, 'Not authorized to change auto pick count')
		.required('Not authorized to change auto pick count'),
	notifications: Yup.array().of(
		Yup.object()
			.shape({
				notificationType: Yup.string().required(),
				notificationEmail: Yup.boolean()
					.transform((value: boolean | null) => value === true)
					.required(),
				notificationEmailHoursBefore: Yup.number().when(
					['notificationEmail', 'notificationType', '$myNotifications'],
					{
						is: (
							hasEmail: boolean,
							type: string,
							allNotifications: GetMyNotificationsResponse,
						) => {
							const notification = allNotifications.find(
								({ notificationDefinition }) =>
									notificationDefinition.notificationType === type,
							);

							if (!notification?.notificationDefinition.notificationTypeHasHours) {
								return false;
							}

							return hasEmail;
						},
						then: Yup.number()
							.transform((value: number) => (Number.isNaN(value) ? 0 : value))
							.min(1, 'Please enter a value between 1 and 48')
							.max(48, 'Please enter a value between 1 and 48')
							.required('Please enter a value between 1 and 48'),
						otherwise: Yup.number().nullable(),
					},
				),
				notificationSMS: Yup.boolean().transform((value: boolean | null) => value === true),
				notificationSMSHoursBefore: Yup.number().when(
					['notificationSMS', 'notificationType', 'hasValidPhone', '$myNotifications'],
					{
						is: (
							hasSMS: boolean,
							type: string,
							_hasValidPhone: boolean,
							allNotifications: GetMyNotificationsResponse,
						) => {
							const notification = allNotifications.find(
								({ notificationDefinition }) =>
									notificationDefinition.notificationType === type,
							);

							if (!notification?.notificationDefinition.notificationTypeHasHours) {
								return false;
							}

							return hasSMS;
						},
						then: Yup.number()
							.transform((value: number) => (Number.isNaN(value) ? 0 : value))
							.min(1, 'Please enter a value between 1 and 48')
							.max(48, 'Please enter a value between 1 and 48')
							.required('Please enter a value between 1 and 48'),
						otherwise: Yup.number().nullable(),
					},
				),
				notificationPushNotification: Yup.boolean()
					.transform((value: boolean | null) => value === true)
					.required(),
				notificationPushNotificationHoursBefore: Yup.number()
					.transform((value: number) => (Number.isNaN(value) ? 0 : value))
					.when('notificationPushNotification', {
						is: true,
						then: Yup.number()
							.min(1, 'Please enter a value between 1 and 48')
							.max(48, 'Please enter a value between 1 and 48')
							.required('Please enter a value between 1 and 48'),
						otherwise: Yup.number().nullable(),
					}),
			})
			.required(),
	),
});

type EditProfileFormProps = {
	currentUser: GetCurrentUserResponse;
	myNotifications: GetMyNotificationsResponse;
	hasGoogle: boolean;
	hasTwitter: boolean;
};

const EditProfileForm: FC<EditProfileFormProps> = ({
	currentUser,
	myNotifications,
	hasGoogle,
	hasTwitter,
}) => {
	const {
		formState: { errors },
		handleSubmit,
		register,
		setValue,
		watch,
	} = useForm<FormData>({
		context: { myNotifications },
		defaultValues: {
			userEmail: currentUser.userEmail,
			userFirstName: currentUser.userFirstName ?? '',
			userLastName: currentUser.userLastName ?? '',
			userPaymentAccount: currentUser.userPaymentAccount ?? '',
			userPaymentType: currentUser.userPaymentType || undefined,
			userTeamName: currentUser.userTeamName ?? '',
			userPhone: currentUser.userPhone ?? '',
			userAutoPickStrategy: currentUser.userAutoPickStrategy,
			userAutoPicksLeft: currentUser.userAutoPicksLeft,
			notifications: myNotifications.map(notification => ({
				notificationType: notification.notificationDefinition.notificationType,
				notificationEmail: notification.notificationEmail,
				notificationEmailHoursBefore: notification.notificationEmailHoursBefore,
				notificationSMS: notification.notificationSMS,
				notificationSMSHoursBefore: notification.notificationSMSHoursBefore,
				notificationPushNotification: notification.notificationPushNotification,
				notificationPushNotificationHoursBefore:
					notification.notificationPushNotificationHoursBefore,
				hasValidPhone: !!currentUser.userPhone,
			})),
		},
		resolver: yupResolver(schema),
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const watchNotifications = watch('notifications');
	const watchPhone = watch('userPhone');

	console.log({ errors });

	useEffect(() => {
		watchNotifications.forEach((_, i) => {
			if (watchPhone.length > 9 && !errors.userPhone?.message) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-ignore
				setValue(`notifications.${i}.hasValidPhone` as const, true);
			} else {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-ignore
				setValue(`notifications.${i}.hasValidPhone` as const, false);
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-ignore
				setValue(`notifications.${i}.notificationSMS` as const, false);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [errors.userPhone?.message, watchPhone]);

	const onSubmit: SubmitHandler<FormData> = async data => {
		const {
			userEmail: UUUserEmail,
			userAutoPicksLeft: UUUserAutoPicksLeft,
			notifications,
			...profile
		} = data;

		setIsLoading(true);

		try {
			console.log(profile);
			await editProfile(
				profile,
				notifications.map(({ hasValidPhone, ...notification }) => notification),
			);

			//TODO: show success notification
		} catch (error) {
			console.error('Error during edit profile submit:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate>
			<div className="row mb-3">
				<div className="col">
					<div className="separator">Account Info</div>
					<label htmlFor="userEmail" className="form-label required">
						Email
					</label>
					<input
						aria-label="Email"
						className="form-control-plaintext"
						id="userEmail"
						readOnly
						type="email"
						{...register('userEmail', { required: true })}
					/>
					{errors.userEmail?.message && (
						<span className="text-danger fs-6">{errors.userEmail.message}</span>
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
						{...register('userFirstName', { required: true, minLength: 2 })}
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
						{...register('userLastName', { required: true, minLength: 2 })}
					/>
					{errors.userLastName?.message && (
						<span className="text-danger fs-6">{errors.userLastName.message}</span>
					)}
				</div>
			</div>
			<div className="row mb-3">
				<div className="col-md mb-3 mb-md-0">
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
				<div className="col-md">
					<label htmlFor="userPhone" className="form-label">
						Phone Number <span className="form-text">(optional)</span>
						&nbsp;
						<OverlayTrigger overlay={phonePopover} placement="auto" trigger="click">
							<button className={styles['btn-popover']} type="button">
								<FontAwesomeIcon icon={faQuestionCircle} size="sm" />
							</button>
						</OverlayTrigger>
					</label>
					<input
						aria-label="Phone Number"
						className={clsx('form-control', errors.userPhone?.message && 'is-invalid')}
						id="userPhone"
						placeholder="(999) 999-9999"
						type="tel"
						{...register('userPhone')}
					/>
					{errors.userPhone?.message && (
						<span className="text-danger fs-6">{errors.userPhone.message}</span>
					)}
				</div>
			</div>
			<div className="row mb-3">
				<div className="col-md mb-3 mb-md-0">
					<div className="separator">Payment Info</div>
					<label htmlFor="userPaymentType" className="form-label required">
						Payment Type
					</label>
					<select
						aria-label="Payment Type"
						className={clsx('form-select', errors.userPaymentType?.message && 'is-invalid')}
						id="userPaymentType"
						{...register('userPaymentType', { required: true })}
					>
						<option value="">-- Select a payment type --</option>
						<option value="Paypal">Paypal</option>
						<option value="Venmo">Venmo</option>
						<option value="Zelle">Zelle</option>
					</select>
					{errors.userPaymentType?.message && (
						<span className="text-danger fs-6">{errors.userPaymentType.message}</span>
					)}
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
						{...register('userPaymentAccount', { required: true })}
					/>
					{errors.userPaymentAccount?.message && (
						<span className="text-danger fs-6">{errors.userPaymentAccount.message}</span>
					)}
				</div>
				<div className="col-md">
					<div className="separator">Auto Picks</div>
					<label htmlFor="userAutoPicksLeft" className="form-label">
						Auto Picks Remaining&nbsp;
						<OverlayTrigger overlay={autoPickPopover} placement="auto" trigger="focus">
							<button className={styles['btn-popover']} type="button">
								<FontAwesomeIcon icon={faQuestionCircle} size="sm" />
							</button>
						</OverlayTrigger>
					</label>
					<input
						aria-label="Auto picks left"
						className="form-control-plaintext"
						id="userAutoPicksLeft"
						readOnly
						type="number"
						{...register('userAutoPicksLeft')}
					/>
					<label htmlFor="userAutoPickStrategy" className="d-block form-label required">
						Auto Pick Strategy
					</label>
					<div
						className="btn-group"
						role="group"
						aria-label="Auto pick strategy button group"
					>
						<input
							autoComplete="off"
							className={clsx(
								'btn-check',
								errors.userAutoPickStrategy?.message && 'is-invalid',
							)}
							id="userAutoPickStrategyHome"
							type="radio"
							value="Home"
							{...register('userAutoPickStrategy')}
						/>
						<label className="btn btn-outline-dark" htmlFor="userAutoPickStrategyHome">
							Home
						</label>
						<input
							autoComplete="off"
							className={clsx(
								'btn-check',
								errors.userAutoPickStrategy?.message && 'is-invalid',
							)}
							id="userAutoPickStrategyAway"
							type="radio"
							value="Away"
							{...register('userAutoPickStrategy')}
						/>
						<label className="btn btn-outline-dark" htmlFor="userAutoPickStrategyAway">
							Away
						</label>
						<input
							autoComplete="off"
							className={clsx(
								'btn-check',
								errors.userAutoPickStrategy?.message && 'is-invalid',
							)}
							id="userAutoPickStrategyRandom"
							type="radio"
							value="Random"
							{...register('userAutoPickStrategy')}
						/>
						<label className="btn btn-outline-dark" htmlFor="userAutoPickStrategyRandom">
							Random
						</label>
					</div>
					{errors.userAutoPickStrategy?.message && (
						<span className="text-danger fs-6">{errors.userAutoPickStrategy.message}</span>
					)}
				</div>
			</div>
			<div className="row mb-3">
				<div className="separator">Notifications</div>
				<div className="d-flex col-md-6 mb-3 mb-md-0">
					<div className="flex-grow-1">&nbsp;</div>
					<div
						className={clsx('text-center', styles['switch-col'])}
						title="Notifications sent to your email address"
					>
						Email
					</div>
					<div
						className={clsx('text-center', styles['switch-col'])}
						title="Notifications sent to your phone via text message"
					>
						SMS
					</div>
				</div>
				<div className="d-none d-md-flex col-md-6">
					<div className="flex-grow-1">&nbsp;</div>
					<div
						className={clsx('text-center', styles['switch-col'])}
						title="Notifications sent to your email address"
					>
						Email
					</div>
					<div
						className={clsx('text-center', styles['switch-col'])}
						title="Notifications sent to your phone via text message"
					>
						SMS
					</div>
				</div>
				{myNotifications.map((notification, i) => (
					<div
						className="d-flex flex-wrap col-md-6"
						key={`notification-${notification.notificationDefinition.notificationType}`}
					>
						<label
							htmlFor={notification.notificationDefinition.notificationType}
							className="form-label flex-grow-1"
						>
							{notification.notificationDefinition.notificationTypeDescription}
							{!!notification.notificationDefinition.notificationTypeTooltip && (
								<>
									{' '}
									<OverlayTrigger
										overlay={dynamicPopover(
											notification.notificationDefinition.notificationTypeTooltip,
											notification.notificationDefinition.notificationType,
											notification.notificationDefinition.notificationTypeDescription,
										)}
										placement="auto"
										trigger="focus"
									>
										<button className={styles['btn-popover']} type="button">
											<FontAwesomeIcon icon={faQuestionCircle} size="sm" />
										</button>
									</OverlayTrigger>
								</>
							)}
						</label>
						<div
							className={clsx(
								'form-check',
								'form-switch',
								'text-center',
								styles['switch-col'],
							)}
						>
							{notification.notificationDefinition.notificationTypeHasEmail && (
								<fieldset
									className="border-0"
									disabled={
										notification.notificationDefinition.notificationType === 'Essentials'
									}
								>
									<input
										aria-label={`Email for ${notification.notificationDefinition.notificationTypeDescription}`}
										className={clsx(
											'form-check-input',
											styles['no-float'],
											errors.notifications?.[i]?.notificationEmail?.message && 'is-invalid',
										)}
										id={`${notification.notificationDefinition.notificationType}Email`}
										key={`${notification.notificationDefinition.notificationType}Email`}
										type="checkbox"
										value="true"
										{...register(`notifications.${i}.notificationEmail` as const, {
											shouldUnregister: true,
										})}
									/>
								</fieldset>
							)}
							{errors.notifications?.[i]?.notificationEmail?.message && (
								<span className="text-danger fs-6">
									{errors.notifications?.[i]?.notificationEmail?.message}
								</span>
							)}
						</div>
						<div
							className={clsx(
								'form-check',
								'form-switch',
								'text-center',
								styles['switch-col'],
							)}
						>
							{notification.notificationDefinition.notificationTypeHasSMS && (
								<fieldset
									className="border-0"
									disabled={watchPhone?.length < 10 || !!errors.userPhone?.message}
								>
									<input
										aria-label={`SMS for ${notification.notificationDefinition.notificationTypeDescription}`}
										className={clsx(
											'form-check-input',
											styles['no-float'],
											errors.notifications?.[i]?.notificationSMS?.message && 'is-invalid',
										)}
										id={`${notification.notificationDefinition.notificationType}SMS`}
										key={`${notification.notificationDefinition.notificationType}SMS`}
										type="checkbox"
										value="true"
										{...register(`notifications.${i}.notificationSMS` as const, {
											shouldUnregister: true,
										})}
									/>
								</fieldset>
							)}
							{errors.notifications?.[i]?.notificationSMS?.message && (
								<span className="text-danger fs-6">
									{errors.notifications?.[i]?.notificationSMS?.message}
								</span>
							)}
						</div>
						{notification.notificationDefinition.notificationTypeHasHours &&
							(!!watchNotifications[i].notificationEmail ||
								!!watchNotifications[i].notificationSMS) && (
								<>
									<div className={clsx('w-100', styles['line-break'])}></div>
									<div className="flex-grow-1 text-end pe-3">
										Send how many hours before?
									</div>
									<div className={styles['switch-col']}>
										{!!watchNotifications[i].notificationEmail && (
											<input
												aria-label="Send email hours before"
												className={clsx(
													'form-control',
													styles['no-spinners'],
													errors.notifications?.[i]?.notificationEmailHoursBefore
														?.message && 'is-invalid',
												)}
												id={`${notification.notificationDefinition.notificationType}EmailHoursBefore`}
												max="48"
												min="1"
												type="number"
												{...register(
													`notifications.${i}.notificationEmailHoursBefore` as const,
													{
														shouldUnregister: true,
													},
												)}
											/>
										)}
										{errors.notifications?.[i]?.notificationEmailHoursBefore?.message && (
											<span className="text-danger fs-6">
												{errors.notifications?.[i]?.notificationEmailHoursBefore?.message}
											</span>
										)}
									</div>
									<div className={styles['switch-col']}>
										{!!watchNotifications[i].notificationSMS && (
											<input
												aria-label="Send SMS hours before"
												className={clsx(
													'form-control',
													styles['no-spinners'],
													errors.notifications?.[i]?.notificationSMSHoursBefore?.message &&
														'is-invalid',
												)}
												id={`${notification.notificationDefinition.notificationType}SMSHoursBefore`}
												max="48"
												min="1"
												type="number"
												{...register(
													`notifications.${i}.notificationSMSHoursBefore` as const,
													{
														shouldUnregister: true,
													},
												)}
											/>
										)}
										{errors.notifications?.[i]?.notificationSMSHoursBefore?.message && (
											<span className="text-danger fs-6">
												{errors.notifications?.[i]?.notificationSMSHoursBefore?.message}
											</span>
										)}
									</div>
								</>
							)}
					</div>
				))}
			</div>
			<div className="separator">Quick Login</div>
			<div>Linking your account makes logging in as simple as a single click</div>
			<div className="d-grid gap-2 d-md-flex mb-2">
				<SocialAuthButton isLinked={hasGoogle} type="Google" />
				<SocialAuthButton isLinked={hasTwitter} type="Twitter" />
			</div>
			<div className="d-grid border-top border-dark pt-3 mt-3">
				<button className="btn btn-primary" disabled={isLoading} type="submit">
					{isLoading ? 'Submitting...' : 'Save Changes'}
				</button>
			</div>
		</form>
	);
};

EditProfileForm.whyDidYouRender = true;

export default EditProfileForm;
