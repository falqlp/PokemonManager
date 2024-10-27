import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const sslOptions = {
    keyPath:
      '/etc/letsencrypt/live/pokemon-manager.francecentral.cloudapp.azure.com/privkey.pem',
    certPath:
      '/etc/letsencrypt/live/pokemon-manager.francecentral.cloudapp.azure.com/fullchain.pem',
  };

  const httpsOptions =
    fs.existsSync(sslOptions.keyPath) && fs.existsSync(sslOptions.certPath)
      ? {
          key: fs.readFileSync(sslOptions.keyPath),
          cert: fs.readFileSync(sslOptions.certPath),
        }
      : undefined;

  const app = httpsOptions
    ? await NestFactory.create(AppModule, { httpsOptions })
    : await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONT_URL,
    allowedHeaders:
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, Game-Id, lang',
    methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  });

  const port = process.env.CORE_PORT || 3000;
  app.setGlobalPrefix('api');

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
