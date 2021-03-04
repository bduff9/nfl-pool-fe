import Adapters from 'next-auth/adapters';
import { EntitySchemaColumnOptions } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default class VerificationRequest extends Adapters.TypeORM.Models
	.VerificationRequest.model {
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
		...Adapters.TypeORM.Models.VerificationRequest.schema.columns,
		id: {
			primary: true,
			type: 'int',
			generated: true,
			name: 'VerificationRequestID',
		} as EntitySchemaColumnOptions,
		identifier: {
			...Adapters.TypeORM.Models.VerificationRequest.schema.columns.identifier,
			name: 'VerificationRequestIdentifier',
		} as EntitySchemaColumnOptions,
		token: {
			...Adapters.TypeORM.Models.VerificationRequest.schema.columns.token,
			name: 'VerificationRequestToken',
		} as EntitySchemaColumnOptions,
		expires: {
			...Adapters.TypeORM.Models.VerificationRequest.schema.columns.expires,
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
