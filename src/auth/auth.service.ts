import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
	constructor(private userService: UserService) {}

	async validateUserViaEmail(email: string, password: string): Promise<any> {
		const user = await this.userService.findUserByEmail(email);
		const passwordsAreEqual = await bcrypt.compare(password, user.password);

		if (user && passwordsAreEqual) {
			const { password, ...result } = user;
			return result;
		}

		return null;
	}

	async login(user: User) {
		return {
			access_token: 'jwt', //TODO JWT
			user: user,
		};
	}
}
