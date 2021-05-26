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
import Head from 'next/head';
import React, { FC } from 'react';

import { getPageTitle } from '../../utils';
import { usePageTitle } from '../../utils/hooks';

type CustomHeadProps = {
	title: string;
};

const CustomHead: FC<CustomHeadProps> = ({ title }) => {
	const [pageTitle] = usePageTitle(title);
	//TODO: load alerts in here
	const data: string[] = [];
	//TODO: update title with counts based on # of alerts

	return (
		<div className="w-100">
			<Head>
				<title>{getPageTitle(pageTitle)}</title>
			</Head>

			{data.map(alert => (
				<div className="alert alert-danger mb-0" key={alert} role="alert">
					{alert}
				</div>
			))}
		</div>
	);
};

CustomHead.whyDidYouRender = true;

export default CustomHead;
