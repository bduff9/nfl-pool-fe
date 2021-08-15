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
import React, { Dispatch, FC, useState } from 'react';

import { sendAdminEmail } from '../../graphql/sendAdminEmails';

type SendAdminEmailsProps = {
	setErrorMessage: Dispatch<React.SetStateAction<string | null>>;
	setSuccessMessage: Dispatch<React.SetStateAction<string | null>>;
};

const SendAdminEmails: FC<SendAdminEmailsProps> = ({
	setErrorMessage,
	setSuccessMessage,
}) => {
	const [emailType, setEmailType] = useState<string>('');
	const [sendTo, setSendTo] = useState<string>('');
	const [userEmail, setUserEmail] = useState<string>('');
	const [userFirstName, setUserFirstName] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const onSubmit = async (): Promise<void> => {
		try {
			setLoading(true);
			await sendAdminEmail(emailType, sendTo, userEmail || null, userFirstName || null);
			setSuccessMessage('Email has been sent successfully!');
		} catch (error) {
			console.error('Error when sending email: ', {
				emailType,
				error,
				sendTo,
				userEmail,
				userFirstName,
			});
			setErrorMessage(
				error?.response?.errors?.[0]?.message ?? 'Something went wrong, please try again',
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="row">
			<div className="col-12 content-bg p-4 border border-secondary rounded">
				<h1 className="text-center">Send Email</h1>
				<div className="row">
					<div className="mb-3 col-12 col-md-6">
						<label htmlFor="emailType" className="form-label">
							Which email?
						</label>
						<select
							className="form-select"
							id="emailType"
							onChange={event => setEmailType(event.currentTarget.value)}
							value={emailType}
						>
							<option value="">-- Select an email type --</option>
							<option value="interest">Interest</option>
						</select>
					</div>
					<div className="mb-3 col-12 col-md-6">
						<label htmlFor="sendTo" className="form-label">
							Send to
						</label>
						<select
							className="form-select"
							id="sendTo"
							onChange={event => setSendTo(event.currentTarget.value)}
							value={sendTo}
						>
							<option value="">-- Select send to group --</option>
							<option value="All">All</option>
							<option value="New">New</option>
						</select>
					</div>
					<div
						className={clsx('mb-3', 'col-12', 'col-md-6', sendTo !== 'New' && 'invisible')}
					>
						<label htmlFor="userEmail" className="form-label">
							Email
						</label>
						<input
							className="form-control"
							id="userEmail"
							onChange={event => setUserEmail(event.currentTarget.value)}
							placeholder="someone@email.com"
							type="email"
							value={userEmail}
						/>
					</div>
					<div
						className={clsx('mb-3', 'col-12', 'col-md-6', sendTo !== 'New' && 'invisible')}
					>
						<label htmlFor="userFirstName" className="form-label">
							First name
						</label>
						<input
							className="form-control"
							id="userFirstName"
							onChange={event => setUserFirstName(event.currentTarget.value)}
							placeholder="John"
							type="text"
							value={userFirstName}
						/>
					</div>
					<div className="col-12 d-grid gap-2">
						<button
							className="btn btn-primary"
							disabled={loading}
							onClick={onSubmit}
							type="button"
						>
							{loading ? (
								<>
									<span
										className="spinner-grow spinner-grow-sm d-none d-md-inline-block"
										role="status"
										aria-hidden="true"
									></span>
									Sending...
								</>
							) : (
								'Send Email'
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

SendAdminEmails.whyDidYouRender = true;

export default SendAdminEmails;
