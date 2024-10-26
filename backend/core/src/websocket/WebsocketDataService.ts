import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

export interface WebsocketMessage {
  type: string;
  payload?: any;
}
export enum NotificationType {
  Neutral = 'Neutral',
  Success = 'Success',
  Error = 'Error',
}
@Injectable()
export default class WebsocketDataService {
  private clients: Socket[] = [];

  public getClients(filter?: (client: Socket) => boolean): Socket[] {
    if (filter) {
      return this.clients.filter(filter);
    }
    return this.clients;
  }

  public push(ws: Socket): void {
    this.clients.push(ws);
  }

  public set(clients: Socket[]): void {
    this.clients = clients;
  }

  public update(ws: Socket): void {
    const index = this.clients.findIndex((cli) => cli.id === ws.id);
    if (index !== -1) {
      this.clients[index] = ws;
    }
  }
}
