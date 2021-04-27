import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons/faQuestionCircle';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { FC } from 'react';
// eslint-disable-next-line import/named
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Authenticated from '../../components/Authenticated/Authenticated';
import { TUser } from '../../models/User';
import { getPageTitle } from '../../utils';
import {
	isSignedInSSR,
	isDoneRegisteringSSR,
	UNAUTHENTICATED_REDIRECT,
	IS_DONE_REGISTERING_REDIRECT,
} from '../../utils/auth.server';
import { usePageTitle } from '../../utils/hooks';
import { PaymentType } from '../../generated/graphql';
import { ACCOUNT_TYPES } from '../../utils/constants';

type FormData = {
	userEmail: string;
	userFirstName: string;
	userLastName: string;
	userName: string;
	userPaymentAccount: string;
	userPaymentType: PaymentType;
	userPlaysSurvivor: boolean;
	userReferredByRaw: string;
	userTeamName: null | string;
};

const schema = Yup.object().shape({
	userFirstName: Yup.string()
		.min(2, 'Please enter your first name')
		.required('Please enter your first name'),
	userLastName: Yup.string()
		.min(2, 'Please enter your surname')
		.required('Please enter your surname'),
	userName: Yup.string(),
	userTeamName: Yup.string(),
	userReferredByRaw: Yup.string()
		.matches(/\s/, 'Please input the full name of the person that invited you')
		.required('Please input the full name of the person that invited you'),
	userPaymentType: Yup.string()
		.oneOf(ACCOUNT_TYPES, 'Please select a valid account type')
		.required('Please select an account type'),
	userPaymentAccount: Yup.string().when('userPaymentType', {
		is: (val: string): boolean => ACCOUNT_TYPES.indexOf(val) === -1,
		then: Yup.string().max(0),
		otherwise: Yup.string().when('userPaymentType', {
			is: 'Venmo',
			then: Yup.string().required('Please enter your Venmo user ID'),
			otherwise: Yup.string()
				.email('Please enter your account email address')
				.required('Please enter your account email address'),
		}),
	}),
});

type CreateProfileProps = {
	user: TUser;
};

const CreateProfile: FC<CreateProfileProps> = () => {
	const [title] = usePageTitle('Finish Registration');
	//TODO: call useSWR here for user data
	const {
		register,
		handleSubmit,
		//formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			userPlaysSurvivor: false,
			userPaymentAccount: '',
			userReferredByRaw: '',
			userTeamName: '',
		},
		resolver: yupResolver(schema),
	});

	const onSubmit: SubmitHandler<FormData> = data => {
		//TODO: call mutation on submit
		console.log(data);
	};

	return (
		<Authenticated>
			<Head>
				<title>{getPageTitle(title)}</title>
			</Head>
			<div className="content-bg text-dark my-3 mx-2 pt-5 pt-md-3 min-vh-100 pb-4 col">
				{/* TODO: put loader here while data is loading */}
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
						</div>
					</div>
					<div className="row mb-3">
						<div className="col-md mb-3 mb-md-0">
							<label htmlFor="userFirstName" className="form-label required">
								First Name
							</label>
							<input
								aria-label="First Name"
								className="form-control"
								id="userFirstName"
								type="text"
								{...register('userFirstName')}
							/>
						</div>
						<div className="col-md">
							<label htmlFor="userLastName" className="form-label required">
								Last Name
							</label>
							<input
								aria-label="Last Name"
								className="form-control"
								id="userLastName"
								type="text"
								{...register('userLastName')}
							/>
						</div>
					</div>
					<div className="row mb-3">
						<div className="col">
							<label htmlFor="userTeamName" className="form-label">
								Team Name <span className="form-text">(optional)</span>
							</label>
							<input
								aria-label="Team Name"
								className="form-control"
								id="userTeamName"
								type="text"
								{...register('userTeamName')}
							/>
						</div>
					</div>
					<div className="row mb-3">
						<div className="col">
							<label
								htmlFor="userReferredByRaw"
								className="form-label required"
							>
								Who referred you to play?
							</label>
							<input
								aria-label="Referred By"
								className="form-control"
								id="userReferredByRaw"
								placeholder="Enter their full name for immediate access"
								type="text"
								{...register('userReferredByRaw')}
							/>
						</div>
					</div>
					<div className="row mb-3">
						<div className="col">
							<label
								htmlFor="userPlaysSurvivor"
								className="form-label required"
							>
								Add on survivor game?&nbsp;
								{/* TODO: add tooltip/popover */}
								<FontAwesomeIcon icon={faQuestionCircle} size="sm" />
							</label>
							<div
								className="btn-group ms-4"
								role="group"
								aria-label="Play survivor game?"
							>
								<input
									autoComplete="off"
									className="btn-check"
									checked
									id="userPlaysSurvivorN"
									type="radio"
									value="false"
									{...register('userPlaysSurvivor')}
								/>
								<label
									className="btn btn-outline-secondary"
									htmlFor="userPlaysSurvivorN"
								>
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
								<label
									className="btn btn-outline-secondary"
									htmlFor="userPlaysSurvivorY"
								>
									Yes
								</label>
							</div>
						</div>
					</div>
					<div className="row mb-3">
						<div className="col-md mb-3 mb-md-0">
							<label htmlFor="userPaymentType" className="form-label required">
								Payment Type
							</label>
							<select
								aria-label="Payment Type"
								className="form-select"
								id="userPaymentType"
								{...register('userPaymentType')}
							>
								<option value="">-- Select a payment type --</option>
								<option value="Paypal">Paypal</option>
								<option value="Venmo">Venmo</option>
								<option value="Zelle">Zelle</option>
							</select>
						</div>
						<div className="col-md">
							<label
								htmlFor="userPaymentAccount"
								className="form-label required"
							>
								Payment Account&nbsp;
								<FontAwesomeIcon icon={faQuestionCircle} size="sm" />
							</label>
							<input
								aria-label="Payment Account"
								className="form-control"
								id="userPaymentAccount"
								type="text"
								{...register('userPaymentAccount')}
							/>
						</div>
					</div>
					<div className="d-grid">
						<button className="btn btn-primary" type="submit">
							Register
						</button>
					</div>
				</form>
			</div>
		</Authenticated>
	);
};

CreateProfile.whyDidYouRender = true;

// ts-prune-ignore-next
export const getServerSideProps: GetServerSideProps = async context => {
	const session = await isSignedInSSR(context);

	if (!session) {
		return UNAUTHENTICATED_REDIRECT;
	}

	const isDoneRegistering = isDoneRegisteringSSR(session);

	if (isDoneRegistering) {
		return IS_DONE_REGISTERING_REDIRECT;
	}

	const { user } = session;

	return { props: { user } };
};

// ts-prune-ignore-next
export default CreateProfile;
