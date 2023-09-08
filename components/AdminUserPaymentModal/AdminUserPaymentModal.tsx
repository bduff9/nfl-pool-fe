/*******************************************************************************
 * NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
 * Copyright (C) 2015-present Brian Duffey
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
import React, { VFC, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';

type AdminUserPaymentModalProps = {
	handleClose: () => void;
	owe: null | number;
	paid: null | number;
	show?: boolean;
	updateAmount: (userID: number | undefined, paid: number) => Promise<void>;
	userID: number | undefined;
};

const AdminUserPaymentModal: VFC<AdminUserPaymentModalProps> = ({
	handleClose,
	owe,
	paid,
	show = false,
	updateAmount,
	userID,
}) => {
	const left = (owe ?? 0) - (paid ?? 0);
	const [userPaid, setUserPaid] = useState<number>(left);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		setUserPaid(left);
	}, [left]);

	const handleSave = async (): Promise<void> => {
		setLoading(true);
		await updateAmount(userID, userPaid ?? 0);
		setLoading(false);
	};

	return (
		<Modal onHide={handleClose} show={show}>
			<Modal.Header closeButton>
				<Modal.Title>How much did they pay?</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="mb-3">
					<label htmlFor="userPaidAmount" className="form-label">
						{left > 0 ? `User owes $${left} / $${owe}` : `User has paid $${owe}`}
					</label>
					<input
						className="form-control"
						id="userPaidAmount"
						max={left}
						onChange={event => {
							let value = +event.target.value;

							if (value < 0) value = 0;

							if (value > (owe ?? 0)) value = owe ?? 0;

							setUserPaid(value);
						}}
						placeholder="Paid amount in $"
						type="number"
						value={userPaid}
					/>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<button
					className="btn btn-secondary"
					disabled={loading}
					onClick={handleClose}
					type="button"
				>
					Cancel
				</button>
				<button
					className="btn btn-primary"
					disabled={loading}
					onClick={handleSave}
					type="button"
				>
					{loading ? (
						<>
							<span
								className="spinner-grow spinner-grow-sm d-none d-md-inline-block"
								role="status"
								aria-hidden="true"
							></span>
							Saving...
						</>
					) : (
						'Save'
					)}
				</button>
			</Modal.Footer>
		</Modal>
	);
};

AdminUserPaymentModal.whyDidYouRender = true;

export default AdminUserPaymentModal;
