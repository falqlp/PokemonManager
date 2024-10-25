import WebSocket from "ws";
import { singleton } from "tsyringe";

export interface WebsocketMessage {
  type: string;
  payload?: any;
}
export enum NotificationType {
  Neutral = "Neutral",
  Success = "Success",
  Error = "Error",
}

export interface CustomWebsocket extends WebSocket {
  id: string;
  gameId?: string;
  startTime?: number;
  trainerId?: string;
  userId?: string;
  askNextDay?: boolean;
  initBattle?: boolean;
  askNextRound?: boolean;
  askNextRoundLoop?: boolean;
  loopMode?: boolean;
}
@singleton()
export default class WebsocketDataService {
  private clients: CustomWebsocket[] = [];

  public getClients(
    filter?: (client: CustomWebsocket) => boolean,
  ): CustomWebsocket[] {
    if (filter) {
      return this.clients.filter(filter);
    }
    return this.clients;
  }

  public push(ws: CustomWebsocket): void {
    this.clients.push(ws);
  }

  public set(clients: CustomWebsocket[]): void {
    this.clients = clients;
  }

  public update(ws: CustomWebsocket): void {
    const index = this.clients.findIndex((cli) => cli.id === ws.id);
    if (index !== -1) {
      this.clients[index] = ws;
    }
  }
}
