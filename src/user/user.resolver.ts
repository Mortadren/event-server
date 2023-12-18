import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { UserRegisterDTO } from './dto/user-register.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => Number)
	async getUsersCount() {
		return this.userService.getNum();
	}

	@Query(() => [User])
	async getUsers() {
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
