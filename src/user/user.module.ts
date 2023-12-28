import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthService } from 'src/auth/auth.service';
import { RefreshTokenService } from 'src/auth/refreshToken.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
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
		UserService,
		UserResolver,
		JwtStrategy,
		AuthService,
		RefreshTokenService,
	],
	exports: [UserService, AuthService],
})
export class UserModule {}
