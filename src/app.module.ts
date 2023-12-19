import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true, // делает ConfigModule глобальным
		}),
		UserModule,
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: 'schema.gql',
			typePaths: ['types.graphql'],
			playground: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('DB_HOST'),
				port: configService.get('DB_PORT'),
				username: configService.get('DB_USERNAME'),
				password: configService.get('DB_PASSWORD'),
				database: configService.get('DB_NAME'),
				entities: [User], // Добавьте все ваши сущности
				synchronize: configService.get('TYPEORM_SYNC'),
			}),
			inject: [ConfigService],
		}),
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
