import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@bduff9/pro-duotone-svg-icons/faBars';
import LogRocket from 'logrocket';
import { useSession } from 'next-auth/client';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { TUser } from '../../models/User';
import { TUserObj } from '../../utils/types';
//import styles from './Layout.module.scss';

type LayoutProps = {
	isLoading?: boolean;
};

const Layout: FC<LayoutProps> = props => {
	const { children } = props;
	const [session, loading] = useSession();
	const [openMenu, setOpenMenu] = useState<boolean>(false);

	useEffect((): void => {
		setOpenMenu(false);
	}, [props]);

	useEffect((): void => {
		if (session && !loading) {
			const { name, picture, ...rest } = session.user as TUserObj;

			LogRocket.identify(`${(session.user as TUser).id}`, {
				name: name || '',
				picture: picture || '',
				...rest,
			});
		}
	}, [session, loading]);

	const toggleMenu = useCallback((): void => {
		setOpenMenu(!openMenu);
	}, [openMenu]);

	//TODO: use loading to show page loading

	return (
		<div className="container-fluid h-100">
			<div className="row h-100">
				{session ? (
					<>
						<span
							className="d-md-none d-print-none mobile-menu"
							onClick={toggleMenu}
						>
							<FontAwesomeIcon icon={faBars} size="lg" />
						</span>
						<div
							className={`h-100 col-10 col-sm-3 col-lg-2 d-md-block${
								openMenu ? '' : ' d-none'
							} d-print-none sidebar`}
						>
							TODO: Sidebar
						</div>
						<div className="h-100 col col-sm-9 ml-sm-auto ml-print-0 col-lg-10 main">
							{children}
						</div>
					</>
				) : (
					<div className="h-100 col">{children}</div>
				)}
			</div>
		</div>
	);
};

Layout.whyDidYouRender = true;

export default Layout;
