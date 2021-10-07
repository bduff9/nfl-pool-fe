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
import React, { FC, useState } from 'react';
import Modal from 'react-bootstrap/Modal';

type ConfirmationModal = {
	acceptButton?: string;
	body: JSX.Element | string;
	cancelButton?: string;
	onAccept: () => void | Promise<void>;
	onCancel: () => void | Promise<void>;
	title: string;
};

const ConfirmationModal: FC<ConfirmationModal> = ({
	acceptButton = 'OK',
	body,
	cancelButton = 'Cancel',
	onAccept,
	onCancel,
	title,
}) => {
	const [loading, setLoading] = useState<boolean>(false);

	const handleAccept = async (): Promise<void> => {
		setLoading(true);
		await onAccept();
		setLoading(false);
	};

	return (
		<Modal onHide={onCancel} show>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{body}</Modal.Body>
			<Modal.Footer>
				<button
					className="btn btn-secondary"
					disabled={loading}
					onClick={onCancel}
					type="button"
				>
					{cancelButton}
				</button>
				<button
					className="btn btn-primary"
					disabled={loading}
					onClick={handleAccept}
					type="button"
				>
					{loading ? (
						<>
							<span
								className="spinner-grow spinner-grow-sm d-none d-md-inline-block"
								role="status"
								aria-hidden="true"
							></span>
							Loading...
						</>
					) : (
						acceptButton
					)}
				</button>
			</Modal.Footer>
		</Modal>
	);
};

ConfirmationModal.whyDidYouRender = true;

export default ConfirmationModal;
