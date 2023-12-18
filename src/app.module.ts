import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { ConfigModule } from '@nestjs/config';

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
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost', // Замените на ваш хост
			port: 5432, // Замените на ваш порт, если отличается
			username: 'postgres', // Замените на ваше имя пользователя
			password: 'postgres', // Замените на ваш пароль
			database: 'eventapp', // Замените на имя вашей базы данных
			entities: [User], // Добавьте все ваши сущности
			synchronize: true, // Установите false для продакшн!
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
