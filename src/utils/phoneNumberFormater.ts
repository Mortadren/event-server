import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Region } from '../user/dto/phone.config';

function formatPhoneNumber(phoneNumber: string, region: Region): string {
	const parsedNumber = parsePhoneNumberFromString(phoneNumber, region);
	if (parsedNumber) {
		return parsedNumber.formatInternational();
	}
	return phoneNumber;
}
export default formatPhoneNumber;
