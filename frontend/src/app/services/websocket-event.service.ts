import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { PokemonBaseModel } from '../models/PokemonModels/pokemonBase.model';
import { TrainerModel } from '../models/TrainersModels/trainer.model';
import { WebSocketModel } from './websocket.service';

export interface NotificationModel {
  key: string;
  type?: string;
}

export interface NotificationNewMoveLearnedModel {
  key: string;
  id: string;
  pokemonName: string;
}

export interface EggHatchedModel {
  pokemonBase: PokemonBaseModel;
  shiny: boolean;
  _id: string;
}

export interface InitGameModel {
  key: string;
  value: string;
}

export interface WeeklyXpModel {
  trainer: TrainerModel;
  xpAndLevelGain?: { xp: number; level: number }[];
  evolutions?: {
    pokemonId: string;
    evolution: PokemonBaseModel;
    name: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketEventService {
  private notifyEventSubject = new BehaviorSubject<NotificationModel>(null);
  public notifyEvent$: Observable<NotificationModel> = this.notifyEventSubject
    .asObservable()
    .pipe(filter((value) => !!value));

  private updatePlayerEventSubject = new BehaviorSubject<void>(undefined);
  public updatePlayerEvent$: Observable<void> =
    this.updatePlayerEventSubject.asObservable();

  private notifyNewMoveLearnedEventSubject =
    new BehaviorSubject<NotificationNewMoveLearnedModel>(null);

  public notifyNewMoveLearnedEvent$: Observable<NotificationNewMoveLearnedModel> =
    this.notifyNewMoveLearnedEventSubject
      .asObservable()
      .pipe(filter((value) => !!value));

  private eggHatchedEventSubject = new BehaviorSubject<EggHatchedModel>(null);
  public eggHatchedEvent$: Observable<EggHatchedModel> =
    this.eggHatchedEventSubject.asObservable().pipe(filter((value) => !!value));

  private initGameEventSubject = new BehaviorSubject<InitGameModel>(null);
  public initGameEvent$: Observable<InitGameModel> =
    this.initGameEventSubject.asObservable();

  private initGameEndEventSubject = new BehaviorSubject<void>(undefined);
  public initGameEndEvent$: Observable<void> =
    this.initGameEndEventSubject.asObservable();

  private weeklyXpEventSubject = new BehaviorSubject<WeeklyXpModel>(null);
  public weeklyXpEvent$: Observable<WeeklyXpModel> = this.weeklyXpEventSubject
    .asObservable()
    .pipe(filter((value) => !!value));

  constructor() {
    this.initGameEvent$.subscribe(console.log);
  }

  public handleMessage = (message: WebSocketModel): void => {
    this.eventMap[message.type](message.payload);
  };

  public notifyEvent = (notification: NotificationModel): void => {
    this.notifyEventSubject.next(notification);
  };

  public updatePlayerEvent = (): void => {
    this.updatePlayerEventSubject.next();
  };

  public notifyNewMoveLearnedEvent = (
    payload: NotificationNewMoveLearnedModel
  ): void => {
    this.notifyNewMoveLearnedEventSubject.next(payload);
  };

  public eggHatchedEvent = (payload: EggHatchedModel): void => {
    this.eggHatchedEventSubject.next(payload);
  };

  public initGameEvent = (payload: InitGameModel): void => {
    this.initGameEventSubject.next(payload);
  };

  public initGameEndEvent = (): void => {
    this.initGameEndEventSubject.next();
  };

  public weeklyXpEvent = (payload: WeeklyXpModel): void => {
    this.weeklyXpEventSubject.next(payload);
  };

  private eventMap: Record<string, (payload?: any) => void> = {
    updatePlayer: this.updatePlayerEvent,
    connexion: console.log,
    notifyNewMoveLearned: this.notifyNewMoveLearnedEvent,
    notify: this.notifyEvent,
    eggHatched: this.eggHatchedEvent,
    initGame: this.initGameEvent,
    initGameEnd: this.initGameEndEvent,
    weeklyXp: this.weeklyXpEvent,
  };
}
