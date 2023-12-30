import { Mutation, Resolver, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { LoginUserInput } from './dto/login-user.input';
import {
	UnauthorizedException,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { LoginByPhoneUserInput } from './dto/loginByPhone-user.input';

@Resolver()
export class AuthResolver {
	constructor(private authService: AuthService) {}

	@Mutation(() => LoginResponse, { nullable: true })
	@UseGuards(GqlAuthGuard)
	loginByEmail(
		@Args('loginUserInput') loginUserInput: LoginUserInput,
		@Context() context,
	) {
		return this.authService.login(context.user);
	}

	//TODO: Перевести на Guard
	@Mutation(() => LoginResponse)
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async loginWithPhone(
		@Args('loginByPhoneUserInput', { type: () => LoginByPhoneUserInput })
		loginByPhone: LoginByPhoneUserInput,
	): Promise<LoginResponse> {
		const user =
			await this.authService.validateUserViaPhoneNumber(loginByPhone);
		if (!user) {
			throw new UnauthorizedException();
		}
		return this.authService.login(user);
	}
}
