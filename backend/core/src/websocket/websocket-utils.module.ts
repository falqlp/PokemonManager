import { Module } from '@nestjs/common';
import WebsocketUtils from './WebsocketUtils';
import WebsocketDataService from './WebsocketDataService';

@Module({
  providers: [WebsocketUtils, WebsocketDataService],
  exports: [WebsocketUtils, WebsocketDataService],
})
export class WebsocketUtilsModule {}
