import { IsEmail, IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { IsStrongPassword } from './is-strong-password.decorator';

@InputType()
export class UserRegisterDTO {
	@Field()
	@IsNotEmpty()
	phoneNumber: string;

	@Field()
	@IsEmail()
	email: string;

	@Field()
	@IsNotEmpty()
	@IsStrongPassword()
	password: string;
}
