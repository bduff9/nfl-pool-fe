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
