/*******************************************************************************
 * NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
 * Copyright (C) 2015-present Brian Duffey
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
import Adapters from 'next-auth/adapters';
import { EntitySchemaColumnOptions } from 'typeorm';

export type TUser = {
	id: number;
	name: string;
	firstName: string;
	lastName: string;
	email: string;
	emailVerified: boolean;
	isTrusted: boolean;
	doneRegistering: boolean;
	isAdmin: boolean;
	hasSurvivor: boolean;
	image: null | string;
	createdAt: Date;
	createdBy: string;
	updatedAt: Date;
	updatedBy: string;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default class User extends Adapters.TypeORM.Models.User.model {
	createdBy: string;
	updatedBy: string;

	constructor (name: string, email: string, image: string, emailVerified: boolean) {
		super(name, email, image, emailVerified);
		this.createdBy = 'NEXT_AUTH';
		this.updatedBy = 'NEXT_AUTH';
	}
}

export const UserSchema = {
	name: 'User',
	tableName: 'Users',
	target: User,
	columns: {
		...(Adapters.TypeORM as any).Models.User.schema.columns,
		id: {
			primary: true,
			type: 'int',
			generated: true,
			name: 'UserID',
		} as EntitySchemaColumnOptions,
		name: {
			...(Adapters.TypeORM as any).Models.User.schema.columns.name,
			name: 'UserName',
		} as EntitySchemaColumnOptions,
		firstName: {
			length: 50,
			type: 'varchar',
			name: 'UserFirstName',
			nullable: true,
		} as EntitySchemaColumnOptions,
		lastName: {
			length: 50,
			type: 'varchar',
			name: 'UserLastName',
			nullable: true,
		} as EntitySchemaColumnOptions,
		email: {
			...(Adapters.TypeORM as any).Models.User.schema.columns.email,
			name: 'UserEmail',
		} as EntitySchemaColumnOptions,
		emailVerified: {
			...(Adapters.TypeORM as any).Models.User.schema.columns.emailVerified,
			name: 'UserEmailVerified',
		} as EntitySchemaColumnOptions,
		isTrusted: {
			type: 'boolean',
			name: 'UserTrusted',
			nullable: false,
		} as EntitySchemaColumnOptions,
		doneRegistering: {
			type: 'boolean',
			name: 'UserDoneRegistering',
			nullable: false,
		} as EntitySchemaColumnOptions,
		isAdmin: {
			type: 'boolean',
			name: 'UserIsAdmin',
			nullable: false,
		} as EntitySchemaColumnOptions,
		hasSurvivor: {
			type: 'boolean',
			name: 'UserPlaysSurvivor',
			nullable: false,
		} as EntitySchemaColumnOptions,
		image: {
			...(Adapters.TypeORM as any).Models.User.schema.columns.image,
			name: 'UserImage',
		} as EntitySchemaColumnOptions,
		createdAt: {
			type: 'timestamp',
			createDate: true,
			name: 'UserAdded',
		} as EntitySchemaColumnOptions,
		createdBy: {
			default: 'NEXT_AUTH',
			length: 50,
			name: 'UserAddedBy',
			type: 'varchar',
		} as EntitySchemaColumnOptions,
		updatedAt: {
			type: 'timestamp',
			updateDate: true,
			name: 'UserUpdated',
		} as EntitySchemaColumnOptions,
		updatedBy: {
			default: 'NEXT_AUTH',
			length: 50,
			name: 'UserUpdatedBy',
			type: 'varchar',
		} as EntitySchemaColumnOptions,
	},
};
