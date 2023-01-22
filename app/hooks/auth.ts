import type { User } from '@prisma/client';
import type { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

import { isUser } from '~/guards/auth';

type UseUser =
	| {
			user: User | null;
			redirected: true;
	  }
	| {
			user: User;
			redirected: false;
	  };

export const useIsDoneRegistering = (session: Session | null): UseUser => {
	const router = useRouter();
	const user = session?.user;

	if (!isUser(user)) {
		router.replace('/auth/login');

		return { redirected: true, user: null };
	}

	if (!user.done_registering) {
		router.replace('/users/create');

		return { redirected: true, user };
	}

	return { redirected: false, user };
};
