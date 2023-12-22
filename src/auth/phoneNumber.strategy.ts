import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginByPhoneUserInput } from './dto/loginByPhone-user.input';

@Injectable()
export class PhoneNumberStrategy extends PassportStrategy(Strategy, 'phone') {
	constructor(private authService: AuthService) {
		super({ usernameField: 'phoneNumber' });
	}

	async validate(loginByPhone: LoginByPhoneUserInput): Promise<any> {
		const user = await this.authService.validateUserViaPhoneNumber(loginByPhone);
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
