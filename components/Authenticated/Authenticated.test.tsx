import { shallow, ShallowWrapper } from 'enzyme';
import { useRouter } from 'next/router';
import React from 'react';

jest.mock('next/router', () => ({
	useRouter: jest.fn(),
}));

import Authenticated from './Authenticated';

describe('Authenticated', (): void => {
	const mockRouterPush = jest.fn();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let wrapper: ShallowWrapper<any, any, any>;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(useRouter as any).mockImplementation(() => ({
		push: mockRouterPush,
	}));

	beforeEach((): void => {
		wrapper = shallow(<Authenticated />);
	});

	it('exists', (): void => {
		expect(wrapper.exists()).toBe(true);
	});
});
