import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 3000;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	//http://localhost:3000/api/
	await app.listen(PORT);
	console.log(`http://localhost:${PORT}/api/`);
}
bootstrap();
