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
import React, { FC, useMemo, useState } from 'react';

import { EmailType } from '../../generated/graphql';
import { emailPreviewFetcher } from '../../utils/api';

type PreviewAdminEmailProps = {
	emailType: EmailType;
	payload: {
		body: string;
		preview: string;
		subject: string;
	};
	userFirstName: string;
};

const PreviewAdminEmail: FC<PreviewAdminEmailProps> = ({
	emailType,
	payload,
	userFirstName,
}) => {
	const [previewTab, setPreviewTab] = useState<'html' | 'subject' | 'text'>('html');
	const { body, preview, subject } = payload;
	const [htmlPreview, setHtmlPreview] = useState<string>('');
	const [subjectPreview, setSubjectPreview] = useState<string>('');
	const [textPreview, setTextPreview] = useState<string>('');

	useMemo(
		async (): Promise<void> => {
			if (!body || !subject || !preview) {
				setHtmlPreview('');

				return;
			}

			const html = await emailPreviewFetcher(emailType, {
				body,
				preview,
				subject,
				emailFormat: 'html',
				userFirstName,
			});

			setHtmlPreview(html);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[body, preview, subject],
	);
	useMemo(
		async (): Promise<void> => {
			if (!subject) {
				setSubjectPreview('');

				return;
			}

			const sub = await emailPreviewFetcher(emailType, {
				body,
				preview,
				subject,
				emailFormat: 'subject',
				userFirstName,
			});

			setSubjectPreview(sub);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[body, preview, subject],
	);
	useMemo(
		async (): Promise<void> => {
			if (!body) {
				setTextPreview('');

				return;
			}

			const text = await emailPreviewFetcher(emailType, {
				body,
				preview,
				subject,
				emailFormat: 'text',
				userFirstName,
			});

			setTextPreview(text);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[body, preview, subject],
	);

	return (
		<div className="mb-5 col-12 bg-white p-2 rounded">
			<ul className="nav nav-tabs" id="emailPreviews" role="tablist">
				<li className="nav-item" role="presentation">
					<button
						aria-controls="html"
						aria-selected={previewTab === 'html'}
						className={clsx('nav-link', previewTab === 'html' && 'active')}
						id="html-tab"
						onClick={() => setPreviewTab('html')}
						role="tab"
						type="button"
					>
						HTML
					</button>
				</li>
				<li className="nav-item" role="presentation">
					<button
						aria-controls="subject"
						aria-selected={previewTab === 'subject'}
						className={clsx('nav-link', previewTab === 'subject' && 'active')}
						id="subject-tab"
						onClick={() => setPreviewTab('subject')}
						role="tab"
						type="button"
					>
						Subject
					</button>
				</li>
				<li className="nav-item" role="presentation">
					<button
						aria-controls="text"
						aria-selected={previewTab === 'text'}
						className={clsx('nav-link', previewTab === 'text' && 'active')}
						id="text-tab"
						onClick={() => setPreviewTab('text')}
						role="tab"
						type="button"
					>
						Text
					</button>
				</li>
			</ul>
			<div className="tab-content" id="emailPreviewsContent">
				<div
					aria-labelledby="html-tab"
					className={clsx('tab-pane', 'fade', previewTab === 'html' && 'show active')}
					dangerouslySetInnerHTML={{ __html: htmlPreview }}
					id="html"
					role="tabpanel"
				></div>
				<div
					aria-labelledby="subject-tab"
					className={clsx('tab-pane', 'fade', previewTab === 'subject' && 'show active')}
					id="subject"
					role="tabpanel"
				>
					{subjectPreview}
				</div>
				<div
					aria-labelledby="text-tab"
					className={clsx('tab-pane', 'fade', previewTab === 'text' && 'show active')}
					id="text"
					role="tabpanel"
				>
					{textPreview}
				</div>
			</div>
		</div>
	);
};

PreviewAdminEmail.whyDidYouRender = true;

export default PreviewAdminEmail;
