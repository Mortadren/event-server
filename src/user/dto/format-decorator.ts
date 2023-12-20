import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from '../user.service';
import phoneNumberFormater from '../../utils/phoneNumberFormater';

async function isPhoneNumberUnique(
	phoneNumber: string,
	userService: UserService,
): Promise<boolean> {
	const existingUser = await userService.findUserByPhone(phoneNumber);
	return !existingUser;
}

export class IsUniquePhoneNumberConstraint
	implements ValidatorConstraintInterface
{
	constructor(private userService: UserService) {}

	async validate(phoneNumber: string, args: ValidationArguments) {
		const region = (args.object as any).region;
		const formattedNumber = phoneNumberFormater(phoneNumber, region);
		return await isPhoneNumberUnique(formattedNumber, this.userService);
	}
	defaultMessage(args: ValidationArguments) {
		return 'Please enter a valid';
	}
}

export function IsUniquePhoneNumber(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsUniquePhoneNumberConstraint,
		});
	};
}
