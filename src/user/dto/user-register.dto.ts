import { IsEmail, IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { IsStrongPassword } from './is-strong-password.decorator';
import { IsPhoneNumberDynamic } from './is-phone-number-dynamic.decorator';
import { IsRegion } from './is-region.decorator';
import { Region } from '../../config/smsCode.config';

@InputType()
export class UserRegisterDTO {
	@Field()
	@IsNotEmpty()
	@IsRegion()
	region: Region;

	@Field()
	@IsNotEmpty()
	@IsPhoneNumberDynamic('region')
	phoneNumber: string;

	@Field()
	@IsEmail()
	email: string;

	@Field()
	@IsNotEmpty()
	@IsStrongPassword()
	password: string;
}
