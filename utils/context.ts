import { createContext, Dispatch, SetStateAction } from 'react';

export const TitleContext = createContext<
	[string, Dispatch<SetStateAction<string>>]
	// eslint-disable-next-line @typescript-eslint/no-empty-function
>(['Welcome', () => {}]);

export const WeekContext = createContext<
	[number, Dispatch<SetStateAction<number>>]
	// eslint-disable-next-line @typescript-eslint/no-empty-function
>([1, () => {}]);
