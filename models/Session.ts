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
		...Adapters.TypeORM.Models.Session.schema.columns,
		id: {
			primary: true,
			type: 'int',
			generated: true,
			name: 'SessionID',
		} as EntitySchemaColumnOptions,
		userId: {
			...Adapters.TypeORM.Models.Session.schema.columns.userId,
			name: 'UserID',
		} as EntitySchemaColumnOptions,
		expires: {
			...Adapters.TypeORM.Models.Session.schema.columns.expires,
			name: 'SessionExpires',
		} as EntitySchemaColumnOptions,
		sessionToken: {
			...Adapters.TypeORM.Models.Session.schema.columns.sessionToken,
			name: 'SessionToken',
		} as EntitySchemaColumnOptions,
		accessToken: {
			...Adapters.TypeORM.Models.Session.schema.columns.accessToken,
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
