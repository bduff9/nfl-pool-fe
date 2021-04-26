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
