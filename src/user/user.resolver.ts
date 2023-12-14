import { Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Query } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => String)
	async users() {
		return this.userService.getAll();
	}
}
