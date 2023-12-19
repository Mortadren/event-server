import { Mutation, Resolver, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { LoginUserInput } from './dto/login-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';

@Resolver()
export class AuthResolver {
	constructor(private authService: AuthService) {}

	@Mutation(() => LoginResponse, { nullable: true })
	@UseGuards(GqlAuthGuard)
	login(
		@Args('loginUserInput') loginUserInput: LoginUserInput,
		@Context() context,
	) {
		return this.authService.login(context.user);
	}
}
