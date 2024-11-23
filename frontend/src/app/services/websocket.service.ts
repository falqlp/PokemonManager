import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
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
  private notifierService = inject(NotifierService);
  private cacheService = inject(CacheService);
  private routerService = inject(RouterService);
  private websocketEventService = inject(WebsocketEventService);

  private socket: Socket;
  protected isConected = false;
  protected readonly url = environment.wsUrl;

  public connect(): void {
    // Initialise la connexion Socket.IO avec les options CORS
    this.socket = io(this.url + '/core', {
      forceNew: true,
      transports: ['websocket'], // Utilise uniquement le transport WebSocket
      withCredentials: true, // Ajoutez des informations d'authentification si nécessaire
    });

    // Gestion de l'ouverture de la connexion
    this.socket.on('connect', () => {
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
      this.subscribeToCacheEvents();
    });

    // Gestion de la fermeture de la connexion
    this.socket.on('disconnect', () => {
      this.isConected = false;
      console.log('Connection closed');
      this.notifierService.notify({
        key: 'Connection closed',
        type: NotificationType.Error,
      });
      this.routerService.navigateByUrl('404Error');
    });
    this.socket // Gestion des messages reçus du serveur
      .on('message', (data: string) => {
        this.websocketEventService.handleMessage(JSON.parse(data));
      });
  }

  private subscribeToCacheEvents(): void {
    // Abonnez-vous aux événements de CacheService et envoyez les données via Socket.IO
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
  }

  public registerToGame(gameId: string): void {
    this.send('registerGame', { gameId });
  }

  public registerUser(userId: string): void {
    this.send('registerUser', { userId });
  }

  public registerTrainer(trainerId: string): void {
    this.send('registerTrainer', { trainerId });
  }

  public deleteRegistrationToGame(): void {
    this.send('deleteRegistrationGame');
  }

  public deleteRegistrationUser(): void {
    this.send('deleteRegistrationUser');
  }

  public deleteRegistrationTrainer(): void {
    this.send('deleteRegistrationTrainer');
  }

  protected send(type: string, payload?: any): void {
    this.socket.send(JSON.stringify({ type, payload }));
  }
}
