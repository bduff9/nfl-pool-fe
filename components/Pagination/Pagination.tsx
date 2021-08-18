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
import clsx from 'clsx';
import React, { Dispatch, FC, SetStateAction, useCallback } from 'react';

type PaginationProps = {
	currentPage: number;
	setPage: Dispatch<SetStateAction<number>>;
	totalPages: number;
};

const Pagination: FC<PaginationProps> = ({ currentPage, setPage, totalPages }) => {
	const pagesToDisplay: Array<number> = [];
	const pages: Array<JSX.Element> = [];

	const countPages = useCallback(
		(pages: Array<number>) =>
			pages.reduce((acc, page, i, allPages) => {
				if (i + 1 < allPages.length && page + 1 !== allPages[i + 1]) {
					acc++;
				}

				return ++acc;
			}, 0),
		[],
	);

	if (totalPages <= 7) {
		for (let i = 1; i <= totalPages; i++) {
			pagesToDisplay.push(i);
		}
	} else {
		const unique = new Set([
			1,
			currentPage === 1 ? 1 : currentPage - 1,
			currentPage,
			currentPage === totalPages ? totalPages : currentPage + 1,
			totalPages,
		]);

		pagesToDisplay.push(...unique);
	}

	if (totalPages >= 7 && countPages(pagesToDisplay) < 7) {
		let first = 1;
		let last = totalPages;

		while (countPages(pagesToDisplay) < 7) {
			if (!pagesToDisplay.includes(first)) {
				pagesToDisplay.push(first);
			}

			first++;

			if (!pagesToDisplay.includes(last)) {
				pagesToDisplay.push(last);
			}

			last--;
		}

		pagesToDisplay.sort((a, b) => a - b);
	}

	pagesToDisplay.forEach((page, i, allPages) => {
		pages.push(
			<li
				className={clsx('page-item', page === currentPage && 'active')}
				key={`page-${page}`}
			>
				<a
					className="page-link"
					href="#"
					onClick={event => {
						event.preventDefault();
						setPage(page);
					}}
				>
					{page}
				</a>
			</li>,
		);

		if (i + 1 !== allPages.length && page + 1 !== allPages[i + 1]) {
			pages.push(
				<li className="page-item" key={`ellipses-after-page-${page}`}>
					<span className="page-link">...</span>
				</li>,
			);
		}
	});

	return (
		<nav aria-label="Admin logs pagination">
			<ul className="pagination">{pages}</ul>
		</nav>
	);
};

Pagination.whyDidYouRender = true;

export default Pagination;
