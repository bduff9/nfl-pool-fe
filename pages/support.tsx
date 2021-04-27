import Fuse from 'fuse.js';
import { gql } from 'graphql-request';
import { GetStaticProps } from 'next';
import { useSession } from 'next-auth/client';
import Head from 'next/head';
import Link from 'next/link';
import React, { FC, FormEvent } from 'react';

import { FuseHighlight } from '../components/FuseHighlight/FuseHighlight';
import { Faq, Rule, Scalars } from '../generated/graphql';
import { getPageTitle } from '../utils';
import { fetcher } from '../utils/graphql';
import { useFuse, usePageTitle } from '../utils/hooks';

const createFAQList = (faqs: Fuse.FuseResult<Faq>[]): JSX.Element[] => {
	const faqList: JSX.Element[] = [];
	let category: null | string | undefined = '';

	for (const faq of faqs) {
		if (faq.item.supportContentCategory !== category) {
			category = faq.item.supportContentCategory;
			faqList.push(<h3 key={`category-${category}`}>{category}</h3>);
		}

		faqList.push(
			<details
				className="text-success ms-7"
				key={`faq-${faq.item.supportContentID}`}
			>
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

const Support: FC<SupportProps> = ({
	faqs,
	rules,
	slackLink,
	supportEmail,
}) => {
	const [title] = usePageTitle('Support/FAQs');
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

	const searchAll = (event: FormEvent<HTMLInputElement>) => {
		onFAQSearch(event);
		onRuleSearch(event);
	};

	return (
		<div className="h-100 row">
			<Head>
				<title>{getPageTitle(title)}</title>
			</Head>
			<div
				className="content-bg text-dark m-3 pt-5 pt-md-3 min-vh-100 pb-3 col"
				id="top"
			>
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
							<li key={`rule-${ruleHit.item.supportContentID}`}>
								<FuseHighlight
									attribute="supportContentDescription"
									hit={ruleHit}
								/>
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
					<a href={slackLink} target="slack">
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
	const query = gql`
		query GetSupportContent($Name1: String!, $Name2: String!) {
			supportEmail: getSystemValue(Name: $Name1) {
				systemValueID
				systemValueName
				systemValueValue
			}
			slackLink: getSystemValue(Name: $Name2) {
				systemValueID
				systemValueName
				systemValueValue
			}
			faqs: getFAQs {
				supportContentID
				supportContentType
				supportContentCategory
				supportContentDescription
				supportContentDescription2
				supportContentKeywords
			}
			rules: getRules {
				supportContentID
				supportContentType
				supportContentDescription
				supportContentKeywords
			}
		}
	`;
	const data = await fetcher<
		{
			supportEmail: {
				systemValueID: number;
				systemValueName: string;
				systemValueValue: null | string;
			};
			slackLink: {
				systemValueID: number;
				systemValueName: string;
				systemValueValue: null | string;
			};
			faqs: Faq[];
			rules: Rule[];
		},
		{ Name1: Scalars['String']; Name2: Scalars['String'] }
	>(query, {
		Name1: 'SupportEmail',
		Name2: 'SlackLink',
	});

	return {
		props: {
			faqs: data.faqs,
			rules: data.rules,
			slackLink: data.slackLink.systemValueValue,
			supportEmail: data.supportEmail.systemValueValue,
		},
		revalidate: 3600,
	};
};

Support.whyDidYouRender = true;

// ts-prune-ignore-next
export default Support;
