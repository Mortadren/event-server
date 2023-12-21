import { registerDecorator, ValidationOptions } from 'class-validator';
import { errors } from '../../config/errors';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isStrongPassword',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: validationOptions,
			validator: {
				validate(value: any) {
					const hasLetter = /[a-zA-Z]/.test(value);
					const hasNumber = /\d/.test(value);
					const hasValidLength = value.length >= 8;

					return hasLetter && hasNumber && hasValidLength;
				},
				defaultMessage() {
					return errors.passwordCondition;
				},
			},
		});
	};
}
