import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserRegisterDTO } from './dto/user-register.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => User)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => Number)
	async getUsersCount() {
		return this.userService.getNum();
	}

	// Доступ реализован только при наличии JWT токена в запросе из-за @UseGuards(JwtAuthGuard)
	@Query(() => [User])
	@UseGuards(JwtAuthGuard)
	async getUsers(@Context() context) {
		// Можно получить доступ к данным по авторизованному юзеру через context.req.user. Этот параметр конфигурируется в jwt.strategy.ts через return
		return this.userService.getAll();
	}

	@Mutation(() => User)
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async register(
		@Args('registerInput') registerInput: UserRegisterDTO,
	): Promise<User> {
		return this.userService.register(registerInput);
	}
}
