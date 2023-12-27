import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PhoneNumberStrategy } from './phoneNumber.strategy';
import { RefreshTokenService } from './refreshToken.service';

@Module({
	imports: [
		ConfigModule,
		PassportModule,
		UserModule,

		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				signOptions: {
					expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
				},
				secret: configService.get<string>('JWT_SECRET'),
			}),
			inject: [ConfigService],
		}),
	],
	providers: [
		AuthService,
		AuthResolver,
		LocalStrategy,
		JwtStrategy,
		PhoneNumberStrategy,
		RefreshTokenService,
	],
	exports: [RefreshTokenService],
})
export class AuthModule {}
