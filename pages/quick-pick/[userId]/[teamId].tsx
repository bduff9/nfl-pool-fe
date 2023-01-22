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
import { useRouter } from "next/router";
import type { FC } from "react";
import React, { useEffect } from "react";

import CustomHead from "../../../components/CustomHead/CustomHead";
import { quickPick } from "../../../graphql/quickPick";
import styles from "../../../styles/quick-pick.module.scss";
import { isNumber } from "../../../utils/numbers";

const QuickPick: FC = () => {
  const router = useRouter();
  const { userId, teamId } = router.query;

  useEffect(() => {
    const doQuickPick = async () => {
      if (isNumber(userId) && isNumber(teamId)) {
        await quickPick(+teamId, +userId);
      }

      router.replace("/picks/set");
    };

    if (router.isReady) doQuickPick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, userId, router.isReady]);

  return (
    <div className="min-vh-100">
      <CustomHead title="Quick Pick" />
      <h2
        className={clsx(
          "position-absolute",
          "top-50",
          "start-50",
          "translate-middle",
          styles.message,
        )}
      >
        Saving your quick pick...
      </h2>
    </div>
  );
};

// ts-prune-ignore-next
export default QuickPick;
