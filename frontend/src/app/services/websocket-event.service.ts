import { Injectable } from '@angular/core';
import { filter, map, merge, Observable, of } from 'rxjs';
import { PokemonBaseModel } from '../models/PokemonModels/pokemonBase.model';
import { TrainerModel } from '../models/TrainersModels/trainer.model';
import { BattleStateModel } from '../views/new-battle/battle.model';
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
  public notifyEvent$: Observable<NotificationModel> = of();
  public updatePlayerEvent$: Observable<void> = of();
  public notifyNewMoveLearnedEvent$: Observable<NotificationNewMoveLearnedModel> =
    of();

  public eggHatchedEvent$: Observable<EggHatchedModel> = of();
  public initGameEvent$: Observable<InitGameModel> = of();
  public initGameEndEvent$: Observable<void> = of();
  public weeklyXpEvent$: Observable<WeeklyXpModel> = of();
  public battleEvent$: Observable<BattleStateModel> = of();
  public updateUserEvent$: Observable<void> = of(null);
  public simulateStatusEvent$: Observable<SimulateStatusModel> = of({
    wantNextDay: 0,
    nbTrainers: 0,
  });

  public simulatingEvent$: Observable<boolean> = of(null);
  public updateGameEvent$: Observable<void> = of();
  public updateBattleStatusEvent$: Observable<BattleStatus> = of({
    nextRound: false,
    nextRoundLoop: false,
    loopMode: false,
  });

  private eventMap: Record<string, Observable<any>> = {
    updatePlayer: this.updateUserEvent$,
    // connexion: console.log,
    notifyNewMoveLearned: this.notifyNewMoveLearnedEvent$,
    notify: this.notifyEvent$,
    eggHatched: this.eggHatchedEvent$,
    initGame: this.initGameEvent$,
    initGameEnd: this.initGameEndEvent$,
    weeklyXp: this.weeklyXpEvent$,
    playRound: this.battleEvent$,
    updateUser: this.updateUserEvent$,
    simulateStatus: this.simulateStatusEvent$,
    // reload: () => this.router.navigateByUrl('login'),
    simulating: this.simulatingEvent$,
    updateGame: this.updateGameEvent$,
    updateBattleStatus: this.updateBattleStatusEvent$,
  };

  public handleWebsocket(websocketEvent: Observable<WebSocketModel>): void {
    Object.keys(this.eventMap).forEach((key: string) => {
      this.eventMap[key] = merge(
        websocketEvent.pipe(
          filter((message) => message.type === key),
          map((message) => message.payload)
        ),
        this.eventMap[key]
      );
    });
  }
}
