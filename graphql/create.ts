import { gql } from 'graphql-request';
import useSWR, { SWRResponse } from 'swr';

import { User } from '../generated/graphql';
import { fetcher } from '../utils/graphql';

const getCurrentUserQuery = gql`
	query CurrentUser {
		getCurrentUser {
			userID
			userName
			userEmail
			userFirstName
			userLastName
			userTeamName
			userPaymentAccount
			userPaymentType
			userPlaysSurvivor
			userReferredByRaw
			userTrusted
		}
		hasGoogle: hasSocialLinked(Type: "google")
		hasTwitter: hasSocialLinked(Type: "twitter")
	}
`;

export type GetCurrentUserResponse = Pick<
	User,
	| 'userID'
	| 'userName'
	| 'userEmail'
	| 'userFirstName'
	| 'userLastName'
	| 'userTeamName'
	| 'userPaymentType'
	| 'userPaymentAccount'
	| 'userPlaysSurvivor'
	| 'userReferredByRaw'
	| 'userTrusted'
>;

export const useFinishRegistrationQuery = (): SWRResponse<
	{
		getCurrentUser: GetCurrentUserResponse;
		hasGoogle: boolean;
		hasTwitter: boolean;
	},
	unknown
> =>
	useSWR<{
		getCurrentUser: GetCurrentUserResponse;
		hasGoogle: boolean;
		hasTwitter: boolean;
	}>(getCurrentUserQuery, fetcher);
