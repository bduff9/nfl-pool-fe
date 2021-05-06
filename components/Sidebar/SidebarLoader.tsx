/*
NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
Copyright (C) 2015-present Brian Duffey and Billy Alexander
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.  If not, see {http://www.gnu.org/licenses/}.
Home: https://asitewithnoname.com/
*/
import React, { FC } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const SidebarLoader: FC = () => {
	const durationInSeconds = 2.25;

	return (
		<SkeletonTheme color="#F2F2F2" highlightColor="#444">
			{/* Welcome, NAME */}
			<div className="text-center mb-4">
				<Skeleton duration={durationInSeconds} height={26} width={150} />
			</div>
			{/* Week Picker */}
			<Skeleton duration={durationInSeconds} className="mb-4" height={46} />
			{/* Dashboard */}
			<div className="mb-3">
				<Skeleton duration={durationInSeconds} height={25} width={136} />
			</div>
			{/* Picks */}
			<div className="mb-3">
				<Skeleton duration={durationInSeconds} height={25} width={85} />
			</div>
			{/* Survivor */}
			<div className="mb-3">
				<Skeleton duration={durationInSeconds} height={25} width={136} />
			</div>
			{/* NFL Scoreboard */}
			<div className="mb-3">
				<Skeleton duration={durationInSeconds} height={25} width={238} />
			</div>
			{/* My Account */}
			<div className="mb-3">
				<Skeleton duration={durationInSeconds} height={25} width={170} />
			</div>
			{/* Help */}
			<div className="mb-3">
				<Skeleton duration={durationInSeconds} height={25} width={68} />
			</div>
			{/* Signout */}
			<div className="mb-3">
				<Skeleton duration={durationInSeconds} height={25} width={119} />
			</div>
		</SkeletonTheme>
	);
};

export default SidebarLoader;
