const errorStartPhrase = 'Error:';
export const errors = {
	invalidPhoneNumber: `${errorStartPhrase} Invalid phone number.`,
	passwordCondition: `${errorStartPhrase} Password must be at least 8 characters long and contain both letters and numbers.`,
	emailNotFound: (email: string) =>
		`${errorStartPhrase} No user with ${email} found.`,
	isNotUniqueEmailOrPhone: `${errorStartPhrase} Email or phone is already in use.`,
	tooFastForNewCode: `${errorStartPhrase} Last code timeout is still active, try again later.`,
	phoneIsInUse: `${errorStartPhrase} Phone is already in use. Use another phone number.`,
	userNotFound: `${errorStartPhrase} User not found.`,
	expiredCode: `${errorStartPhrase} Code is expired. Request another code`,
	tooManyCodeAttempts: `${errorStartPhrase} Too many attempts. Try again later.`,
	wrongCode: `${errorStartPhrase} Invalid code. Try again.`,
	invalidRegion: `${errorStartPhrase} Unsupported region.`,
};
