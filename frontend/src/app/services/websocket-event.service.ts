import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { PokemonBaseModel } from '../models/PokemonModels/pokemonBase.model';
import { TrainerModel } from '../models/TrainersModels/trainer.model';
import { WebSocketModel } from './websocket.service';
import { BattleStateModel } from '../views/play/new-battle/battle.model';
import { RouterService } from './router.service';

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
  oldPlayer?: TrainerModel;
  trainer: TrainerModel;
  xpAndLevelGain?: { xp: number; level: number }[];
  evolutions?: {
    pokemonId: string;
    evolution: PokemonBaseModel;
    name: string;
  }[];
}

export interface SimulateStatusModel {
  wantNextDay: number;
  nbTrainers: number;
}
export interface BattleStatus {
  nextRound: boolean;
  nextRoundLoop: boolean;
  loopMode: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketEventService {
  private router = inject(RouterService);

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

  private battleEventSubject = new BehaviorSubject<BattleStateModel>(null);
  public battleEvent$: Observable<BattleStateModel> = this.battleEventSubject
    .asObservable()
    .pipe(filter((value) => !!value));

  private updateUserEventSubject = new BehaviorSubject<void>(null);
  public updateUserEvent$: Observable<void> =
    this.updateUserEventSubject.asObservable();

  private simulateStatusEventSubject = new BehaviorSubject<SimulateStatusModel>(
    { wantNextDay: 0, nbTrainers: 0 }
  );

  public simulateStatusEvent$: Observable<SimulateStatusModel> =
    this.simulateStatusEventSubject.asObservable();

  private simulatingEventSubject = new BehaviorSubject<boolean>(null);

  public simulatingEvent$: Observable<boolean> =
    this.simulatingEventSubject.asObservable();

  private updateGameEventSubject = new BehaviorSubject<void>(null);

  public updateGameEvent$: Observable<void> =
    this.updateGameEventSubject.asObservable();

  private updateBattleStatusEventSubject = new BehaviorSubject<BattleStatus>({
    nextRound: false,
    nextRoundLoop: false,
    loopMode: false,
  });

  public updateBattleStatusEvent$: Observable<BattleStatus> =
    this.updateBattleStatusEventSubject.asObservable();

  public handleMessage(message: WebSocketModel): void {
    this.eventMap[message.type](message.payload);
  }

  private notifyEvent = (notification: NotificationModel): void => {
    this.notifyEventSubject.next(notification);
  };

  private updatePlayerEvent = (): void => {
    this.updatePlayerEventSubject.next();
  };

  private notifyNewMoveLearnedEvent = (
    payload: NotificationNewMoveLearnedModel
  ): void => {
    this.notifyNewMoveLearnedEventSubject.next(payload);
  };

  private eggHatchedEvent = (payload: EggHatchedModel): void => {
    this.eggHatchedEventSubject.next(payload);
  };

  private initGameEvent = (payload: InitGameModel): void => {
    this.initGameEventSubject.next(payload);
  };

  private initGameEndEvent = (): void => {
    this.initGameEndEventSubject.next();
  };

  private weeklyXpEvent = (payload: WeeklyXpModel): void => {
    this.weeklyXpEventSubject.next(payload);
  };

  private battleEvent = (payload: BattleStateModel): void => {
    this.battleEventSubject.next(payload);
  };

  private updateUserEvent = (): void => {
    this.updateUserEventSubject.next();
  };

  private simulateStatusEvent = (payload: SimulateStatusModel): void => {
    this.simulateStatusEventSubject.next(payload);
  };

  private simulatingEvent = (payload: boolean): void => {
    this.simulatingEventSubject.next(payload);
  };

  private updateGameEvent = (): void => {
    this.updateGameEventSubject.next();
  };

  private updateBattleStatusEvent = (payload: BattleStatus): void => {
    this.updateBattleStatusEventSubject.next(payload);
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
    playRound: this.battleEvent,
    updateUser: this.updateUserEvent,
    simulateStatus: this.simulateStatusEvent,
    reload: () => this.router.navigateByUrl('login'),
    simulating: this.simulatingEvent,
    updateGame: this.updateGameEvent,
    updateBattleStatus: this.updateBattleStatusEvent,
  };
}
