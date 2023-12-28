import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginByPhoneUserInput } from './dto/loginByPhone-user.input';
import { RefreshTokenService } from './refreshToken.service';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UserService))
		private userService: UserService,
		private jwtService: JwtService,
		private refreshTokenService: RefreshTokenService,
		private configService: ConfigService,
	) {}
	async issueTokens(
		user: User,
	): Promise<{ access_token: string; refresh_token: string }> {
		const access_token = this.jwtService.sign(
			{ sub: { userId: user.id } },
			{ expiresIn: '15m' },
		);
		const refresh_token = await this.generateRefreshToken(user.id);
		await this.refreshTokenService.saveRefreshToken(user.id, refresh_token); // Сохранение refresh токена в базу данных
		return { access_token, refresh_token };
	}

	async refreshTokens(
		refreshToken: string,
	): Promise<{ access_token: string }> {
		const decoded = this.jwtService.verify(refreshToken, {
			secret: this.configService.get<string>('JWT_SECRET'),
		});
		const user = await this.userService.findById(decoded.userId);

		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		await this.validateRefreshToken(decoded.userId, refreshToken); // Проверка валидности refresh токена
		// TODO: прокинуть переменные окружения
		const access_token = this.jwtService.sign(
			{ sub: { userId: user.id } },
			{ expiresIn: '15m' },
		);
		return { access_token };
	}

	async generateRefreshToken(userId: number): Promise<string> {
		return this.jwtService.sign({ sub: userId }, { expiresIn: '7d' });
	}

	async validateRefreshToken(
		userId: number,
		refreshToken: string,
	): Promise<void> {
		// Реализуйте проверку валидности refresh токена из базы данных и его срока действия
		const isValid = await this.refreshTokenService.validateRefreshToken(
			userId,
			refreshToken,
		);

		if (!isValid) {
			throw new UnauthorizedException('Invalid refresh token');
		}
	}

	async validateUserViaEmail(email: string, password: string): Promise<any> {
		const user = await this.userService.findUserByEmail(email);

		if (user && user.verified) {
			const passwordsAreEqual = await bcrypt.compare(
				password,
				user.password,
			);
			if (passwordsAreEqual) {
				const { password, ...result } = user;
				return result;
			}
		}
		return null;
	}

	async validateUserViaPhoneNumber(
		loginByPhone: LoginByPhoneUserInput,
	): Promise<any> {
		const { phoneNumber, region, password } = loginByPhone;
		console.log(this.userService.findUserByPhoneNumber);
		const user = await this.userService.findUserByPhoneNumber(
			phoneNumber,
			region,
		);

		if (user && user.verified) {
			const passwordsAreEqual = await bcrypt.compare(
				password,
				user.password,
			);
			if (passwordsAreEqual) {
				const { password, ...result } = user;
				return result;
			}
		}
		return null;
	}

	// TODO: тут хотелось бы вернуть не только пару токенов, а еще и имя юзера для приветствия

	async login(user: User) {
		return this.issueTokens(user);
	}
}
