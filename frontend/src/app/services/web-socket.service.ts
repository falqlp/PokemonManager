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
    this.webSocketObservable.subscribe((websocket) => {
      switch (websocket.type) {
        case 'updatePlayer':
          this.playerService.updatePlayer();
          break;
      }
    });
  }

  public sendMessage(msg: WebSocketModel): void {
    this.webSocket.next(msg);
  }
}
