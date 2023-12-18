import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserRegisterDTO {
	@Field()
	@IsNotEmpty()
	name: string;

	@Field()
	@IsEmail()
	email: string;

	@Field()
	@IsNotEmpty()
	@MinLength(6)
	password: string;
}
