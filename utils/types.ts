export type TAuthUser = {
	createdAt: Date;
	createdBy: string;
	doneRegistering?: boolean;
	email?: string;
	emailVerified: null | Date;
	firstName?: string;
	hasSurvivor?: boolean;
	id: number;
	image?: null | string;
	isAdmin?: boolean;
	isNewUser?: boolean;
	isTrusted?: boolean;
	lastName?: string;
	name?: null | string;
	updatedAt: Date;
	updatedBy: string;
};

export type TSessionUser = {
	doneRegistering?: boolean;
	email?: string;
	firstName?: string;
	hasSurvivor?: boolean;
	id: number;
	image?: null | string;
	isAdmin?: boolean;
	isTrusted?: boolean;
	lastName?: string;
	name?: null | string;
};

export type TTrueFalse = 'false' | 'true';
