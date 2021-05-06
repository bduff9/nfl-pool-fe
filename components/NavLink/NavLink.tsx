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
import React, { FC } from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';

import styles from './NavLink.module.scss';

type NavLinkProps = Partial<LinkProps> & {
	isNested?: boolean;
	onClick?: () => void;
	show?: boolean;
};

const NavLink: FC<NavLinkProps> = ({
	children,
	href,
	isNested = false,
	onClick,
	show = true,
}) => {
	const router = useRouter();
	const isActive = router.pathname === href;

	if (!show) {
		return null;
	}

	if (href) {
		return (
			<Link href={href}>
				<a
					className={clsx(
						'd-inline-block',
						'w-100',
						'py-2',
						'text-decoration-none',
						'rounded',
						styles['nav-link'],
						isActive && styles.active,
						isNested && styles.nested,
						isNested ? 'ps-4' : 'ps-2',
					)}
				>
					{children}
				</a>
			</Link>
		);
	}

	return (
		<button
			className={clsx(
				'text-start',
				'w-100',
				'py-2',
				'rounded',
				styles['nav-button'],
				isActive && styles.active,
				isNested && styles.nested,
				isNested ? 'ps-4' : 'ps-2',
			)}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default NavLink;
