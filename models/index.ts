import Account, { AccountSchema } from './Account';
import Session, { SessionSchema } from './Session';
import User, { UserSchema } from './User';
import VerificationRequest, { VerificationRequestSchema } from './VerificationRequest';

export default {
	Account: {
		model: Account,
		schema: AccountSchema,
	},
	User: {
		model: User,
		schema: UserSchema,
	},
	Session: {
		model: Session,
		schema: SessionSchema,
	},
	VerificationRequest: {
		model: VerificationRequest,
		schema: VerificationRequestSchema,
	},
};
