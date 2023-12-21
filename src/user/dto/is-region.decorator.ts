import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';
import { errors } from '../../config/errors';
import { regions } from './phone.config';

export function IsRegion(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isRegion',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const isRegion = regions.includes(value);
					return value && isRegion;
				},
				defaultMessage(args: ValidationArguments) {
					return errors.invalidRegion;
				},
			},
		});
	};
}
