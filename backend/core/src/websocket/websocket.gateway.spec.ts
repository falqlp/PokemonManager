import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketGateway } from './websocket.gateway';
import { HandleWebsocketMessageService } from './HandleWebsocketMessageService';
import SimulateDayWebsocketService from './SimulateDayWebsocketService';
import WebsocketDataService from './WebsocketDataService';
import WebsocketUtils from './WebsocketUtils';

jest.mock('./SimulateDayWebsocketService');
jest.mock('./WebsocketDataService');
jest.mock('./WebsocketUtils');
jest.mock('./HandleWebsocketMessageService');

describe('WebsocketGateway', () => {
  let gateway: WebsocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebsocketGateway,
        WebsocketDataService,
        WebsocketUtils,
        SimulateDayWebsocketService,
        HandleWebsocketMessageService,
      ],
    }).compile();

    gateway = module.get<WebsocketGateway>(WebsocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
