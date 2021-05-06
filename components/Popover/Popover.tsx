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
