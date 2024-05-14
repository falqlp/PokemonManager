import { Injectable } from '@angular/core';
import {
  webSocket,
  WebSocketSubject,
  WebSocketSubjectConfig,
} from 'rxjs/webSocket';
import { catchError, retry } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { CacheService } from './cache.service';
import { RouterService } from './router.service';
import { environment } from '../../environments/environment';
import { NotificationType, NotifierService } from './notifier.service';
import { WebsocketEventService } from './websocket-event.service';

export interface WebSocketModel {
  type: string;
  payload: any;
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private websocket: WebSocketSubject<WebSocketModel>;
  protected isConected = false;
  protected readonly url = environment.wsUrl;
  private gameId: string;
  private registered = false;

  constructor(
    private notifierService: NotifierService,
    private cacheService: CacheService,
    private routerService: RouterService,
    private websocketEventService: WebsocketEventService
  ) {}

  private getWebSocketConfig(): WebSocketSubjectConfig<WebSocketModel> {
    return {
      url: this.url,
      closeObserver: {
        next: (): void => {
          if (this.isConected) {
            this.routerService.navigateByUrl('404Error');
          }
          this.isConected = false;
          console.log('Connection closed');
          this.deleteRegistrationToGame(this.gameId);
          this.notifierService.notify({
            key: 'Connection closed',
            type: NotificationType.Error,
          });
        },
      },
      openObserver: {
        next: (): void => {
          this.isConected = true;
          console.log('Connection opened');
          this.notifierService.notify({
            key: 'Connection opened',
            type: NotificationType.Success,
          });
          const gameId = this.cacheService.getGameId();
          if (gameId && gameId !== 'null') {
            this.registerToGame(gameId);
          }
          const lastUrl = this.routerService.getLastUrl();
          if (lastUrl && lastUrl !== '/') {
            this.routerService.navigateByUrl(lastUrl);
          }
        },
      },
    };
  }

  public connect(): void {
    this.websocket = webSocket(this.getWebSocketConfig());
    this.websocket
      .pipe(
        retry({ delay: 1000 }),
        catchError((err) => {
          console.error('Caught error:', err);
          return EMPTY;
        })
      )
      .subscribe((message) =>
        this.websocketEventService.handleMessage(message)
      );
    this.cacheService.$gameId.subscribe((id) => {
      if (id) {
        this.registerToGame(id);
        this.gameId = id;
      } else {
        this.deleteRegistrationToGame(this.gameId);
      }
    });
  }

  public registerToGame(gameId: string): void {
    if (!this.registered) {
      this.websocket.next({
        type: 'register',
        payload: { gameId },
      });
    }
    this.registered = true;
  }

  public deleteRegistrationToGame(gameId: string): void {
    this.websocket.next({
      type: 'deleteRegistration',
      payload: { gameId },
    });
    this.registered = false;
  }
}
