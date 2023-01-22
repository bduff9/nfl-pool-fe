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
import React from "react";
import Popover from "react-bootstrap/Popover";

/**
 * Popover classes
 * popover fade show bs-popover-end
 * popover-arrow
 * popover-header
 * popover-body
 */

export const dynamicPopover = (body: string, id: string, title: string): JSX.Element => (
  <Popover id={`popover-${id}`}>
    <Popover.Header as="h3" className="mt-0">
      {title}
    </Popover.Header>
    <Popover.Body>{body}</Popover.Body>
  </Popover>
);

export const autoPickPopover = (
  <Popover id="popover-auto-pick">
    <Popover.Header as="h3" className="mt-0">
      Auto Picks
    </Popover.Header>
    <Popover.Body>
      These allow you to have the system automatically make a pick for you if you forget.
      Once a game starts, if you have not made a pick for that game, a winner will be
      chosen with your lowest point value based on the strategy you select below:
      <ul>
        <li>
          <strong>Home:</strong> the home team will be picked
        </li>
        <li>
          <strong>Away:</strong> the visiting team will be picked
        </li>
        <li>
          <strong>Random:</strong> a randomly selected team will be picked
        </li>
      </ul>
    </Popover.Body>
  </Popover>
);

export const paymentPopover = (
  <Popover id="popover-payment">
    <Popover.Header as="h3" className="mt-0">
      Payment Info
    </Popover.Header>
    <Popover.Body>
      If you want to receive any prize money, you need to enter your exact payment account
      information here (i.e. email, username or phone number for your account).{" "}
      <strong>
        This is your responsibility as we will not be chasing people down to pay them.
      </strong>
    </Popover.Body>
  </Popover>
);

export const phonePopover = (
  <Popover id="popover-phone">
    <Popover.Header as="h3" className="mt-0">
      Phone Number
    </Popover.Header>
    <Popover.Body>
      If you would like to receive SMS notifications from the confidence pool, please
      enter a valid phone number. This is not required, however, you will need to enable
      the notifications you would like to receive after you enter a valid phone number.
    </Popover.Body>
  </Popover>
);

export const survivorPopover = (
  <Popover id="popover-survivor">
    <Popover.Header as="h3" className="mt-0">
      Survivor Pool
    </Popover.Header>
    <Popover.Body>
      You can choose to join or leave the survivor pool up until the start of the first
      game of the season. For more questions,{" "}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/support#survivorpool" target="survivorFAQ">
        click here
      </a>
    </Popover.Body>
  </Popover>
);
