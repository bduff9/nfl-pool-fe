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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@bduff9/pro-duotone-svg-icons/faInfoCircle';
import { faExclamationCircle } from '@bduff9/pro-duotone-svg-icons/faExclamationCircle';
import { faCheckCircle } from '@bduff9/pro-duotone-svg-icons/faCheckCircle';
import { faQuestionCircle } from '@bduff9/pro-duotone-svg-icons/faQuestionCircle';
import React, { FC, useState } from 'react';
import Toast from 'react-bootstrap/Toast';

type AlertProps = {
	autoHide?: boolean;
	delay?: number;
	message: string;
	onClose?: () => void;
	showCloseButton?: boolean;
	title: string;
	type: 'warning' | 'info' | 'danger' | 'success';
};

/* Classes needed: fade toast show toast-header toast-body btn-close */
const Alert: FC<AlertProps> = ({
	autoHide = false,
	delay,
	message,
	onClose,
	showCloseButton = true,
	title,
	type,
}) => {
	const [show, setShow] = useState<boolean>(true);

	return (
		<Toast
			autohide={autoHide}
			delay={delay}
			onClose={() => {
				setShow(false);
				onClose && onClose();
			}}
			show={show}
		>
			<Toast.Header closeButton={showCloseButton}>
				<div className={`flex-grow-1 text-${type} fs-6`}>
					{type === 'danger' && <FontAwesomeIcon icon={faExclamationCircle} />}
					{type === 'info' && <FontAwesomeIcon icon={faInfoCircle} />}
					{type === 'success' && <FontAwesomeIcon icon={faCheckCircle} />}
					{type === 'warning' && <FontAwesomeIcon icon={faQuestionCircle} />}
					&nbsp;{title}
				</div>
			</Toast.Header>
			<Toast.Body style={{ backgroundColor: 'rgba(255, 255, 255, .75)' }}>
				{message}
			</Toast.Body>
		</Toast>
	);
};

Alert.whyDidYouRender = true;

export default Alert;
