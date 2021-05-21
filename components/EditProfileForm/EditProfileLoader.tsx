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

const EditProfileLoader: FC = () => (
	<SkeletonTheme>
		<form>
			<div className="row mb-3">
				<div className="col">
					{/* Email */}
					<label className="form-label">
						<Skeleton height={23} width={50} />
					</label>
					<Skeleton height={37} />
				</div>
			</div>
			<div className="row mb-3">
				<div className="col-md mb-3 mb-md-0">
					{/* First Name */}
					<label className="form-label">
						<Skeleton height={23} width={89} />
					</label>
					<Skeleton height={37} />
				</div>
				<div className="col-md">
					{/* Last Name */}
					<label className="form-label">
						<Skeleton height={23} width={88} />
					</label>
					<Skeleton height={37} />
				</div>
			</div>
			<div className="row mb-3">
				<div className="col-md mb-3 mb-md-0">
					{/* Team Name */}
					<label className="form-label">
						<Skeleton height={23} width={151} />
					</label>
					<Skeleton height={37} />
				</div>
				<div className="col-md">
					{/* Phone Number */}
					<label className="form-label">
						<Skeleton height={25} width={201} />
					</label>
					<Skeleton height={37} />
				</div>
			</div>
			<div className="row mb-3">
				<div className="col-md mb-3 mb-md-0">
					{/* Payment Type */}
					<label className="form-label">
						<Skeleton height={23} width={111} />
					</label>
					<Skeleton height={37} />
				</div>
				<div className="col-md">
					{/* Auto Picks Left */}
					<label className="form-label">
						<Skeleton height={25} width={185} />
					</label>
					<br />
					<Skeleton height={37} width={23} />
				</div>
			</div>
			<div className="row mb-3">
				<div className="col-md mb-3 mb-md-0">
					{/* Payment Account */}
					<label className="form-label">
						<Skeleton height={25} width={167} />
					</label>
					<Skeleton height={37} />
				</div>
				<div className="col-md">
					{/* Auto Pick Strategy */}
					<label className="form-label">
						<Skeleton height={23} width={117} />
					</label>
					<br />
					<Skeleton height={37} width={217} />
				</div>
			</div>
			<div className="row mb-3">
				<div className="col-md mb-3 mb-md-0">
					{/* Notifications */}
					<Skeleton height={17} />
					<Skeleton height={17} />
					<Skeleton height={17} />
					<Skeleton height={17} />
				</div>
				<div className="col-md">
					{/* Notifications */}
					<Skeleton height={17} />
					<Skeleton height={17} />
					<Skeleton height={17} />
				</div>
			</div>
			<div className="row mb-3">
				<div className="col-md mb-3 mb-md-0">
					{/* Google Button */}
					<Skeleton height={37} />
				</div>
				<div className="col-md">
					{/* Twitter Button */}
					<Skeleton height={37} />
				</div>
			</div>
			<div className="d-grid">
				{/* Submit button */}
				<Skeleton height={37} />
			</div>
		</form>
	</SkeletonTheme>
);

export default EditProfileLoader;
