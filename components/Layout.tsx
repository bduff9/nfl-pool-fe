import React, { FC } from 'react';

type LayoutProps = {
	isLoading: boolean;
};

//TODO: use loading to show page loading
const Layout: FC<LayoutProps> = ({ children }) => <div>{children}</div>;

export default Layout;
