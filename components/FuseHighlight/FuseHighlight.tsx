import React from 'react';

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
