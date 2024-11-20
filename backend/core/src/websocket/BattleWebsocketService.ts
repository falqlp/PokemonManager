import { Controller } from '@nestjs/common';
import WebsocketDataService, { WebsocketMessage } from './WebsocketDataService';
import WebsocketUtils from './WebsocketUtils';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ITrainer } from '../domain/trainer/Trainer';

@Controller()
export default class BattleWebsocketService {
  constructor(
    private readonly websocketUtils: WebsocketUtils,
    private websocketDataService: WebsocketDataService,
  ) {}

  @MessagePattern('playRound')
  public playRound(
    @Payload() battleState: { player: ITrainer; opponent: ITrainer },
  ): void {
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

  @MessagePattern('addInitBattleStatus')
  public addInitBattleStatus(@Payload() trainerId: string): void {
    this.websocketDataService
      .getClients((client) => client.data.trainerId === trainerId.toString())
      .map((client) => {
        client.data.initBattle = true;
        return client;
      });
  }

  @MessagePattern('deleteInitBattleStatus')
  public deleteInitBattleStatus(@Payload() trainerIds: string[]): void {
    this.websocketDataService
      .getClients((client) => trainerIds.includes(client.data.trainerId))
      .map((client) => {
        client.data.initBattle = false;
        return client;
      });
  }

  @MessagePattern('getInitBattleReady')
  public getInitBattleReady(@Payload() trainerIds: string[]): boolean {
    return this.websocketDataService
      .getClients((client) => trainerIds.includes(client.data.trainerId))
      .every((client) => client.data.initBattle);
  }

  @MessagePattern('addAskNextRound')
  public addAskNextRound(
    @Payload('trainerIds') trainerIds: string[],
    @Payload('status') status: boolean,
  ): void {
    this.websocketDataService
      .getClients((client) => trainerIds.includes(client.data.trainerId))
      .map((client) => {
        client.data.askNextRound = status;
        return client;
      });
  }

  @MessagePattern('addAskNextRoundLoop')
  public addAskNextRoundLoop(
    @Payload('trainerIds') trainerIds: string[],
    @Payload('status') status: boolean,
  ): void {
    this.websocketDataService
      .getClients((client) => trainerIds.includes(client.data.trainerId))
      .map((client) => {
        client.data.askNextRoundLoop = status;
        return client;
      });
  }

  @MessagePattern('resetNextRoundStatus')
  public resetNextRoundStatus(@Payload() trainerIds: string[]): void {
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

  @MessagePattern('setLoopMode')
  public setLoopMode(@Payload() trainerIds: string[]): void {
    this.websocketDataService
      .getClients((client) => trainerIds.includes(client.data.trainerId))
      .map((client) => {
        client.data.loopMode = true;
        return client;
      });
  }

  @MessagePattern('getNextRoundStatus')
  public getNextRoundStatus(@Payload() trainerIds: string[]): boolean {
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

  @MessagePattern('getNextRoundLoopStatus')
  public getNextRoundLoopStatus(@Payload() trainerIds: string[]): boolean {
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

  @MessagePattern('updateNextRoundStatus')
  public updateNextRoundStatus(@Payload() trainerIds: string[]): void {
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
