import type { User } from '@prisma/client';

export const isUser = (user: unknown): user is User =>
	typeof user === 'object' && !!user && 'done_registering' in user;
