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
