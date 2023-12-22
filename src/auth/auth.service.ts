import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginByPhoneUserInput } from './dto/loginByPhone-user.input';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) {}

	async validateUserViaEmail(email: string, password: string): Promise<any> {
		const user = await this.userService.findUserByEmail(email);

		if (user && user.verified) {
			const passwordsAreEqual = await bcrypt.compare(password, user.password);
			if (passwordsAreEqual ) {
				const { password, ...result } = user;
				return result;
			}
		}
		return null;
	}

	async validateUserViaPhoneNumber(loginByPhone: LoginByPhoneUserInput): Promise<any> {
		const {phoneNumber, region, password } = loginByPhone;
		const user = await this.userService.findUserByPhoneNumber(phoneNumber, region);

		if (user && user.verified) {
			const passwordsAreEqual = await bcrypt.compare(password, user.password);
			if (passwordsAreEqual) {
				const { password, ...result } = user;
				return result;
			}
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
