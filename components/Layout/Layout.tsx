import LogRocket from 'logrocket';
import { useSession } from 'next-auth/client';
import React, { FC, useEffect, useState } from 'react';

import { TUser } from '../../models/User';
import { TitleContext, WeekContext } from '../../utils/context';
import { TSessionUser } from '../../utils/types';
import Sidebar from '../Sidebar/Sidebar';

type LayoutProps = {
	isLoading?: boolean;
};

const Layout: FC<LayoutProps> = props => {
	const { children } = props;
	const [session, loading] = useSession();
	const titleContext = useState<string>('Welcome');
	const weekContext = useState<number>(0);

	useEffect((): void => {
		if (session && !loading) {
			const { name, image: picture, ...rest } = session.user as TSessionUser;

			LogRocket.identify(`${(session.user as TUser).id}`, {
				name: name || '',
				picture: picture || '',
				...rest,
			});
		}
	}, [session, loading]);

	//TODO: use loading to show page loading

	return (
		<TitleContext.Provider value={titleContext}>
			<WeekContext.Provider value={weekContext}>
				<div className="container-fluid h-100">
					<div className="row h-100">
						{session && session.user ? (
							<>
								<Sidebar user={session.user as TSessionUser} />
								<div className="h-100 col col-sm-9 offset-sm-3 ml-sm-auto ml-print-0 col-lg-10 offset-lg-2 main">
									{children}
								</div>
							</>
						) : (
							<div className="h-100 col">{children}</div>
						)}
					</div>
				</div>
			</WeekContext.Provider>
		</TitleContext.Provider>
	);
};

Layout.whyDidYouRender = true;

export default Layout;
