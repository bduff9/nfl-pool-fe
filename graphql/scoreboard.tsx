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
import type { Game, Team } from "../generated/graphql";

export type GameForWeek = Pick<
  Game,
  | "gameHomeScore"
  | "gameID"
  | "gameKickoff"
  | "gameStatus"
  | "gameTimeLeftInQuarter"
  | "gameVisitorScore"
> & {
  homeTeam: Pick<Team, "teamCity" | "teamID" | "teamLogo" | "teamName" | "teamShortName">;
  visitorTeam: Pick<
    Team,
    "teamCity" | "teamID" | "teamLogo" | "teamName" | "teamShortName"
  >;
  winnerTeam: null | Pick<Team, "teamID">;
  teamHasPossession: null | Pick<Team, "teamID">;
  teamInRedzone: null | Pick<Team, "teamID">;
};

const query = `
  query GetGamesForWeek($week: Int!) {
    getGamesForWeek(Week: $week) {
      gameID
      gameStatus
      gameKickoff
      homeTeam {
        teamID
        teamCity
        teamName
        teamShortName
        teamLogo
      }
      gameHomeScore
      visitorTeam {
        teamID
        teamCity
        teamName
        teamShortName
        teamLogo
      }
      gameVisitorScore
      winnerTeam {
        teamID
      }
      gameTimeLeftInQuarter
      teamHasPossession {
        teamID
      }
      teamInRedzone {
        teamID
      }
    }
  }
`;

export const useGamesForWeek = (week: number) => ({
  data: {
    getGamesForWeek: [] as Array<GameForWeek>,
    query,
    week,
  },
  error: null,
  isValidating: false,
});
