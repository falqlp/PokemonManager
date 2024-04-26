import { Injectable } from '@angular/core';
import {
  webSocket,
  WebSocketSubject,
  WebSocketSubjectConfig,
} from 'rxjs/webSocket';
import { catchError, retry } from 'rxjs/operators';
import { EMPTY, first } from 'rxjs';
import { PlayerService } from './player.service';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { CacheService } from './cache.service';
import { MatDialog } from '@angular/material/dialog';
import { EggHatchedComponent } from '../modals/egg-hatched/egg-hatched.component';
import { RouterService } from './router.service';
import { environment } from '../../environments/environment';
import { InitGameComponent } from '../modals/init-game/init-game.component';
import { AddGameComponent } from '../views/games/add-game/add-game.component';

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
          this.deleteRegistrationToGame(this.gameId);
          this.notifierService.notify('error', 'Connection closed');
        },
      },
      openObserver: {
        next: (): void => {
          this.isConected = true;
          console.log('Connection opened');
          this.notifierService.notify('success', 'Connection opened');
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
      .subscribe((message) => this.handleMessage(message));
    this.cacheService.$gameId.subscribe((id) => {
      if (id) {
        this.registerToGame(id);
        this.gameId = id;
      } else {
        this.deleteRegistrationToGame(this.gameId);
      }
    });
  }

  private handleMessage(message: WebSocketModel): void {
    switch (message.type) {
      case 'updatePlayer':
        this.playerService.getPlayer().pipe(first()).subscribe();
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
      case 'initGame':
        setTimeout(() => {
          this.dialog.openDialogs
            .find(
              (value) => value.componentInstance instanceof AddGameComponent
            )
            ?.close();
          let dialog = this.dialog.openDialogs.find(
            (value) => value.componentInstance instanceof InitGameComponent
          );
          if (!dialog) {
            dialog = this.dialog.open(InitGameComponent, {
              disableClose: true,
            });
          }
          dialog.componentInstance.key = this.translateService.instant(
            message.payload.key,
            { value: message.payload.value }
          );
        });
        break;
      case 'initGameEnd':
        this.dialog.openDialogs
          .find((value) => value.componentInstance instanceof InitGameComponent)
          ?.close();
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
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
