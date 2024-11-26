import { Test, TestingModule } from '@nestjs/testing';
import {
  BattleWebsocketGateway,
  BattleWebsocketMessage,
} from './battle-websocket.gateway';
import { Server, Socket } from 'socket.io';

describe('BattleWebsocketGateway', () => {
  let gateway: BattleWebsocketGateway;
  let serverMock: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BattleWebsocketGateway],
    }).compile();

    gateway = module.get<BattleWebsocketGateway>(BattleWebsocketGateway);
    serverMock = {
      to: jest.fn().mockReturnValue({ emit: jest.fn() }),
    } as any;
    gateway.server = serverMock;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should join the client to the correct rooms on init', () => {
    const clientMock: Socket = { join: jest.fn(), send: jest.fn() } as any;
    const payload = { battleId: 'battle123', trainerId: 'trainer456' };

    gateway.initClient(clientMock, payload);

    expect(clientMock.join).toHaveBeenCalledWith('battle123');
    expect(clientMock.join).toHaveBeenCalledWith('trainer456');
    expect(clientMock.send).toHaveBeenCalledWith({ type: 'init' });
  });

  it('should send a message to the specified trainers', () => {
    const message: BattleWebsocketMessage = { type: 'test', payload: 'data' };
    const trainerIds = ['trainer1', 'trainer2'];

    gateway.sendMessageToTrainers(trainerIds, message);

    expect(serverMock.to).toHaveBeenCalledWith(trainerIds);
    expect(serverMock.to(trainerIds).emit).toHaveBeenCalledWith(
      'message',
      message,
    );
  });

  it('should fetch clients in the specified rooms', async () => {
    const rooms = ['room1', 'room2'];
    const socketsMock = [
      { join: jest.fn() } as any,
      { join: jest.fn() } as any,
    ];

    serverMock.in = jest.fn().mockReturnValue({
      fetchSockets: jest.fn().mockResolvedValue(socketsMock),
    });

    const result = await gateway.getClientIn(rooms);

    expect(serverMock.in).toHaveBeenCalledWith(rooms);
    expect(result).toEqual(socketsMock);
  });
});
