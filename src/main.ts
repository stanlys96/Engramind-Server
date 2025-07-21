import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://oi22n-uaaaa-aaaaf-qawqq-cai.icp0.io/',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
