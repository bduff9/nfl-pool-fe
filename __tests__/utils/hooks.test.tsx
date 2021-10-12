import { shallow } from 'enzyme';
import React, { FC } from 'react';
import { act } from 'react-dom/test-utils';

import { useObjectState } from '../../utils/hooks';

// eslint-disable-next-line @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any
const mountReactHook = (hook: Function, ...args: any[]) => {
	// eslint-disable-next-line @typescript-eslint/ban-types
	const Component: FC = ({ children }) => (children as Function)(hook(...args));
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const componentHook: Record<any, any> = {};
	let componentMount;

	act(() => {
		componentMount = shallow(
			<Component>
				{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
				{(hookValues: any) => {
					Object.assign(componentHook, hookValues);

					return null;
				}}
			</Component>,
		);
	});

	return { componentMount, componentHook };
};

describe('useObjectState', () => {
	it('sets state for object', () => {
		const obj = { x: 1, y: 2 };
		const obj2 = { x: 3, y: 4 };
		const component = mountReactHook(useObjectState, obj);
		const hook = component.componentHook;

		expect(hook[0]).toBe(obj);

		act(() => {
			hook[1](obj2);
		});

		expect(hook[0]).toBe(obj2);
	});

	it('sets state for array', () => {
		const arr = [1, 2];
		const arr2 = [3, 4];
		const component = mountReactHook(useObjectState, arr);
		const hook = component.componentHook;

		expect(hook[0]).toBe(arr);

		act(() => {
			hook[1](arr2);
		});

		expect(hook[0]).toBe(arr2);
	});
});
