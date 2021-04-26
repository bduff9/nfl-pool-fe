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
