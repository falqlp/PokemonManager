import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { PlayerService } from './player.service';

export interface WebSocketModel {
  type: string;
  payload: any;
}

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  public webSocket: WebSocketSubject<WebSocketModel> = webSocket({
    url: 'ws://localhost:3000',
  });

  public webSocketObservable = this.webSocket.asObservable();

  public constructor(protected playerService: PlayerService) {
    this.registerToParty('64fd9cf21308150436317aed');
    this.webSocketObservable.subscribe((websocket) => {
      switch (websocket.type) {
        case 'updatePlayer':
          this.playerService.updatePlayer();
          break;
      }
    });
  }

  public registerToParty(partyId: string): void {
    this.webSocket.next({
      type: 'register',
      payload: { partyId: partyId },
    });
  }

  public sendMessage(msg: WebSocketModel): void {
    this.webSocket.next(msg);
  }
}
