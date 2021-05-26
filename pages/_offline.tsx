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

import { getPageTitle } from '../utils';

//TODO: style this page per Figma
const OfflinePage: FC = () => (
	<>
		<Head>
			<title>{getPageTitle('You are offline')}</title>
		</Head>
		<h1>This is the offline fallback page</h1>
		<h2>When offline, any page route will fallback to this page</h2>
	</>
);

OfflinePage.whyDidYouRender = true;

// ts-prune-ignore-next
export default OfflinePage;
