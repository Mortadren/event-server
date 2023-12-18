import { Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Query } from '@nestjs/graphql';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

//TODO: разобраться с резолвером, и обращениям к репе юзеререпозитори.
@Resolver()
export class UserResolver {
	constructor(
		@InjectRepository(User)
		private readonly userService: UserService,
	) {}

	@Query(() => Array)
	async name() {
		return this.userService.getAll();
	}

	@Query(() => Number)
	async getNum() {
		return this.userService.getNum();
	}
}
