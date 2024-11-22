import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as fs from 'fs';

async function bootstrap(): Promise<void> {
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

  app.useWebSocketAdapter(new IoAdapter(app));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'battle-websocket',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'battle-websocket',
      },
      producer: {
        allowAutoTopicCreation: true,
      },
    },
  });

  await app.startAllMicroservices();
  const port = process.env.BATTLE_WEBSOCKET_PORT || 3031;

  await app.listen(port);
  console.log(`Battle WebSocket is running on: ws://localhost:${port}`);
}
bootstrap();
