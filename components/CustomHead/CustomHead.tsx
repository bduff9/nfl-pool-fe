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
import Head from 'next/head';
import React, { FC, useEffect, useRef, useState } from 'react';

import { useMyAlertsQuery } from '../../graphql/customHead';
import { getPageTitle } from '../../utils';
import { usePageTitle } from '../../utils/hooks';

type CustomHeadProps = {
	title: string;
};

const CustomHead: FC<CustomHeadProps> = ({ title }) => {
	const [pageTitle] = usePageTitle(title);
	const { data, error } = useMyAlertsQuery();
	const [titleOverride, setTitleOverride] = useState<string>('');
	const interval = useRef<number>();

	if (error) {
		console.error('Error when loading custom head:', error);
	}

	useEffect(() => {
		if (data?.getMyAlerts?.length) {
			if (interval.current) {
				window.clearInterval(interval.current);
			}

			interval.current = window.setInterval(() => {
				setTitleOverride(title => (title ? '' : `(${data.getMyAlerts.length}) Alerts`));
			}, 2000);
		} else if (interval.current) {
			window.clearInterval(interval.current);
		}

		return () => window.clearInterval(interval.current);
	}, [data?.getMyAlerts]);

	return (
		<div
			className={clsx(
				'w-100',
				(data?.getMyAlerts.length ?? 0) > 0 && 'mt-5',
				(data?.getMyAlerts.length ?? 0) > 0 && 'mt-md-0',
			)}
		>
			<Head>
				<title>{titleOverride || getPageTitle(pageTitle)}</title>
			</Head>
			{data?.getMyAlerts.map(alert => (
				<div className="alert alert-danger mb-0" key={alert} role="alert">
					{alert}
				</div>
			))}
		</div>
	);
};

CustomHead.whyDidYouRender = true;

export default CustomHead;
