import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';
import { isPhoneNumber } from 'class-validator';
import { errors } from '../../config/errors';

export function IsPhoneNumberDynamic(
	property: string,
	validationOptions?: ValidationOptions,
) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isPhoneNumberDynamic',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [property],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const relatedValue = (args.object as any)[
						args.constraints[0]
					];
					return (
						typeof value === 'string' &&
						isPhoneNumber(value, relatedValue)
					);
				},
				defaultMessage() {
					return errors.invalidPhoneNumber;
				},
			},
		});
	};
}
