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
import React, { Fragment, useEffect, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import Skeleton from "react-loading-skeleton";

import type { EmailResponse } from "../../graphql/viewAdminEmails";
import { loadEmails } from "../../graphql/viewAdminEmails";
import { getEmptyArray } from "../../utils/arrays";
import { NEXT_PUBLIC_SITE_URL } from "../../utils/constants";
import { logger } from "../../utils/logging";
import { getRandomInteger } from "../../utils/numbers";

const ViewAdminEmails: FC = () => {
  const [data, setData] = useState<null | Array<EmailResponse>>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastKey, setLastKey] = useState<null | string>(null);

  const loadMore = async (): Promise<void> => {
    if (!hasMore) return;

    try {
      setLoading(true);

      const results = await loadEmails(20, lastKey);

      setData(data => [...(data ?? []), ...results.loadEmails.results]);
      setHasMore(results.loadEmails.hasMore);
      setLastKey(results.loadEmails.lastKey ?? null);
    } catch (error) {
      logger.error({ text: "Failed to load emails: ", error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [sentryRef] = useInfiniteScroll({
    hasNextPage: hasMore,
    loading,
    onLoadMore: loadMore,
    rootMargin: "0px 0px 400px 0px",
  });

  return (
    <div className="row">
      <div className="col-12 content-bg mt-4 p-4 pt-2 border border-secondary rounded">
        <div className="col-12 text-center text-md-start">
          {!data ? <Skeleton height={20} width={125} /> : `${data.length} emails`}
        </div>
        <div className="col-12 table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">View</th>
                <th scope="col">Type</th>
                <th scope="col">To</th>
                <th scope="col">Subject</th>
                <th scope="col">Sent</th>
              </tr>
            </thead>
            {!data ? (
              <tbody>
                {getEmptyArray(10).map((_, i) => (
                  <tr key={`table-loader-${i}`}>
                    <td>
                      <Skeleton height={20} width={45} />
                    </td>
                    <td>
                      <Skeleton height={20} width={getRandomInteger(50, 100)} />
                    </td>
                    <td>
                      <div>
                        <Skeleton height={20} width={getRandomInteger(100, 150)} />
                      </div>
                      <div>
                        <Skeleton height={20} width={getRandomInteger(50, 100)} />
                      </div>
                    </td>
                    <td>
                      <Skeleton height={20} width={getRandomInteger(100, 200)} />
                    </td>
                    <td>
                      <Skeleton height={20} width={150} />
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                {data.map(email => (
                  <tr key={`email-${email.emailID}`}>
                    <td>
                      {email.html && (
                        <a
                          href={`${NEXT_PUBLIC_SITE_URL}/api/email/${email.emailID}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          View
                        </a>
                      )}
                    </td>
                    <td>
                      {email.emailType} {email.html && "email"}
                      {email.sms && "sms"}
                    </td>
                    <td>
                      {email.toUsers.length > 0
                        ? email.toUsers.map(user => (
                            <Fragment
                              key={`email-${email.emailID}-to-user-${user.userID}`}
                            >
                              <div>
                                {user.userFirstName} {user.userLastName}
                              </div>
                              <div>{email.sms ? user.userPhone : user.userEmail}</div>
                            </Fragment>
                          ))
                        : email.to}
                    </td>
                    <td>{email.subject || email.sms}</td>
                    <td>{email.createdAt}</td>
                  </tr>
                ))}
                {(loading || hasMore) && (
                  <tr ref={sentryRef}>
                    <td>
                      <Skeleton height={20} width={45} />
                    </td>
                    <td>
                      <Skeleton height={20} width={getRandomInteger(50, 100)} />
                    </td>
                    <td>
                      <div>
                        <Skeleton height={20} width={getRandomInteger(100, 150)} />
                      </div>
                      <div>
                        <Skeleton height={20} width={getRandomInteger(50, 100)} />
                      </div>
                    </td>
                    <td>
                      <Skeleton height={20} width={getRandomInteger(100, 200)} />
                    </td>
                    <td>
                      <Skeleton height={20} width={150} />
                    </td>
                  </tr>
                )}
                {!hasMore && (
                  <tr>
                    <td className="fs-6 fst-italic text-muted text-center" colSpan={5}>
                      No more emails found
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewAdminEmails;
