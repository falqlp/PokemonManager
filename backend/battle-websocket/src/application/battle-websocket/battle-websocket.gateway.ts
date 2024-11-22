import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export interface BattleWebsocketMessage {
  type: string;
  payload?: unknown;
}

@WebSocketGateway({
  namespace: '/battle-websocket',
  cors: {
    origin: process.env.FRONT_URL,
  },
})
export class BattleWebsocketGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('init')
  public initClient(
    client: Socket,
    payload: { battleId: string; trainerId: string },
  ): void {
    client.join(payload.battleId);
    client.join(payload.trainerId);
  }

  public sendMessageToTrainers(
    trainerIds: string[],
    message: BattleWebsocketMessage,
  ): void {
    this.server.to(trainerIds).emit('message', message);
  }

  public async getClientIn(rooms: string[] | string): Promise<Socket[]> {
    return (await this.server.in(rooms).fetchSockets()) as unknown as Socket[];
  }
}
