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
  payload?: any;
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private websocket: WebSocketSubject<WebSocketModel>;
  protected isConected = false;
  protected readonly url = environment.wsUrl;

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
          const lastUrl = this.routerService.getLastUrl();
          if (lastUrl && lastUrl !== '/') {
            this.routerService.navigateByUrl(lastUrl);
          }
          this.cacheService.$gameId.subscribe((id) => {
            if (id) {
              this.registerToGame(id);
            } else {
              this.deleteRegistrationToGame();
            }
          });
          this.cacheService.$userId.subscribe((userId) => {
            if (userId) {
              this.registerUser(userId);
            } else {
              this.deleteRegistrationUser();
            }
          });
          this.cacheService.$trainerId.subscribe((trainerId) => {
            if (trainerId) {
              this.registerTrainer(trainerId);
            } else {
              this.deleteRegistrationTrainer();
            }
          });
        },
      },
    };
  }

  public connect(): void {
    this.websocket = webSocket(this.getWebSocketConfig());
    this.websocketEventService.handleWebsocket(
      this.websocket.pipe(
        retry({ delay: 1000 }),
        catchError((err) => {
          console.error('Caught error:', err);
          return EMPTY;
        })
      )
    );
    // this.websocket
    //   .pipe(
    //     retry({ delay: 1000 }),
    //     catchError((err) => {
    //       console.error('Caught error:', err);
    //       return EMPTY;
    //     })
    //   )
    //   .subscribe((message) =>
    //     this.websocketEventService.handleMessage(message)
    //   );
  }

  public registerToGame(gameId: string): void {
    this.websocket.next({
      type: 'registerGame',
      payload: { gameId },
    });
  }

  public registerUser(userId: string): void {
    this.websocket.next({
      type: 'registerUser',
      payload: { userId },
    });
  }

  public registerTrainer(trainerId: string): void {
    this.websocket.next({
      type: 'registerTrainer',
      payload: { trainerId },
    });
  }

  public deleteRegistrationToGame(): void {
    this.websocket.next({
      type: 'deleteRegistrationGame',
    });
  }

  public deleteRegistrationUser(): void {
    this.websocket.next({
      type: 'deleteRegistrationUser',
    });
  }

  public deleteRegistrationTrainer(): void {
    this.websocket.next({
      type: 'deleteRegistrationTrainer',
    });
  }

  public playRound(battleId: string, init: boolean): void {
    this.websocket.next({
      type: 'playRound',
      payload: { battleId, init },
    });
  }
}
