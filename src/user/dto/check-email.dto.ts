import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class CheckEmailDTO {
	@IsNotEmpty()
	@IsEmail()
	@Field(() => String)
	email: string;
}

@ObjectType()
export class CheckedEmailDTO {
	@Field(() => Boolean)
	unique: boolean;

	@Field(() => String)
	field: string;
}
