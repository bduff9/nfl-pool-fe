import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { signIn } from 'next-auth/client';
import React, { FC } from 'react';

import styles from './SocialAuthButton.module.scss';

type SocialAuthButtonProps = {
	isRegister?: boolean;
	isSignIn?: boolean;
	type: 'Google' | 'Twitter';
};

const SocialAuthButton: FC<SocialAuthButtonProps> = ({
	isRegister = false,
	isSignIn = false,
	type,
}) => {
	const lowered = type.toLowerCase();
	let title = `Link ${type} account`;

	if (isSignIn) {
		title = `${isRegister ? 'Register with' : 'Sign in with'} ${type}`;
	}

	return (
		<button
			className={clsx(
				'btn',
				type === 'Google' && styles['btn-google'],
				type === 'Twitter' && styles['btn-twitter'],
				'col-md-6',
			)}
			onClick={async (): Promise<void> => await signIn(lowered)}
			title={title}
			type="button"
		>
			{type === 'Google' && <FontAwesomeIcon icon={faGoogle} />}
			{type === 'Twitter' && <FontAwesomeIcon icon={faTwitter} />}
			&nbsp;
			<span className="d-none d-md-inline">{title}</span>
		</button>
	);
};

SocialAuthButton.whyDidYouRender = true;

export default SocialAuthButton;
