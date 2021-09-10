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
import { ClientError } from 'graphql-request';
import dynamic from 'next/dynamic';
import React, { FC, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { EmailSendTo, EmailType } from '../../generated/graphql';
import { sendAdminEmail } from '../../graphql/sendAdminEmails';
import { logger } from '../../utils/logging';
import PreviewAdminEmail from '../PreviewAdminEmail/PreviewAdminEmail';
import { ErrorIcon, SuccessIcon } from '../ToastUtils/ToastIcons';

import styles from './SendAdminEmails.module.scss';

import 'react-quill/dist/quill.bubble.css';

const ReactQuill = dynamic(
	() => {
		return import('react-quill');
	},
	{ ssr: false },
);

const quillModules = {
	toolbar: [
		['bold', 'italic', 'underline', 'strike'], // toggled buttons
		['blockquote', 'code-block', 'code'],

		// [{ header: 1 }, { header: 2 }], // custom button values
		[{ list: 'ordered' }, { list: 'bullet' }],
		[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
		[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
		[{ direction: 'rtl' }], // text direction

		[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
		[{ header: [1, 2, 3, 4, 5, 6, false] }],

		[{ color: [] }, { background: [] }], // dropdown with defaults from theme
		[{ font: [] }],
		[{ align: [] }],

		['clean'], // remove formatting button
	],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false,
	},
};

const quillFormats = [
	'align',
	'background',
	'blockquote',
	'bold',
	'bullet',
	'code',
	'code-block',
	'color',
	'direction',
	'font',
	'header',
	'image',
	'indent',
	'italic',
	'link',
	'list',
	'script',
	'size',
	'strike',
	'underline',
	'video',
];

const SendAdminEmails: FC = () => {
	const [emailType, setEmailType] = useState<string>('');
	const [sendTo, setSendTo] = useState<string>('');
	const [userEmail, setUserEmail] = useState<string>('');
	const [userFirstName, setUserFirstName] = useState<string>('');
	const [preview, setPreview] = useState<string>('');
	const [subject, setSubject] = useState<string>('');
	const [body, setBody] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const previewPayload = useRef({ body, preview, subject });

	const updatePreview = async (): Promise<void> => {
		previewPayload.current = {
			body,
			preview,
			subject,
		};
	};

	const onSubmit = async (): Promise<void> => {
		if (!emailType) {
			toast.error('Missing email type', {
				icon: ErrorIcon,
			});

			return;
		}

		if (!sendTo) {
			toast.error('Missing send to', {
				icon: ErrorIcon,
			});

			return;
		}

		if (sendTo === 'New' && !userEmail) {
			toast.error(`Missing user's email`, {
				icon: ErrorIcon,
			});

			return;
		}

		if (emailType === EmailType.Custom && (!body || !preview || !subject)) {
			toast.error('Missing custom email content', {
				icon: ErrorIcon,
			});

			return;
		}

		try {
			setLoading(true);

			await toast.promise(
				sendAdminEmail(
					emailType,
					sendTo,
					userEmail || null,
					userFirstName || null,
					subject && preview && body ? JSON.stringify({ body, preview, subject }) : null,
				),
				{
					error: {
						icon: ErrorIcon,
						render ({ data }) {
							logger.debug({ text: '~~~~~~~ERROR DATA: ', data });

							if (data instanceof ClientError) {
								//TODO: toast all errors, not just first
								return data.response.errors?.[0]?.message;
							}

							return 'Something went wrong, please try again';
						},
					},
					pending: 'Sending...',
					success: {
						icon: SuccessIcon,
						render () {
							return 'Email has been sent successfully!';
						},
					},
				},
			);

			setUserEmail('');
			setUserFirstName('');
			setSubject('');
			setPreview('');
			setBody('');
		} catch (error) {
			logger.error({
				text: 'Error when sending email: ',
				body,
				emailType,
				error,
				preview,
				sendTo,
				subject,
				userEmail,
				userFirstName,
			});
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
							<option value={EmailType.Custom}>Custom</option>
							<option value={EmailType.Interest}>Interest</option>
							<option value={EmailType.InterestFinal}>Interest - Final</option>
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
							{Object.keys(EmailSendTo).map(sendTo => (
								<option key={`send-to-${sendTo}`} value={sendTo}>
									{sendTo}
								</option>
							))}
						</select>
					</div>
					{sendTo === 'New' && (
						<>
							<div className={clsx('mb-3', 'col-12', 'col-md-6')}>
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
							<div className={clsx('mb-3', 'col-12', 'col-md-6')}>
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
						</>
					)}
					{emailType === EmailType.Custom && (
						<>
							<div className={clsx('mb-3', 'col-12', 'col-md-6')}>
								<div className={clsx('mb-3', 'col-12')}>
									<label htmlFor="subject" className="form-label">
										Subject
									</label>
									<input
										className="form-control"
										id="subject"
										onBlur={updatePreview}
										onChange={event => setSubject(event.currentTarget.value)}
										placeholder="Interesting email subject"
										type="text"
										value={subject}
									/>
								</div>
								<div className={clsx('mb-3', 'col-12')}>
									<label htmlFor="preview" className="form-label">
										Preview
									</label>
									<input
										className="form-control"
										id="preview"
										onBlur={updatePreview}
										onChange={event => setPreview(event.currentTarget.value)}
										placeholder="Helpful email preview text"
										type="text"
										value={preview}
									/>
								</div>
								<div className={clsx('mb-3', 'col-12', styles.editor)}>
									<label htmlFor="body" className="form-label">
										Body
									</label>
									<ReactQuill
										bounds={`.${styles.editor}`}
										className="bg-white border rounded"
										formats={quillFormats}
										modules={quillModules}
										onBlur={updatePreview}
										onChange={setBody}
										placeholder="Intriguing email content"
										theme="bubble"
										value={body}
									/>
								</div>
							</div>
							<div className={clsx('mb-3', 'col-12', 'col-md-6')}>
								<PreviewAdminEmail
									emailType={emailType}
									payload={previewPayload.current}
									userFirstName={userFirstName || 'USER'}
								/>
							</div>
						</>
					)}
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
