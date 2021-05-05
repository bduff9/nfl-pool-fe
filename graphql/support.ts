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
