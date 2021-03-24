type TLoginError =
	| 'InvalidEmail'
	| 'MissingSystemProperty'
	| 'OAuthAccountNotLinked'
	| 'RegistrationOver';

const isLoginError = (arg: unknown): arg is TLoginError =>
	typeof arg === 'string' && arg.trim() !== '';

export const formatError = (error: unknown): string => {
	if (isLoginError(error)) {
		switch (error) {
			case 'InvalidEmail':
				return 'It looks like your email is not valid, please double check it and try again';
			case 'MissingSystemProperty':
				console.error('Missing property `PaymentDueWeek`');

				return 'System error, please contact an administrator';
			case 'OAuthAccountNotLinked':
				return "It looks like you haven't linked your account yet, please sign in using the previous method and then link this account to be able to use it to sign in";
			case 'RegistrationOver':
				return 'Sorry, registration is over for this year, please try again next season!';
			default:
				console.error('Invalid Login Error type found:', error);

				return 'Something went wrong, please try again';
		}
	}

	return '';
};
