import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 3060;

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: true,
	});
	app.setGlobalPrefix('api');

	await app.listen(PORT);
	console.log(
		`Server is up and running on http://localhost:${PORT}/graphql/`,
	);
}
bootstrap();
