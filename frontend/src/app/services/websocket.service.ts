import { Injectable } from '@angular/core';
import {
  webSocket,
  WebSocketSubject,
  WebSocketSubjectConfig,
} from 'rxjs/webSocket';
import { catchError, retry } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { PlayerService } from './player.service';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { CacheService } from './cache.service';

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

  constructor(
    protected playerService: PlayerService,
    protected notifierService: NotifierService,
    protected translateService: TranslateService,
    protected cacheService: CacheService
  ) {
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
          this.registerToGame(this.cacheService.getGameId());
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
      case 'notifyNewMoveLearned':
        this.notifierService.notify(
          'success',
          this.translateService.instant(message.payload.key, {
            pokemon: this.translateService.instant(message.payload.pokemonName),
          })
        );
        console.log(message.payload);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  public registerToGame(gameId: string): void {
    this.websocket.next({
      type: 'register',
      payload: { gameId },
    });
  }

  public sendMessage(msg: WebSocketModel): void {
    this.websocket.next(msg);
  }
}
