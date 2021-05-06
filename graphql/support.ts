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
import { gql } from 'graphql-request';

import { Faq, Rule, Scalars, SystemValue } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

type GetSupportContentVars = {
	Name1: Scalars['String'];
	Name2: Scalars['String'];
};

type GetSupportContentResponse = {
	faqs: Array<
		Pick<
			Faq,
			| 'supportContentID'
			| 'supportContentType'
			| 'supportContentCategory'
			| 'supportContentDescription'
			| 'supportContentDescription2'
			| 'supportContentKeywords'
		>
	>;
	rules: Array<
		Pick<
			Rule,
			| 'supportContentID'
			| 'supportContentType'
			| 'supportContentDescription'
			| 'supportContentKeywords'
		>
	>;
	slackLink: Pick<SystemValue, 'systemValueID' | 'systemValueName' | 'systemValueValue'>;
	supportEmail: Pick<SystemValue, 'systemValueID' | 'systemValueName' | 'systemValueValue'>;
};

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

export const getSupportContent = async (): Promise<GetSupportContentResponse> => {
	const vars: GetSupportContentVars = {
		Name1: 'SupportEmail',
		Name2: 'SlackLink',
	};

	return await fetcher<GetSupportContentResponse, GetSupportContentVars>(query, vars);
};
