import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/user.entity';

@ObjectType()
export class LoginResponse {
	@Field()
	access_token: string;

	@Field()
	refresh_token: string;

	// @Field(() => User)
	// user: User;
}
