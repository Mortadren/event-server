import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
	@Field()
	access_token: string;

	@Field()
	refresh_token: string;
}

@ObjectType()
export class GenerateCodeResponse {
	@Field()
	verificationCode: string;

	@Field()
	timestampAfterTimeout: number;
}
