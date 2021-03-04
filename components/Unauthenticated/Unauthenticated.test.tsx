import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

import Unauthenticated from './Unauthenticated';

describe('Unauthenticated', (): void => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let wrapper: ShallowWrapper<any, any, any>;

	beforeEach((): void => {
		wrapper = shallow(<Unauthenticated />);
	});

	it('exists', (): void => {
		expect(wrapper.exists()).toBe(true);
	});
});
