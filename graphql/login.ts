import { gql } from 'graphql-request';

import { QueryGetSystemValueArgs, SystemValue } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

type GetLoginValuesResponse = {
	getSystemValue: Pick<
		SystemValue,
		'systemValueID' | 'systemValueName' | 'systemValueValue'
	>;
};

const query = gql`
	query GetPoolYear($Name: String!) {
		getSystemValue(Name: $Name) {
			systemValueID
			systemValueName
			systemValueValue
		}
	}
`;

export const getLoginValues = async (): Promise<GetLoginValuesResponse> => {
	const vars: QueryGetSystemValueArgs = { Name: 'YearUpdated' };

	return await fetcher<GetLoginValuesResponse, QueryGetSystemValueArgs>(query, vars);
};
