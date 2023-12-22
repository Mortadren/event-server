import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserRegisterDTO } from './dto/user-register.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Region } from '../config/smsCode.config';

@Resolver(() => User)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	// Доступ реализован только при наличии JWT токена в запросе из-за @UseGuards(JwtAuthGuard)
	@Query(() => [User])
	@UseGuards(JwtAuthGuard)
	async getUsers(@Context() context) {
		// Можно получить доступ к данным по авторизованному юзеру через context.req.user. Этот параметр конфигурируется в jwt.strategy.ts через return
		return this.userService.getAll();
	}

	@Mutation(() => String)
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async requestVerificationCode(
		@Args('registerInput', { type: () => UserRegisterDTO })
		registerInput: UserRegisterDTO,
	): Promise<string> {
		return this.userService.generateVerificationCode(registerInput);
	}

	@Mutation(() => User)
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async verifyPhoneNumber(
		@Args('phoneNumber') phoneNumber: string,
		@Args('region') region: Region,
		@Args('code') code: string,
	): Promise<User> {
		return this.userService.verifyPhoneNumber(phoneNumber, region, code);
	}
}
