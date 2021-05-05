import { gql } from 'graphql-request';

import {
	FinishRegistrationInput,
	MutationFinishRegistrationArgs,
	User,
} from '../generated/graphql';
import { fetcher } from '../utils/graphql';

type FinishRegistrationResponse = Pick<User, 'userDoneRegistering' | 'userTrusted'>;

// class FinishRegistrationResponse implements Partial<User> {
// 	userDoneRegistering!: boolean;
// 	userTrusted!: boolean;
// }

type TFinishRegistrationResult = {
	finishRegistration: FinishRegistrationResponse;
};

const finishRegistrationMutation = gql`
	mutation FinishRegistration($data: FinishRegistrationInput!) {
		finishRegistration(data: $data) {
			userDoneRegistering
			userTrusted
		}
	}
`;

export const finishRegistration = (
	data: FinishRegistrationInput,
): Promise<TFinishRegistrationResult> =>
	fetcher<TFinishRegistrationResult, MutationFinishRegistrationArgs>(
		finishRegistrationMutation,
		{
			data,
		},
	);
