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
import Fuse from 'fuse.js';
import { GetStaticProps } from 'next';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import React, { FC, FormEvent } from 'react';
import { debounce } from 'throttle-debounce';

import CustomHead from '../components/CustomHead/CustomHead';
import { FuseHighlight } from '../components/FuseHighlight/FuseHighlight';
import { Faq, LogAction, Rule } from '../generated/graphql';
import { getSupportContent, writeSupportLog } from '../graphql/support';
import { TUser } from '../models/User';
import { useFuse } from '../utils/hooks';

const convertTextToAnchor = (text: string): string => text.toLowerCase().replace(/\W/g, '');

const createFAQList = (faqs: Fuse.FuseResult<Faq>[]): JSX.Element[] => {
	const faqList: JSX.Element[] = [];
	let category: null | string | undefined = '';

	for (const faq of faqs) {
		if (faq.item.supportContentCategory !== category) {
			category = faq.item.supportContentCategory;
			faqList.push(
				<h3 id={convertTextToAnchor(category || '')} key={`category-${category}`}>
					{category}
				</h3>,
			);
		}

		faqList.push(
			<details className="text-success ms-7 mb-3" key={`faq-${faq.item.supportContentID}`}>
				<summary className="text-dark ms-n5">
					<FuseHighlight attribute="supportContentDescription" hit={faq} />
				</summary>
				<FuseHighlight attribute="supportContentDescription2" hit={faq} />
			</details>,
		);
	}

	return faqList;
};

type SupportProps = {
	faqs: Faq[];
	rules: Rule[];
	slackLink: string;
	supportEmail: string;
};

const Support: FC<SupportProps> = ({ faqs, rules, slackLink, supportEmail }) => {
	const [session, loading] = useSession();
	const { hits: faqHits, onSearch: onFAQSearch } = useFuse(faqs, {
		includeMatches: true,
		includeScore: true,
		keys: [
			'supportContentDescription',
			'supportContentDescription2',
			'supportContentCategory',
			'supportContentKeywords',
		],
		minMatchCharLength: 3,
		threshold: 0.7,
	});
	const { hits: ruleHits, onSearch: onRuleSearch } = useFuse(rules, {
		includeMatches: true,
		includeScore: true,
		keys: ['supportContentDescription', 'supportContentKeywords'],
		minMatchCharLength: 3,
		threshold: 0.7,
	});

	const logSupportSearch = debounce(
		1000,
		false,
		async (value: string): Promise<void> => {
			try {
				await writeSupportLog(LogAction.SupportSearch, (session?.user as TUser)?.id, value);
			} catch (error) {
				console.error('Error when writing log for support search: ', { error, event });
			}
		},
	);

	const searchAll = async (event: FormEvent<HTMLInputElement>): Promise<void> => {
		onFAQSearch(event);
		onRuleSearch(event);
		await logSupportSearch(event.currentTarget.value);
	};

	const logSlackClick = async (): Promise<void> => {
		try {
			await writeSupportLog(
				LogAction.Slack,
				(session?.user as TUser)?.id,
				'User clicked Slack link',
			);
		} catch (error) {
			console.error('Error when writing log for slack link click: ', { error });
		}
	};

	return (
		<div className="h-100 row">
			<CustomHead title="Support/FAQs" />
			<div className="content-bg text-dark m-3 pt-5 pt-md-3 min-vh-100 pb-3 col" id="top">
				<div className="form-floating mb-2">
					<input
						autoComplete="off"
						autoFocus
						className="form-control"
						id="search"
						name="search"
						onChange={searchAll}
						onKeyUp={searchAll}
						placeholder="Search the help page"
						title="Search the help page"
						type="search"
					/>
					<label htmlFor="search">Search the help page</label>
				</div>
				<h2 className="text-center mb-0" id="rules">
					Rules
				</h2>
				<hr />
				{ruleHits.length > 0 ? (
					<ol>
						{ruleHits.map(ruleHit => (
							<li key={`rule-${ruleHit.item.supportContentID}`} className="mb-3">
								<FuseHighlight attribute="supportContentDescription" hit={ruleHit} />
							</li>
						))}
					</ol>
				) : (
					<div className="text-muted fst-italic">No results found</div>
				)}
				<h2 className="text-center mb-0" id="faq">
					FAQ
				</h2>
				<hr />
				{faqHits.length > 0 ? (
					createFAQList(faqHits)
				) : (
					<div className="text-muted fst-italic">No results found</div>
				)}
				<h2 className="text-center mb-0" id="contact">
					Contact Us
				</h2>
				<hr />
				<div className="text-center">
					<a href={slackLink} onClick={logSlackClick} target="slack">
						Join our Slack
					</a>
					<br />
					<br />
					Feel free to reach out for any questions or issues you may have
					<br />
					<a href={`mailto:${supportEmail}`}>{supportEmail}</a>
					<br />
					<br />
					{!session && !loading && (
						<Link href="/auth/login">
							<a className="btn btn-primary">Back to login</a>
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

// ts-prune-ignore-next
export const getStaticProps: GetStaticProps = async () => {
	const { faqs, rules, slackLink, supportEmail } = await getSupportContent();

	return {
		props: {
			faqs,
			rules,
			slackLink: slackLink.systemValueValue,
			supportEmail: supportEmail.systemValueValue,
		},
		revalidate: 3600,
	};
};

Support.whyDidYouRender = true;

// ts-prune-ignore-next
export default Support;
