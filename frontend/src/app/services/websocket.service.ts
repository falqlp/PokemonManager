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
import { MatDialog } from '@angular/material/dialog';
import { EggHatchedComponent } from '../modals/egg-hatched/egg-hatched.component';
import { RouterService } from './router.service';
import { environment } from '../../environments/environment';

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

  constructor(
    protected playerService: PlayerService,
    protected notifierService: NotifierService,
    protected translateService: TranslateService,
    protected cacheService: CacheService,
    protected dialog: MatDialog,
    protected routerService: RouterService
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
          this.notifierService.notify('error', 'Connection closed');
        },
      },
      openObserver: {
        next: (): void => {
          this.isConected = true;
          console.log('Connection opened');
          this.notifierService.notify('success', 'Connection opened');
          this.registerToGame(this.cacheService.getGameId());
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
        break;
      case 'notify':
        this.notifierService.notify(
          message.payload.type,
          this.translateService.instant(message.payload.key)
        );
        break;
      case 'eggHatched':
        setTimeout(() => {
          this.dialog.open(EggHatchedComponent, {
            data: message.payload,
            disableClose: true,
          });
        });
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

  public getConnected(): boolean {
    return this.isConected;
  }
}
