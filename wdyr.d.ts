/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import type { WhyDidYouRenderComponentMember } from '@welldone-software/why-did-you-render';

declare module 'react' {
	// eslint-disable-next-line @typescript-eslint/ban-types
	interface VoidFunctionComponent<P = {}> {
		whyDidYouRender?: WhyDidYouRenderComponentMember;
	}
}
