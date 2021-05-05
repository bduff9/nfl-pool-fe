import clsx from 'clsx';
import React, { FC } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

import styles from './MenuAccordion.module.scss';

const MenuAccordionButton: FC<{ eventKey: string }> = ({ children, eventKey }) => {
	const decoratedOnClick = useAccordionButton(eventKey);

	return (
		<button
			className={clsx('w-100', 'text-start', 'py-2', 'rounded', styles['btn-menu'])}
			onClick={decoratedOnClick}
			type="button"
		>
			{children}
		</button>
	);
};

const MenuAccordion: FC<{ show?: boolean; title: string }> = ({
	children,
	show = true,
	title,
}) => {
	if (!show) {
		return null;
	}

	return (
		<div>
			<MenuAccordionButton eventKey={title}>{title}</MenuAccordionButton>
			<Accordion.Collapse eventKey={title}>
				<div>{children}</div>
			</Accordion.Collapse>
		</div>
	);
};

export default MenuAccordion;
