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
import clsx from 'clsx';
import React, { VFC } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

import styles from './MenuAccordion.module.scss';

type MenuAccordionButtonProps = { children: string; eventKey: string };

const MenuAccordionButton: VFC<MenuAccordionButtonProps> = ({ children, eventKey }) => {
	const decoratedOnClick = useAccordionButton(eventKey);

	return (
		<button
			className={clsx('w-100', 'text-start', 'py-2', 'ps-2', 'rounded', styles['btn-menu'])}
			onClick={decoratedOnClick}
			type="button"
		>
			{children}
		</button>
	);
};

type MenuAccordionProps = { children: Array<JSX.Element>; show?: boolean; title: string };

const MenuAccordion: VFC<MenuAccordionProps> = ({ children, show = true, title }) => {
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
