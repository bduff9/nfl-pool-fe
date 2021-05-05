import React, { FC } from 'react';
import Popover from 'react-bootstrap/Popover';

type PopoverProps = {
	id: string;
	title: string;
};

/**
 * Popover classes
 * popover fade show bs-popover-end
 * popover-arrow
 * popover-header
 * popover-body
 */
const CustomPopover: FC<PopoverProps> = ({ children, id, title }) => (
	<Popover id={`popover-${id}`}>
		<Popover.Header as="h3" className="mt-0">
			{title}
		</Popover.Header>
		<Popover.Body>{children}</Popover.Body>
	</Popover>
);

export const paymentPopover = (
	<CustomPopover id="payment" title="Payment Info">
		If you want to receive any prize money, you need to enter your exact payment account
		information here (i.e. email, username or phone number for your account).{' '}
		<strong>
			This is your responsibility as we will not be chasing people down to pay them.
		</strong>
	</CustomPopover>
);

export const survivorPopover = (
	<CustomPopover id="survivor" title="Survivor Pool">
		You can choose to join or leave the survivor pool up until the start of the first game
		of the season. For more questions,{' '}
		<a href="/support#survivorpool" target="survivorFAQ">
			click here
		</a>
	</CustomPopover>
);
