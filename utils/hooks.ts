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
import { debounce } from 'throttle-debounce';

import { TitleContext } from './context';

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
	const setQuery = useCallback(debounce(500, updateQuery), []);
	const onSearch = useCallback(
		(event: FormEvent<HTMLInputElement>) =>
			setQuery(event.currentTarget.value.trim()),
		[setQuery],
	);

	return {
		hits,
		onSearch,
		query,
		setQuery,
	};
};

export const useObjectState = <T extends Record<string, any>>(
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

export const usePageTitle = (
	title: string,
): [string, Dispatch<SetStateAction<string>>] => {
	const [currentTitle, setTitle] = useContext(TitleContext);

	useEffect(() => {
		setTitle(title);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return [currentTitle, setTitle];
};
