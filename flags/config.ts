import type { Configuration } from '@happykit/flags/config';

import { NEXT_PUBLIC_HAPPYKIT_FLAG_KEY } from '../utils/constants';

if (!NEXT_PUBLIC_HAPPYKIT_FLAG_KEY) {
	throw Error('Missing happykit feature flag key from env!');
}

export type AppFlags = { enableLogRocket?: boolean };

export const config: Configuration<AppFlags> = {
	envKey: NEXT_PUBLIC_HAPPYKIT_FLAG_KEY,

	// You can provide defaults flag values here
	defaultFlags: {},
};
