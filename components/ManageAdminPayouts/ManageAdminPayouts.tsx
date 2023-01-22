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
import { faDollarSign } from "@bduff9/pro-duotone-svg-icons/faDollarSign";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import type { FC } from "react";
import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";

import { getEmptyArray } from "../../utils/arrays";
import type { Winner } from "../../graphql/manageAdminPayouts";
import { insertUserPayout, useWinners } from "../../graphql/manageAdminPayouts";
import AdminUserPayoutModal from "../AdminUserPayoutModal/AdminUserPayoutModal";
import { BackgroundLoadingContext } from "../../utils/context";
import { ErrorIcon, SuccessIcon } from "../ToastUtils/ToastIcons";
import { logger } from "../../utils/logging";

const ManageAdminPayouts: FC = () => {
  const { data, error, isValidating, mutate } = useWinners();
  const [, setBackgroundLoading] = useContext(BackgroundLoadingContext);
  const [modalOpen, setModalOpen] = useState<null | Winner>(null);

  useEffect(() => {
    setBackgroundLoading(!!data && isValidating);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isValidating]);

  if (error) {
    logger.error({
      text: "Error when rendering winners for admin payments screen: ",
      error,
    });
  }

  const addUserPayout = async (
    userID: number | undefined,
    amount: number,
  ): Promise<void> => {
    if (!userID) {
      toast.error("Missing user ID to update, please try again", {
        icon: ErrorIcon,
      });

      return;
    }

    try {
      mutate(data => {
        if (!data) return data;

        const getUserPaymentsForAdmin = data.getUserPaymentsForAdmin.map(
          (user: { userID: number; userBalance: number; userPaidOut: number }) => {
            if (user.userID === userID) {
              return {
                ...user,
                userBalance: user.userBalance - amount,
                userPaidOut: user.userPaidOut + amount,
              };
            }

            return user;
          },
        );

        return { getUserPaymentsForAdmin };
      }, false);

      await toast.promise(insertUserPayout(userID, amount), {
        error: {
          icon: ErrorIcon,
          render({ data }) {
            logger.debug({ text: "~~~~~~~ERROR DATA: ", data });

            // if (data instanceof ClientError) {
            //   //TODO: toast all errors, not just first
            //   return data.response.errors?.[0]?.message;
            // }

            return "Something went wrong, please try again";
          },
        },
        pending: "Saving...",
        success: {
          icon: SuccessIcon,
          render() {
            return "Successfully updated user payout amount!";
          },
        },
      });

      setModalOpen(null);
    } catch (error) {
      logger.error({
        text: "Error updating user amount paid out: ",
        amount,
        error,
        userID,
      });
    } finally {
      await mutate();
    }
  };

  return (
    <div className="row">
      <div className="col-12 content-bg mt-4 p-4 border border-secondary rounded table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Payout</th>
              <th scope="col">Winnings</th>
              <th scope="col">Account</th>
              <th scope="col">Mark Paid</th>
            </tr>
          </thead>
          {!data ? (
            <tbody>
              {getEmptyArray(10).map((_, i) => (
                <tr key={`table-loader-${i}`}>
                  <th scope="row">
                    <div>
                      <Skeleton height={20} width={65} />
                    </div>
                    <div>
                      <Skeleton height={20} width={80} />
                    </div>
                  </th>
                  <td className="text-center">
                    <Skeleton height={20} width={45} />
                  </td>
                  <td>
                    <Skeleton height={20} width={150} />
                  </td>
                  <td>
                    <div>
                      <Skeleton height={20} width={50} />
                    </div>
                    <div>
                      <Skeleton height={20} width={120} />
                    </div>
                  </td>
                  <td className="text-center">
                    <Skeleton height={50} width={40} />
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              {data.getUserPaymentsForAdmin.map(user => (
                <tr key={`winnings-for-user-${user.userID}`}>
                  <th scope="row">
                    <div>{user.userName}</div>
                    <div className="text-muted">{user.userTeamName}</div>
                  </th>
                  <td
                    className={clsx(
                      "text-center",
                      "fw-bold",
                      user.userBalance === user.userWon
                        ? "text-danger"
                        : user.userBalance === 0
                        ? "text-success text-decoration-line-through"
                        : "text-warning",
                    )}
                    title={`Paid out $${user.userWon - user.userBalance} / $${
                      user.userWon
                    }`}
                  >
                    ${user.userWon}
                  </td>
                  <td>
                    {user.payments
                      .filter(payment => payment.paymentType === "Prize")
                      .reduce(
                        (acc, payment) =>
                          `${acc ? `${acc}, ` : ""}${
                            payment.paymentWeek ? `Week ${payment.paymentWeek}: ` : ""
                          }${payment.paymentDescription}`,
                        "",
                      )}
                  </td>
                  <td>
                    <div className="fw-bold">{user.userPaymentType}</div>
                    <div className="text-muted">{user.userPaymentAccount}</div>
                  </td>
                  <td className="text-center">
                    <FontAwesomeIcon
                      size="2x"
                      className={clsx(
                        "text-center",
                        "cursor-pointer",
                        user.userBalance === user.userWon
                          ? "text-danger"
                          : user.userBalance === 0
                          ? "text-success"
                          : "text-warning",
                      )}
                      icon={faDollarSign}
                      onClick={() => setModalOpen(user)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <AdminUserPayoutModal
        handleClose={() => setModalOpen(null)}
        winner={modalOpen}
        show={modalOpen !== null}
        updateAmount={addUserPayout}
      />
    </div>
  );
};

export default ManageAdminPayouts;
