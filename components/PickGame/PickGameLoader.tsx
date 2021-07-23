import { faAt } from '@bduff9/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import { getEmptyArray } from '../../utils/arrays';

// eslint-disable-next-line css-modules/no-unused-class
import styles from './PickGame.module.scss';

const PickGameLoader: FC = () => {
	return (
		<>
			{getEmptyArray(16).map((_, i) => (
				<div className="row" key={`pick-loader-${i}`}>
					<div className="col-3 col-md-2 d-flex align-items-center justify-content-end">
						<Skeleton circle height={60} width={60} />
					</div>
					<div className="col-6 col-md-8 d-flex align-items-center text-center">
						<div className={clsx(styles['game-info'])}>
							<Skeleton height={60} width={60} />
							<div className="d-block d-md-none">
								<Skeleton width={45} />
							</div>
						</div>
						<div className={clsx('d-none', 'd-md-block', styles['game-info'])}>
							<Skeleton width={75} />
							<br />
							<Skeleton width={55} />
						</div>
						<div className={clsx(styles['at-symbol'])}>
							<FontAwesomeIcon icon={faAt} />
						</div>
						<div className={clsx('d-none', 'd-md-block', styles['game-info'])}>
							<Skeleton width={75} />
							<br />
							<Skeleton width={55} />
						</div>
						<div className={clsx(styles['game-info'])}>
							<Skeleton height={60} width={60} />
							<div className="d-block d-md-none">
								<Skeleton width={45} />
							</div>
						</div>
					</div>
					<div className="col-3 col-md-2 d-flex align-items-center justify-content-start">
						<Skeleton circle className={styles.point} height={60} width={60} />
					</div>
				</div>
			))}
		</>
	);
};

PickGameLoader.whyDidYouRender = true;

export default PickGameLoader;
