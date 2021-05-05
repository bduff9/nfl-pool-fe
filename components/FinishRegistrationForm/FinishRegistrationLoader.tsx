import React, { FC } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const FinishRegistrationLoader: FC = () => (
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
				<div className="col">
					{/* Team Name */}
					<label className="form-label">
						<Skeleton height={23} width={150} />
					</label>
					<Skeleton height={37} />
				</div>
			</div>
			<div className="row mb-3">
				<div className="col">
					{/* Referred By */}
					<label className="form-label">
						<Skeleton height={23} width={191} />
					</label>
					<Skeleton height={37} />
				</div>
			</div>
			<div className="row mb-3">
				<div className="col">
					{/* Survivor? */}
					<label className="form-label">
						<Skeleton height={23} width={191} />
					</label>
					<div className="d-inline ms-4">
						<Skeleton height={37} width={96} />
					</div>
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
					{/* Payment Account */}
					<label className="form-label">
						<Skeleton height={23} width={155} />
					</label>
					<Skeleton height={37} />
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

export default FinishRegistrationLoader;
