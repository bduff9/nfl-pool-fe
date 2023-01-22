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
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";

import type { Winner } from "../../graphql/manageAdminPayouts";

type AdminUserPayoutModalProps = {
  handleClose: () => void;
  show?: boolean;
  updateAmount: (userID: number | undefined, amount: number) => Promise<void>;
  winner: null | Winner;
};

const AdminUserPayoutModal: FC<AdminUserPayoutModalProps> = ({
  handleClose,
  show = false,
  updateAmount,
  winner,
}) => {
  const fullName = winner?.userName ?? "Missing Name";
  const remainingToPay = (winner?.userWon ?? 0) - (winner?.userPaidOut ?? 0);
  const [toPay, setToPay] = useState<number>(remainingToPay);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setToPay(remainingToPay);
  }, [remainingToPay]);

  const handleSave = async (): Promise<void> => {
    setLoading(true);
    await updateAmount(winner?.userID, toPay ?? 0);
    setLoading(false);
  };

  return (
    <Modal onHide={handleClose} show={show}>
      <Modal.Header closeButton>
        <Modal.Title>How much have they been paid?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="userPayoutAmount" className="form-label">
            {remainingToPay > 0
              ? `${fullName} is still owed $${remainingToPay} / $${winner?.userWon}`
              : `${fullName} has been paid $${winner?.userWon}`}
          </label>
          <input
            className="form-control"
            id="userPayoutAmount"
            max={remainingToPay}
            onChange={event => {
              let value = +event.target.value;

              if (value < 0) value = 0;

              if (value > (winner?.userWon ?? 0)) value = winner?.userWon ?? 0;

              setToPay(value);
            }}
            placeholder="To pay amount in $"
            type="number"
            value={remainingToPay}
          />
          <abbr
            className="text-muted"
            onClick={() => {
              winner?.userPaymentAccount &&
                navigator.clipboard.writeText(winner.userPaymentAccount);
            }}
            title="Click to copy payment account"
          >
            {winner?.userPaymentType}: {winner?.userPaymentAccount}
          </abbr>
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
            "Save"
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdminUserPayoutModal;
