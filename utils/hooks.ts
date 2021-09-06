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
import Fuse from 'fuse.js';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import React, {
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
import { toast } from 'react-toastify';
import { debounce } from 'throttle-debounce';
import type { Workbox } from 'workbox-window';
import { WorkboxLifecycleEvent } from 'workbox-window/utils/WorkboxEvent';

import SWUpdatedToast from '../components/ToastUtils/SWUpdatedToast';
import {
	LargeWarningIcon,
	SuccessIcon,
	WarningIcon,
} from '../components/ToastUtils/ToastIcons';

import { TitleContext } from './context';
import { MILLISECONDS_IN_SECOND, MINUTES_IN_HOUR, SECONDS_IN_MINUTE } from './constants';
import { getTimeRemaining, getTimeRemainingString } from './dates';
import { logger } from './logging';

export const useCountdown = (countdownTo: Date | null): string => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const end = useMemo(() => countdownTo ?? new Date(), [countdownTo?.getTime() ?? null]);
	const interval = useRef<number>();
	const timeParts = getTimeRemaining(end);
	const [remaining, setRemaining] = useState<string>(getTimeRemainingString(timeParts));
	const { days, hours, minutes, seconds, total } = timeParts;

	useEffect(() => {
		setRemaining(getTimeRemainingString({ days, hours, minutes, seconds, total }));

		if (total < MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR) {
			interval.current = window.setInterval(() => {
				const timeParts = getTimeRemaining(end);

				setRemaining(getTimeRemainingString(timeParts));
			}, 1000);

			return () => window.clearInterval(interval.current);
		}

		return undefined;
	}, [days, end, hours, minutes, seconds, total]);

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

export const useOfflineNotifications = (): void => {
	const OFFLINE_ID = 'offline-toast-notification';
	const ONLINE_ID = 'online-toast-notification';

	const handleNetworkChange = (): void => {
		if (window.navigator.onLine) {
			toast.dismiss(OFFLINE_ID);
			toast.success('You are back online!', {
				icon: SuccessIcon,
				position: 'bottom-center',
				toastId: ONLINE_ID,
			});
		} else {
			toast.dismiss(ONLINE_ID);
			toast.success('You are currently offline!', {
				autoClose: false,
				icon: WarningIcon,
				position: 'bottom-center',
				toastId: OFFLINE_ID,
			});
		}
	};

	useEffect(() => {
		if (typeof window !== 'undefined' && 'ononline' in window && 'onoffline' in window) {
			if (!window.ononline) {
				window.addEventListener('online', handleNetworkChange);
			}

			if (!window.onoffline) {
				window.addEventListener('offline', handleNetworkChange);
			}
		}

		return () => {
			if (typeof window !== 'undefined' && 'ononline' in window && 'onoffline' in window) {
				window.removeEventListener('online', handleNetworkChange);
				window.removeEventListener('offline', handleNetworkChange);
			}
		};
	}, []);
};

export const usePageTitle = (title: string): [string, Dispatch<SetStateAction<string>>] => {
	const [currentTitle, setTitle] = useContext(TitleContext);

	useEffect(() => {
		setTitle(title);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return [currentTitle, setTitle];
};

export const useRouteChangeLoader = (): void => {
	const router = useRouter();

	useEffect((): (() => void) => {
		let mounted = true;

		const handleStart = (_url: string): void => {
			if (mounted) NProgress.start();
		};

		const handleComplete = (_url: string): void => {
			if (mounted) NProgress.done();
		};

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleComplete);
		router.events.on('routeChangeError', handleComplete);

		return (): void => {
			mounted = false;
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleComplete);
			router.events.off('routeChangeError', handleComplete);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};

declare global {
	interface Window {
		workbox: Workbox;
	}
}

export const useServiceWorker = (): void => {
	useEffect((): void => {
		if (
			typeof window !== 'undefined' &&
			'serviceWorker' in navigator &&
			window.workbox !== undefined
		) {
			const wb = window.workbox;

			/**
			 * Add event listeners to handle any of PWA lifecycle event
			 * https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
			 */
			wb.addEventListener('installed', event => {
				logger.debug(`Event ${event.type} is triggered.`);
				logger.debug(event);
			});

			wb.addEventListener('controlling', event => {
				logger.debug(`Event ${event.type} is triggered.`);
				logger.debug(event);
			});

			wb.addEventListener('activated', event => {
				logger.debug(`Event ${event.type} is triggered.`);
				logger.debug(event);
			});

			/**
			 * A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
			 * NOTE: MUST set skipWaiting to false in next.config.js pwa object
			 * https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
			 */
			const promptNewVersionAvailable = (event: WorkboxLifecycleEvent): void => {
				logger.debug(`Event ${event.type} is triggered.`);
				logger.debug(event);

				toast.info(
					React.createElement(SWUpdatedToast, {
						onUpdate: () => {
							wb.addEventListener('controlling', _event => {
								window.location.reload();
							});

							wb.messageSkipWaiting();
						},
					}),
					{
						autoClose: false,
						icon: LargeWarningIcon,
						onClose: () => {
							logger.warn(
								'User rejected to reload the web app, keep using old version. New version will be automatically loaded when user opens the app next time.',
							);
						},
						position: 'bottom-center',
					},
				);
			};

			wb.addEventListener('waiting', promptNewVersionAvailable);

			//FIXME: ISSUE - this is not working as expected, why?
			// I could only make message event listener work when I manually add this listener into sw.js file
			wb.addEventListener('message', event => {
				logger.debug(`Event ${event.type} is triggered.`);
				logger.debug(event);
			});
			wb.addEventListener('redundant', event => {
				logger.log(`Event ${event.type} is triggered.`);
				logger.log(event);
			});

			wb.register();
		}
	}, []);
};

export const useWarningOnExit = (shouldWarn: boolean, warningText?: string): void => {
	const router = useRouter();
	const message = warningText || 'Are you sure that you want to leave?';

	useEffect(() => {
		let isWarned = false;

		const routeChangeStart = (url: string) => {
			if (router.asPath !== url && shouldWarn && !isWarned) {
				isWarned = true;

				if (window.confirm(message)) {
					router.push(url);
				} else {
					isWarned = false;
					router.events.emit('routeChangeError');
					router.replace(router, router.asPath, { shallow: true });
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

		router.events.on('routeChangeStart', routeChangeStart);
		window.addEventListener('beforeunload', beforeUnload);
		router.beforePopState(({ url }) => {
			if (router.asPath !== url && shouldWarn && !isWarned) {
				isWarned = true;

				if (window.confirm(message)) {
					return true;
				} else {
					isWarned = false;
					window.history.pushState(null, '', url);
					router.replace(router, router.asPath, { shallow: true });

					return false;
				}
			}

			return true;
		});

		return () => {
			router.events.off('routeChangeStart', routeChangeStart);
			window.removeEventListener('beforeunload', beforeUnload);
			router.beforePopState(() => {
				return true;
			});
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message, shouldWarn]);
};
