/*******************************************************************************
 * NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
 * Copyright (C) 2015-present Brian Duffey
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
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveAttribute = <T extends Record<string, any>>(obj: T, key: string): T =>
	key.split('.').reduce((prev, curr) => prev?.[curr], obj);

const highlight = (value: string, indices: Array<[number, number]> = []): JSX.Element => {
	const pair = indices.pop();

	if (!pair) return <>{value}</>;

	return (
		<>
			{highlight(value.substring(0, pair[0]), indices)}
			<mark>{value.substring(pair[0], pair[1] + 1)}</mark>
			{value.substring(pair[1] + 1)}
		</>
	);
};

type FuseHighlightProps<T> = {
	attribute: string;
	hit: T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FuseHighlight = <T extends Record<string, any>>({
	attribute,
	hit,
}: FuseHighlightProps<T>): JSX.Element => {
	const matches =
		typeof hit.item === 'string'
			? hit.matches?.[0]
			: hit.matches?.find((m: T) => m.key === attribute);
	const fallback =
		typeof hit.item === 'string' ? hit.item : resolveAttribute(hit.item, attribute);

	return highlight(matches?.value || fallback, matches?.indices);
};
