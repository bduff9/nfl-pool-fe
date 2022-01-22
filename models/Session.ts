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
export default class Session extends Adapters.TypeORM.Models.Session.model {
	createdBy: string;
	updatedBy: string;

	constructor (userId: number, expires: Date, sessionToken: string, accessToken: string) {
		super(userId, expires, sessionToken, accessToken);
		this.createdBy = 'NEXT_AUTH';
		this.updatedBy = 'NEXT_AUTH';
	}
}

export const SessionSchema = {
	name: 'Session',
	tableName: 'Sessions',
	target: Session,
	columns: {
		...(Adapters.TypeORM as any).Models.Session.schema.columns,
		id: {
			primary: true,
			type: 'int',
			generated: true,
			name: 'SessionID',
		} as EntitySchemaColumnOptions,
		userId: {
			...(Adapters.TypeORM as any).Models.Session.schema.columns.userId,
			name: 'UserID',
		} as EntitySchemaColumnOptions,
		expires: {
			...(Adapters.TypeORM as any).Models.Session.schema.columns.expires,
			name: 'SessionExpires',
		} as EntitySchemaColumnOptions,
		sessionToken: {
			...(Adapters.TypeORM as any).Models.Session.schema.columns.sessionToken,
			name: 'SessionToken',
		} as EntitySchemaColumnOptions,
		accessToken: {
			...(Adapters.TypeORM as any).Models.Session.schema.columns.accessToken,
			name: 'SessionAccessToken',
		} as EntitySchemaColumnOptions,
		createdAt: {
			type: 'timestamp',
			createDate: true,
			name: 'SessionAdded',
		} as EntitySchemaColumnOptions,
		createdBy: {
			default: 'NEXT_AUTH',
			length: 50,
			name: 'SessionAddedBy',
			type: 'varchar',
		} as EntitySchemaColumnOptions,
		updatedAt: {
			type: 'timestamp',
			updateDate: true,
			name: 'SessionUpdated',
		} as EntitySchemaColumnOptions,
		updatedBy: {
			default: 'NEXT_AUTH',
			length: 50,
			name: 'SessionUpdatedBy',
			type: 'varchar',
		} as EntitySchemaColumnOptions,
	},
};
