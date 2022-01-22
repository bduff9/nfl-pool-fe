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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default class Account extends Adapters.TypeORM.Models.Account.model {
	createdBy: string;
	updatedBy: string;

	constructor (
		userId: number,
		providerId: string,
		providerType: string,
		providerAccountId: string,
		refreshToken: string,
		accessToken: string,
		accessTokenExpires: Date,
	) {
		super(
			userId,
			providerId,
			providerType,
			providerAccountId,
			refreshToken,
			accessToken,
			accessTokenExpires,
		);
		this.createdBy = 'NEXT_AUTH';
		this.updatedBy = 'NEXT_AUTH';
	}
}

export const AccountSchema = {
	name: 'Account',
	tableName: 'Accounts',
	target: Account,
	columns: {
		...(Adapters.TypeORM as any).Models.Account.schema.columns,
		id: {
			primary: true,
			type: 'int',
			generated: true,
			name: 'AccountID',
		} as EntitySchemaColumnOptions,
		compoundId: {
			...(Adapters.TypeORM as any).Models.Account.schema.columns.compoundId,
			name: 'AccountCompoundID',
		} as EntitySchemaColumnOptions,
		userId: {
			...(Adapters.TypeORM as any).Models.Account.schema.columns.userId,
			name: 'UserID',
		} as EntitySchemaColumnOptions,
		providerType: {
			...(Adapters.TypeORM as any).Models.Account.schema.columns.providerType,
			name: 'AccountProviderType',
		} as EntitySchemaColumnOptions,
		providerId: {
			...(Adapters.TypeORM as any).Models.Account.schema.columns.providerId,
			name: 'AccountProviderID',
		} as EntitySchemaColumnOptions,
		providerAccountId: {
			...(Adapters.TypeORM as any).Models.Account.schema.columns.providerAccountId,
			name: 'AccountProviderAccountID',
		} as EntitySchemaColumnOptions,
		refreshToken: {
			...(Adapters.TypeORM as any).Models.Account.schema.columns.refreshToken,
			name: 'AccountRefreshToken',
		} as EntitySchemaColumnOptions,
		accessToken: {
			...(Adapters.TypeORM as any).Models.Account.schema.columns.accessToken,
			name: 'AccountAccessToken',
		} as EntitySchemaColumnOptions,
		accessTokenExpires: {
			...(Adapters.TypeORM as any).Models.Account.schema.columns.accessTokenExpires,
			name: 'AccountAccessTokenExpires',
		} as EntitySchemaColumnOptions,
		createdAt: {
			type: 'timestamp',
			createDate: true,
			name: 'AccountAdded',
		} as EntitySchemaColumnOptions,
		createdBy: {
			default: 'NEXT_AUTH',
			length: 50,
			name: 'AccountAddedBy',
			type: 'varchar',
		} as EntitySchemaColumnOptions,
		updatedAt: {
			type: 'timestamp',
			updateDate: true,
			name: 'AccountUpdated',
		} as EntitySchemaColumnOptions,
		updatedBy: {
			default: 'NEXT_AUTH',
			length: 50,
			name: 'AccountUpdatedBy',
			type: 'varchar',
		} as EntitySchemaColumnOptions,
	},
};
