import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ApiModule } from './api/api.module';
import WebsocketUtils from './websocket/WebsocketUtils';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception/http-exception.filter';
import { DateConverterMiddleware } from './middleware/date-converter/date-converter.middleware';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WebsocketModule } from './websocket/websocket.module';
import { join } from 'path';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    WebsocketModule,
    ApiModule,
    ConfigModule.forRoot({
      envFilePath: [join(__dirname, '..', '.env'), '../.env'],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri:
          process.env.MONGODB_LOCAL !== '0'
            ? 'mongodb://127.0.0.1:27017/PokemonManager'
            : `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.1eldau8.mongodb.net/PokemonManager`,
      }),
    }),
  ],
  providers: [
    WebsocketUtils,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(DateConverterMiddleware).forRoutes('*');
  }
}
