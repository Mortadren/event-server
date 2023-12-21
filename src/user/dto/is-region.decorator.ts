import { registerDecorator, ValidationOptions } from 'class-validator';
import { errorsConfig } from '../../config/errors.config';
import { regions } from '../../config/smsCode.config';

export function IsRegion(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isRegion',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: validationOptions,
			validator: {
				validate(value: any) {
					const isRegion = regions.includes(value);
					return value && isRegion;
				},
				defaultMessage() {
					return errorsConfig.invalidRegion;
				},
			},
		});
	};
}
