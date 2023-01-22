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
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Skeleton from "react-loading-skeleton";

import { useUserDropdown } from "../../graphql/adminUserTrustModal";
import { BackgroundLoadingContext } from "../../utils/context";
import { logger } from "../../utils/logging";

type AdminUserTrustModalProps = {
  handleClose: () => void;
  referredByRaw: null | string;
  show?: boolean;
  trustUser: (userID: number | undefined, referredBy: null | number) => Promise<void>;
  userID: number | undefined;
};

const AdminUserTrustModal: FC<AdminUserTrustModalProps> = ({
  handleClose,
  referredByRaw,
  show = false,
  trustUser,
  userID,
}) => {
  const { data, error, isValidating } = useUserDropdown();
  const [, setBackgroundLoading] = useContext(BackgroundLoadingContext);
  const [referredBy, setReferredBy] = useState<null | number>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setBackgroundLoading(!!data && isValidating);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isValidating]);

  if (error) {
    logger.error({ text: "Error loading user dropdown for user admin screen", error });
  }

  const handleSave = async (): Promise<void> => {
    setLoading(true);
    await trustUser(userID, referredBy);
    setLoading(false);
  };

  return (
    <Modal onHide={handleClose} show={show}>
      <Modal.Header closeButton>
        <Modal.Title>Who referred this user?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="userPaidAmount" className="form-label">
            User entered {referredByRaw} as their referred by during registration
          </label>
          {data ? (
            <select
              aria-label="Dropdown of all users"
              className="form-select"
              onChange={event => setReferredBy(+event.target.value)}
            >
              <option>-- Select a User --</option>
              {data.userDropdown.map(user => (
                <option value={user.userID} key={`option-for-user-${user.userID}`}>
                  {user.userFirstName} {user.userLastName}
                </option>
              ))}
            </select>
          ) : (
            <Skeleton />
          )}
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
          disabled={loading || !referredBy}
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

export default AdminUserTrustModal;
