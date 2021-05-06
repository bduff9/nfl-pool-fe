/*
NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
Copyright (C) 2015-present Brian Duffey and Billy Alexander
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.  If not, see {http://www.gnu.org/licenses/}.
Home: https://asitewithnoname.com/
*/
import React from 'react';
import Popover from 'react-bootstrap/Popover';

/**
 * Popover classes
 * popover fade show bs-popover-end
 * popover-arrow
 * popover-header
 * popover-body
 */

export const paymentPopover = (
	<Popover id="popover-payment">
		<Popover.Header as="h3" className="mt-0">
			Payment Info
		</Popover.Header>
		<Popover.Body>
			If you want to receive any prize money, you need to enter your exact payment account
			information here (i.e. email, username or phone number for your account).{' '}
			<strong>
				This is your responsibility as we will not be chasing people down to pay them.
			</strong>
		</Popover.Body>
	</Popover>
);

export const survivorPopover = (
	<Popover id="popover-survivor">
		<Popover.Header as="h3" className="mt-0">
			Survivor Pool
		</Popover.Header>
		<Popover.Body>
			You can choose to join or leave the survivor pool up until the start of the first game
			of the season. For more questions,{' '}
			<a href="/support#survivorpool" target="survivorFAQ">
				click here
			</a>
		</Popover.Body>
	</Popover>
);
