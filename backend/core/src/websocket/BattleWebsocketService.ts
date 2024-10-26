import { IBattleState } from '../application/battle/BattleInterfaces';
import { Injectable } from '@nestjs/common';
import WebsocketDataService, { WebsocketMessage } from './WebsocketDataService';
import WebsocketUtils from './WebsocketUtils';

@Injectable()
export default class BattleWebsocketService {
  constructor(
    private websocketUtils: WebsocketUtils,
    private websocketDataService: WebsocketDataService,
  ) {}

  public playRound(battleState: IBattleState): void {
    const trainers: string[] = [
      battleState.player._id.toString(),
      battleState.opponent._id.toString(),
    ];
    const message: WebsocketMessage = {
      type: 'playRound',
      payload: battleState,
    };
    this.websocketUtils.sendMessageToTrainers(trainers, message);
  }

  public addInitBattleStatus(trainerId: string): void {
    this.websocketDataService
      .getClients((client) => client.data.trainerId === trainerId.toString())
      .map((client) => {
        client.data.initBattle = true;
        return client;
      });
  }

  public deleteInitBattleStatus(trainerIds: string[]): void {
    this.websocketDataService
      .getClients((client) => trainerIds.includes(client.data.trainerId))
      .map((client) => {
        client.data.initBattle = false;
        return client;
      });
  }

  public getInitBattleReady(trainerIds: string[]): boolean {
    return this.websocketDataService
      .getClients((client) => trainerIds.includes(client.data.trainerId))
      .every((client) => client.data.initBattle);
  }

  public addAskNextRound(trainerIds: string[], status: boolean): void {
    this.websocketDataService
      .getClients((client) => trainerIds.includes(client.data.trainerId))
      .map((client) => {
        client.data.askNextRound = status;
        return client;
      });
  }

  public addAskNextRoundLoop(trainerIds: string[], status: boolean): void {
    this.websocketDataService
      .getClients((client) => trainerIds.includes(client.data.trainerId))
      .map((client) => {
        client.data.askNextRoundLoop = status;
        return client;
      });
  }

  public resetNextRoundStatus(trainerIds: string[]): void {
    this.websocketDataService
      .getClients((client) => trainerIds.includes(client.data.trainerId))
      .map((client) => {
        client.data.askNextRound = false;
        client.data.askNextRoundLoop = false;
        client.data.loopMode = false;
        this.websocketDataService.update(client);
        return client;
      });
  }

  public setLoopMode(trainerIds: string[]): void {
    this.websocketDataService
      .getClients((client) => trainerIds.includes(client.data.trainerId))
      .map((client) => {
        client.data.loopMode = true;
        return client;
      });
  }

  public getNextRoundStatus(trainerIds: string[]): boolean {
    for (const id of trainerIds) {
      if (
        !this.websocketDataService
          .getClients()
          .find(
            (client) =>
              client.data.trainerId === id &&
              (client.data.askNextRound || client.data.askNextRoundLoop),
          )
      ) {
        return false;
      }
    }
    return true;
  }

  public getNextRoundLoopStatus(trainerIds: string[]): boolean {
    for (const id of trainerIds) {
      if (
        !this.websocketDataService
          .getClients()
          .find(
            (client) =>
              client.data.trainerId === id && client.data.askNextRoundLoop,
          )
      ) {
        return false;
      }
    }
    return true;
  }

  public updateNextRoundStatus(trainerIds: string[]): void {
    let nextRound: boolean = false;
    let nextRoundLoop: boolean = false;
    let loopMode: boolean = false;
    this.websocketDataService
      .getClients((client) => trainerIds.includes(client.data.trainerId))
      .forEach((client) => {
        if (client.data.askNextRoundLoop) {
          nextRoundLoop = true;
        }
        if (client.data.askNextRound) {
          nextRound = true;
        }
        if (client.data.loopMode) {
          loopMode = true;
        }
      });
    const message: WebsocketMessage = {
      type: 'updateBattleStatus',
      payload: { nextRound, nextRoundLoop, loopMode },
    };
    this.websocketUtils.sendMessageToTrainers(trainerIds, message);
  }
}
