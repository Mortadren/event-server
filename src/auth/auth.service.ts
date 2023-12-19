import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) {}

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
			access_token: this.jwtService.sign({ user, sub: user.id }),
			user,
		};
	}
}