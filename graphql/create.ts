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

type GetCurrentUserResponse = Pick<
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

// class GetCurrentUserResponse implements Partial<User> {
// 	userID!: number;
// 	userName!: null | string;
// 	userEmail!: string;
// 	userFirstName!: null | string;
// 	userLastName!: null | string;
// 	userTeamName!: null | string;
// 	userPaymentType!: PaymentType;
// 	userPaymentAccount!: null | string;
// 	userPlaysSurvivor!: boolean;
// 	userReferredByRaw!: null | string;
// 	userTrusted!: boolean | null;
// }

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
