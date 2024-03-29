import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

import Unauthenticated from '../../components/Unauthenticated/Unauthenticated';

describe('Unauthenticated', (): void => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let wrapper: ShallowWrapper<any, any, any>;

	beforeEach((): void => {
		wrapper = shallow(
			<Unauthenticated>
				<div />
			</Unauthenticated>,
		);
	});

	it('exists', (): void => {
		expect(wrapper.exists()).toBe(true);
	});
});
