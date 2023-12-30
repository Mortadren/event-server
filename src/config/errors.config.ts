const errorStartPhrase = 'Error:';

const errorCreator = (message: string, index: number) => {
	return `${errorStartPhrase} -0${index}- ${message}`;
};

const errorMessages = {
	invalidPhoneNumber: `Invalid phone number.`,
	passwordCondition: `Password must be at least 8 characters long and contain both letters and numbers.`,
	emailNotFound: `No user with such email found.`,
	isNotUniqueEmailOrPhone: `Email or phone is already in use.`,
	tooFastForNewCode: `Last code timeout is still active, try again later.`,
	phoneIsInUse: `Phone is already in use. Use another phone number.`,
	userNotFound: `User not found.`,
	expiredCode: `Code is expired. Request another code`,
	tooManyCodeAttempts: `Too many attempts. Try again later.`,
	wrongCode: `Invalid code. Try again.`,
	invalidRegion: `Unsupported region.`,
};

export const errorsConfig = Object.fromEntries(
	Object.entries(errorMessages).map(([key, value], index) => [
		key,
		errorCreator(value, index),
	]),
);
