/*******************************************************************************
 * NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
 * Copyright (C) 2015-present Brian Duffey and Billy Alexander
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see {http://www.gnu.org/licenses/}.
 * Home: https://asitewithnoname.com/
 */
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useMemo,
	useEffect,
	useRef,
	useState,
	FormEvent,
	useContext,
} from 'react';
import Fuse from 'fuse.js';
import { useRouter } from 'next/router';
import { debounce } from 'throttle-debounce';

import { TitleContext } from './context';
import { MILLISECONDS_IN_SECOND, MINUTES_IN_HOUR, SECONDS_IN_MINUTE } from './constants';
import { getTimeRemaining, getTimeRemainingString } from './dates';

export const useCountdown = (countdownTo: Date | null): string => {
	const end = useRef<Date>(countdownTo ?? new Date());
	const interval = useRef<number>();
	const timeParts = getTimeRemaining(end.current);
	const [remaining, setRemaining] = useState<string>(getTimeRemainingString(timeParts));
	const { days, hours, minutes, seconds, total } = timeParts;

	useEffect(() => {
		setRemaining(getTimeRemainingString({ days, hours, minutes, seconds, total }));

		if (total < MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR) {
			interval.current = window.setInterval(() => {
				const timeParts = getTimeRemaining(end.current);

				setRemaining(getTimeRemainingString(timeParts));
			}, 1000);

			return () => window.clearInterval(interval.current);
		}

		return undefined;
	}, [days, hours, minutes, seconds, total]);

	return remaining;
};

type UseFuseResult<ListType> = {
	hits: Fuse.FuseResult<ListType>[];
	onSearch: (event: FormEvent<HTMLInputElement>) => void;
	query: string;
	setQuery: debounce<Dispatch<SetStateAction<string>>>;
};

export const useFuse = <ListType>(
	list: ListType[],
	fuseOptions: Fuse.IFuseOptions<ListType>,
): UseFuseResult<ListType> => {
	const [query, updateQuery] = useState<string>('');
	const fuse = useMemo(() => new Fuse(list, fuseOptions), [list, fuseOptions]);
	const hits = useMemo(
		() =>
			query.trim().length < 3
				? list.map((item, refIndex) => ({
					item,
					matches: [],
					refIndex,
					score: 1,
				}))
				: fuse.search(query),
		[fuse, list, query],
	);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const setQuery = useCallback(debounce(500, updateQuery), []);
	const onSearch = useCallback(
		(event: FormEvent<HTMLInputElement>) => setQuery(event.currentTarget.value.trim()),
		[setQuery],
	);

	return {
		hits,
		onSearch,
		query,
		setQuery,
	};
};

export const useObjectState = <T extends Record<string, unknown>>(
	state: T,
): [Readonly<T>, Dispatch<SetStateAction<T>>] => {
	const [value, setValue] = useState<T>(state);

	return [value as Readonly<T>, setValue];
};

// ts-prune-ignore-next
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

export const usePageTitle = (title: string): [string, Dispatch<SetStateAction<string>>] => {
	const [currentTitle, setTitle] = useContext(TitleContext);

	useEffect(() => {
		setTitle(title);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return [currentTitle, setTitle];
};

export const useWarningOnExit = (shouldWarn: boolean, warningText?: string): void => {
	const Router = useRouter();
	const message = warningText || 'Are you sure that you want to leave?';

	useEffect(() => {
		let isWarned = false;

		const routeChangeStart = (url: string) => {
			if (Router.asPath !== url && shouldWarn && !isWarned) {
				isWarned = true;

				if (window.confirm(message)) {
					Router.push(url);
				} else {
					isWarned = false;
					Router.events.emit('routeChangeError');
					Router.replace(Router, Router.asPath, { shallow: true });
					// eslint-disable-next-line no-throw-literal
					throw 'Abort route change. Please ignore this error.';
				}
			}
		};

		const beforeUnload = (e: BeforeUnloadEvent) => {
			if (shouldWarn && !isWarned) {
				const event = e || window.event;

				event.returnValue = message;

				return message;
			}

			return null;
		};

		Router.events.on('routeChangeStart', routeChangeStart);
		window.addEventListener('beforeunload', beforeUnload);
		Router.beforePopState(({ url }) => {
			if (Router.asPath !== url && shouldWarn && !isWarned) {
				isWarned = true;

				if (window.confirm(message)) {
					return true;
				} else {
					isWarned = false;
					window.history.pushState(null, '', url);
					Router.replace(Router, Router.asPath, { shallow: true });

					return false;
				}
			}

			return true;
		});

		return () => {
			Router.events.off('routeChangeStart', routeChangeStart);
			window.removeEventListener('beforeunload', beforeUnload);
			Router.beforePopState(() => {
				return true;
			});
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message, shouldWarn]);
};
