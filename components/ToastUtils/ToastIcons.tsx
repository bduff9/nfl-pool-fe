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
import { faCheckCircle } from '@bduff9/pro-duotone-svg-icons/faCheckCircle';
import { faExclamationCircle } from '@bduff9/pro-duotone-svg-icons/faExclamationCircle';
import { faExclamationTriangle } from '@bduff9/pro-duotone-svg-icons/faExclamationTriangle';
import { faInfoCircle } from '@bduff9/pro-duotone-svg-icons/faInfoCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { VFC } from 'react';

export const ErrorIcon: VFC = () => (
	<FontAwesomeIcon className="text-danger" icon={faExclamationCircle} />
);

export const InfoIcon: VFC = () => (
	<FontAwesomeIcon className="text-info" icon={faInfoCircle} />
);

export const SuccessIcon: VFC = () => (
	<FontAwesomeIcon className="text-success" icon={faCheckCircle} />
);

export const WarningIcon: VFC = () => (
	<FontAwesomeIcon className="text-warning" icon={faExclamationTriangle} />
);

export const LargeWarningIcon: VFC = () => (
	<FontAwesomeIcon className="text-warning" icon={faExclamationTriangle} size="3x" />
);
