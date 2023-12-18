import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 3000;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');

	await app.listen(PORT);
	console.log(
		`Server is up and running on http://localhost:${PORT}/graphql/`,
	);
}
bootstrap();
