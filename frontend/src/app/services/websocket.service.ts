import { Injectable } from '@angular/core';
import {
  webSocket,
  WebSocketSubject,
  WebSocketSubjectConfig,
} from 'rxjs/webSocket';
import { catchError, retryWhen, delay, tap, retry } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { PlayerService } from './player.service';

export interface WebSocketModel {
  type: string;
  payload: any;
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private websocket: WebSocketSubject<WebSocketModel>;
  protected readonly url = 'ws://localhost:3000';

  constructor(private playerService: PlayerService) {
    this.connect();
  }

  private getWebSocketConfig(): WebSocketSubjectConfig<WebSocketModel> {
    return {
      url: this.url,
      closeObserver: {
        next: (): void => {
          console.log('Connection closed');
        },
      },
      openObserver: {
        next: (): void => {
          console.log('Connection opened');
          this.registerToParty('64fd9cf21308150436317aed');
        },
      },
    };
  }

  private connect(): void {
    this.websocket = webSocket(this.getWebSocketConfig());
    this.websocket
      .pipe(
        retry({ delay: 1000 }),
        catchError((err) => {
          console.error('Caught error:', err);
          return EMPTY;
        })
      )
      .subscribe((message) => this.handleMessage(message));
  }

  private handleMessage(message: WebSocketModel): void {
    switch (message.type) {
      case 'updatePlayer':
        this.playerService.updatePlayer();
        break;
      case 'connexion':
        console.log(message.payload);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  public registerToParty(partyId: string): void {
    this.websocket.next({
      type: 'register',
      payload: { partyId },
    });
  }

  public sendMessage(msg: WebSocketModel): void {
    this.websocket.next(msg);
  }
}
