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
import Adapters from 'next-auth/adapters';
import { EntitySchemaColumnOptions } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default class VerificationRequest extends Adapters.TypeORM.Models.VerificationRequest
	.model {
	createdBy: string;
	updatedBy: string;

	constructor (identifier: string, token: string, expires: Date) {
		super(identifier, token, expires);
		this.createdBy = 'NEXT_AUTH';
		this.updatedBy = 'NEXT_AUTH';
	}
}

export const VerificationRequestSchema = {
	name: 'VerificationRequest',
	tableName: 'VerificationRequests',
	target: VerificationRequest,
	columns: {
		...(Adapters.TypeORM as any).Models.VerificationRequest.schema.columns,
		id: {
			primary: true,
			type: 'int',
			generated: true,
			name: 'VerificationRequestID',
		} as EntitySchemaColumnOptions,
		identifier: {
			...(Adapters.TypeORM as any).Models.VerificationRequest.schema.columns.identifier,
			name: 'VerificationRequestIdentifier',
		} as EntitySchemaColumnOptions,
		token: {
			...(Adapters.TypeORM as any).Models.VerificationRequest.schema.columns.token,
			name: 'VerificationRequestToken',
		} as EntitySchemaColumnOptions,
		expires: {
			...(Adapters.TypeORM as any).Models.VerificationRequest.schema.columns.expires,
			name: 'VerificationRequestExpires',
		} as EntitySchemaColumnOptions,
		createdAt: {
			type: 'timestamp',
			createDate: true,
			name: 'VerificationRequestAdded',
		} as EntitySchemaColumnOptions,
		createdBy: {
			default: 'NEXT_AUTH',
			length: 50,
			name: 'VerificationRequestAddedBy',
			type: 'varchar',
		} as EntitySchemaColumnOptions,
		updatedAt: {
			type: 'timestamp',
			updateDate: true,
			name: 'VerificationRequestUpdated',
		} as EntitySchemaColumnOptions,
		updatedBy: {
			default: 'NEXT_AUTH',
			length: 50,
			name: 'VerificationRequestUpdatedBy',
			type: 'varchar',
		} as EntitySchemaColumnOptions,
	},
};
