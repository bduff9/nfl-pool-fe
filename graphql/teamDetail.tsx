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

export type DetailTeam = Pick<
  Team,
  | "teamID"
  | "teamCity"
  | "teamName"
  | "teamConference"
  | "teamDivision"
  | "teamRushDefenseRank"
  | "teamPassDefenseRank"
  | "teamRushOffenseRank"
  | "teamPassOffenseRank"
  | "teamPrimaryColor"
  | "teamSecondaryColor"
  | "teamRecord"
> & {
  teamHistory: Array<
    Pick<Game, "gameID" | "gameWeek" | "gameHomeScore" | "gameVisitorScore"> & {
      homeTeam: Pick<Team, "teamID" | "teamShortName">;
      visitorTeam: Pick<Team, "teamID" | "teamShortName">;
      winnerTeam: null | Pick<Team, "teamID">;
    }
  >;
};

const query = `
  query GameDetails($gameID: Int!) {
    getGame(GameID: $gameID) {
      gameHomeSpread
      homeTeam {
        teamID
        teamCity
        teamName
        teamConference
        teamDivision
        teamRushDefenseRank
        teamPassDefenseRank
        teamRushOffenseRank
        teamPassOffenseRank
        teamPrimaryColor
        teamSecondaryColor
        teamRecord
        teamHistory {
          gameID
          gameWeek
          homeTeam {
            teamID
            teamShortName
          }
          gameHomeScore
          visitorTeam {
            teamID
            teamShortName
          }
          gameVisitorScore
          winnerTeam {
            teamID
          }
        }
      }
      gameVisitorSpread
      visitorTeam {
        teamID
        teamCity
        teamName
        teamConference
        teamDivision
        teamRushDefenseRank
        teamPassDefenseRank
        teamRushOffenseRank
        teamPassOffenseRank
        teamPrimaryColor
        teamSecondaryColor
        teamRecord
        teamHistory {
          gameID
          gameWeek
          homeTeam {
            teamID
            teamShortName
          }
          gameHomeScore
          visitorTeam {
            teamID
            teamShortName
          }
          gameVisitorScore
          winnerTeam {
            teamID
          }
        }
      }
    }
  }
`;

export const useTeamDetails = (gameID: number) => ({
  data: {
    getGame: {} as Pick<Game, "gameHomeSpread" | "gameVisitorSpread"> & {
      homeTeam: DetailTeam;
      visitorTeam: DetailTeam;
    },
    gameID,
    query,
  },
  error: null,
  isValidating: false,
});
