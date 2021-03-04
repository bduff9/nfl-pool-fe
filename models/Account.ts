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
		...Adapters.TypeORM.Models.Account.schema.columns,
		id: {
			primary: true,
			type: 'int',
			generated: true,
			name: 'AccountID',
		} as EntitySchemaColumnOptions,
		compoundId: {
			...Adapters.TypeORM.Models.Account.schema.columns.compoundId,
			name: 'AccountCompoundID',
		} as EntitySchemaColumnOptions,
		userId: {
			...Adapters.TypeORM.Models.Account.schema.columns.userId,
			name: 'UserID',
		} as EntitySchemaColumnOptions,
		providerType: {
			...Adapters.TypeORM.Models.Account.schema.columns.providerType,
			name: 'AccountProviderType',
		} as EntitySchemaColumnOptions,
		providerId: {
			...Adapters.TypeORM.Models.Account.schema.columns.providerId,
			name: 'AccountProviderID',
		} as EntitySchemaColumnOptions,
		providerAccountId: {
			...Adapters.TypeORM.Models.Account.schema.columns.providerAccountId,
			name: 'AccountProviderAccountID',
		} as EntitySchemaColumnOptions,
		refreshToken: {
			...Adapters.TypeORM.Models.Account.schema.columns.refreshToken,
			name: 'AccountRefreshToken',
		} as EntitySchemaColumnOptions,
		accessToken: {
			...Adapters.TypeORM.Models.Account.schema.columns.accessToken,
			name: 'AccountAccessToken',
		} as EntitySchemaColumnOptions,
		accessTokenExpires: {
			...Adapters.TypeORM.Models.Account.schema.columns.accessTokenExpires,
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
