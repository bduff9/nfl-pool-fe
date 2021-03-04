import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

export const useObjectState = <T extends Record<any, any>>(
	state: T,
): [Readonly<T>, Dispatch<SetStateAction<T>>] => {
	const [value, setValue] = useState<T>(state);

	return [value as Readonly<T>, setValue];
};

export const useInterval = (callback: () => void, delay: number): void => {
	const savedCallback = useRef<() => void>();

	useEffect((): void => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect((): (() => void) | undefined => {
		const tick = (): void => {
			if (savedCallback.current) savedCallback.current();
		};

		if (delay !== null) {
			const id = setInterval(tick, delay);

			return (): void => clearInterval(id);
		}

		return undefined;
	}, [delay]);
};
