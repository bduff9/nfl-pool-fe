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
import clsx from "clsx";
import type { GetServerSideProps } from "next";
import type { FC } from "react";
import React, { Fragment, useContext, useEffect } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import type { User } from "@prisma/client";

import Authenticated from "../components/Authenticated/Authenticated";
import CustomHead from "../components/CustomHead/CustomHead";
import { useGamesForWeek } from "../graphql/scoreboard";
import {
  isDoneRegisteringSSR,
  isSignedInSSR,
  IS_NOT_DONE_REGISTERING_REDIRECT,
  UNAUTHENTICATED_REDIRECT,
} from "../utils/auth.server";
import { BackgroundLoadingContext, WeekContext } from "../utils/context";
import { formatDateForKickoff } from "../utils/dates";
import styles from "../styles/scoreboard.module.scss";
import ScoreboardTeam from "../components/ScoreboardTeam/ScoreboardTeam";
import GameStatusDisplay from "../components/GameStatusDisplay/GameStatusDisplay";
import { getEmptyArray } from "../utils/arrays";
import { logger } from "../utils/logging";

const TeamLoader: FC = () => (
  <>
    <div className="team-logo">
      <Skeleton height={70} width={70} />
    </div>
    <div className={clsx("flex-grow-1", "d-flex", "align-items-center", "ps-3")}>
      <Skeleton className="d-none d-md-inline-block" height={23} width={280} />
      <Skeleton className="d-md-none" height={23} width={30} />
    </div>
    <div className={clsx("d-flex", "align-items-center", "pe-3")}>
      <Skeleton height={23} width={23} />
    </div>
    <div className="w-100"></div>
  </>
);

const GameLoader: FC = () => (
  <div className="col-12 col-md-6 mb-3">
    <div className={clsx("p-3", "d-flex", styles.game)}>
      <div className={clsx("d-flex", "flex-grow-1", "flex-wrap")}>
        <TeamLoader />
        <TeamLoader />
      </div>
      <div className={clsx("text-center", "pt-4", "fs-4", styles["game-status"])}>
        <Skeleton className="d-none d-md-inline-block" height={28} width={100} />
        <Skeleton className="d-md-none" height={28} width={72} />
      </div>
    </div>
  </div>
);

const ScoreboardLoader: FC = () => (
  <>
    {getEmptyArray(16).map((_, i) => (
      <GameLoader key={i} />
    ))}
  </>
);

type ScoreboardProps = {
  user: User;
};

const Scoreboard: FC<ScoreboardProps> = () => {
  const [selectedWeek] = useContext(WeekContext);
  const { data, error, isValidating } = useGamesForWeek(selectedWeek);
  const [, setBackgroundLoading] = useContext(BackgroundLoadingContext);
  let lastKickoff: string;

  useEffect(() => {
    setBackgroundLoading(!!data && isValidating);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isValidating]);

  if (error) {
    logger.error({
      text: `Error when loading week ${selectedWeek} games for NFL scoreboard: `,
      error,
    });
  }

  return (
    <Authenticated isRegistered>
      <CustomHead title="Scoreboard" />
      <div className="content-bg text-dark my-3 mx-2 pt-5 pt-md-3 min-vh-100 pb-4 col">
        <SkeletonTheme>
          <div className="row min-vh-100">
            {!data ? (
              <ScoreboardLoader />
            ) : (
              data.getGamesForWeek.map(game => {
                const currentKickoff = formatDateForKickoff(game.gameKickoff);
                const differentKickoff = currentKickoff !== lastKickoff;
                const isFirst = !lastKickoff;

                lastKickoff = currentKickoff;

                return (
                  <Fragment key={`game-${game.gameID}`}>
                    {differentKickoff && (
                      <>
                        <div
                          className={clsx(
                            "w-100",
                            "text-start",
                            "fw-bold",
                            !isFirst && "mt-3",
                          )}
                        >
                          {currentKickoff}
                        </div>
                      </>
                    )}
                    <div className="col-12 col-md-6 mb-3">
                      <div className={clsx("p-3", "d-flex", styles.game)}>
                        <div className={clsx("d-flex", "flex-grow-1", "flex-wrap")}>
                          <ScoreboardTeam
                            gameStatus={game.gameStatus}
                            hasPossession={
                              game.teamHasPossession?.teamID === game.homeTeam.teamID
                            }
                            isInRedzone={
                              game.teamInRedzone?.teamID === game.homeTeam.teamID
                            }
                            isWinner={game.winnerTeam?.teamID === game.homeTeam.teamID}
                            score={game.gameHomeScore}
                            team={game.homeTeam}
                          />
                          <ScoreboardTeam
                            gameStatus={game.gameStatus}
                            hasPossession={
                              game.teamHasPossession?.teamID === game.visitorTeam.teamID
                            }
                            isInRedzone={
                              game.teamInRedzone?.teamID === game.visitorTeam.teamID
                            }
                            isWinner={game.winnerTeam?.teamID === game.visitorTeam.teamID}
                            score={game.gameVisitorScore}
                            team={game.visitorTeam}
                          />
                        </div>
                        <div
                          className={clsx(
                            "text-center",
                            "pt-4",
                            "fs-4",
                            styles["game-status"],
                          )}
                        >
                          <GameStatusDisplay
                            kickoff={game.gameKickoff}
                            status={game.gameStatus}
                            timeLeft={game.gameTimeLeftInQuarter}
                          />
                        </div>
                      </div>
                    </div>
                  </Fragment>
                );
              })
            )}
          </div>
        </SkeletonTheme>
      </div>
    </Authenticated>
  );
};

// ts-prune-ignore-next
export const getServerSideProps: GetServerSideProps = async context => {
  const session = await isSignedInSSR(context);

  if (!session) {
    return UNAUTHENTICATED_REDIRECT;
  }

  const isDoneRegistering = isDoneRegisteringSSR(session);

  if (!isDoneRegistering) {
    return IS_NOT_DONE_REGISTERING_REDIRECT;
  }

  const { user } = session;

  return { props: { user } };
};

// ts-prune-ignore-next
export default Scoreboard;
