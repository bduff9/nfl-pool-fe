/*******************************************************************************
 * NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
 * Copyright (C) 2015-present Brian Duffey and Billy Alexander
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
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { signIn } from 'next-auth/client';
import React, { FC, useState } from 'react';

import styles from './SocialAuthButton.module.scss';

type SocialAuthButtonProps = {
	isLinked?: boolean;
	isRegister?: boolean;
	isSignIn?: boolean;
	type: 'Google' | 'Twitter';
};

const SocialAuthButton: FC<SocialAuthButtonProps> = ({
	isLinked = false,
	isRegister = false,
	isSignIn = false,
	type,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const lowered = type.toLowerCase();
	let title = `Link ${type} account`;

	if (isSignIn) {
		title = `${isRegister ? 'Register with' : 'Sign in with'} ${type}`;
	} else if (isLinked) {
		title = `${type} linked`;
	}

	return (
		<button
			className={clsx(
				'btn',
				type === 'Google' && styles['btn-google'],
				type === 'Twitter' && styles['btn-twitter'],
				'col-md-6',
			)}
			disabled={isLoading || isLinked}
			onClick={async (): Promise<void> => {
				setIsLoading(true);
				await signIn(lowered);
			}}
			title={title}
			type="button"
		>
			{type === 'Google' && <FontAwesomeIcon icon={faGoogle} />}
			{type === 'Twitter' && <FontAwesomeIcon icon={faTwitter} />}
			&nbsp;
			<span className="d-none d-md-inline">{isLoading ? 'Redirecting...' : title}</span>
		</button>
	);
};

SocialAuthButton.whyDidYouRender = true;

export default SocialAuthButton;
