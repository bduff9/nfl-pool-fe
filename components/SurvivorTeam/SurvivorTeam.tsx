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
import Image from "next/image";
import type { FC } from "react";
import React from "react";

import type { Team } from "../../generated/graphql";
import type { SetSurvivorPick } from "../../graphql/survivorSet";

import styles from "./SurvivorTeam.module.scss";

type SurvivorTeamProps = {
  isHome?: boolean;
  isOnBye?: boolean;
  loading?: null | number;
  onClick?: () => void;
  pick?: SetSurvivorPick;
  team: Pick<Team, "teamID" | "teamCity" | "teamName" | "teamLogo">;
  weekInProgress: number;
};

const SurvivorTeam: FC<SurvivorTeamProps> = ({
  isHome = false,
  isOnBye = false,
  loading,
  onClick,
  pick,
  team,
  weekInProgress,
}) => {
  return (
    <div
      className={clsx(
        ...(pick
          ? [
              "cursor-default",
              styles["picked"],
              pick.survivorPickWeek < weekInProgress && styles["past-pick"],
              pick.survivorPickWeek === weekInProgress && styles["current-pick"],
              pick.survivorPickWeek > weekInProgress && styles["future-pick"],
            ]
          : isOnBye
          ? ["border", "border-dark", styles["bg-game"]]
          : [
              "border-bottom",
              "border-end",
              "border-dark",
              loading ? styles.loading : "cursor-pointer",
              !isHome && "border-start",
              styles["not-picked"],
              styles["bg-game"],
            ]),
        "position-relative",
        "pt-2",
        "px-2",
        "text-center",
        isOnBye ? "col-6 col-md-3 col-lg-2" : "w-50",
        styles["game-team"],
      )}
      onClick={!pick ? onClick : undefined}
    >
      {!!pick && (
        <div
          className={clsx(
            "badge",
            "rounded-circle",
            "position-absolute",
            "top-0",
            "start-0",
            pick.survivorPickWeek < weekInProgress && styles["badge-past"],
            pick.survivorPickWeek === weekInProgress && styles["badge-current"],
            pick.survivorPickWeek > weekInProgress && styles["badge-future"],
          )}
        >
          {pick.survivorPickWeek}
        </div>
      )}
      <Image
        alt={`${team.teamCity} ${team.teamName}`}
        height={70}
        src={`/NFLLogos/${team.teamLogo}`}
        title={`${team.teamCity} ${team.teamName}`}
        width={70}
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
      <br />
      {loading === team.teamID && (
        <span
          className="spinner-grow spinner-grow-sm"
          role="status"
          aria-hidden="true"
        ></span>
      )}
      <span className="d-none d-md-inline">
        {team.teamCity}
        <br />
      </span>
      {team.teamName}
    </div>
  );
};

export default SurvivorTeam;
