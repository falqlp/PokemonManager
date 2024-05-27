import { IBattleState } from "../application/battle/BattleInterfaces";
import { singleton } from "tsyringe";
import WebsocketDataService, { WebsocketMessage } from "./WebsocketDataService";
import WebsocketUtils from "./WebsocketUtils";

@singleton()
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
      type: "playRound",
      payload: battleState,
    };
    this.websocketUtils.sendMessageToTrainers(trainers, message);
  }

  public addInitBattleStatus(trainerId: string): void {
    this.websocketDataService
      .getClients((client) => client.trainerId === trainerId.toString())
      .map((client) => {
        client.initBattle = true;
        return client;
      });
  }

  public deleteInitBattleStatus(trainerIds: string[]): void {
    this.websocketDataService
      .getClients((client) => trainerIds.includes(client.trainerId))
      .map((client) => {
        client.initBattle = false;
        return client;
      });
  }

  public getInitBattleReady(trainerIds: string[]): boolean {
    return this.websocketDataService
      .getClients((client) => trainerIds.includes(client.trainerId))
      .every((client) => client.initBattle);
  }

  public addAskNextRound(trainerIds: string[], status: boolean): void {
    this.websocketDataService
      .getClients((client) => trainerIds.includes(client.trainerId))
      .map((client) => {
        client.askNextRound = status;
        return client;
      });
  }

  public addAskNextRoundLoop(trainerIds: string[], status: boolean): void {
    this.websocketDataService
      .getClients((client) => trainerIds.includes(client.trainerId))
      .map((client) => {
        client.askNextRoundLoop = status;
        return client;
      });
  }

  public resetNextRoundStatus(trainerIds: string[]): void {
    this.websocketDataService.set(
      this.websocketDataService
        .getClients((client) => trainerIds.includes(client.trainerId))
        .map((client) => {
          client.askNextRound = false;
          client.askNextRoundLoop = false;
          client.loopMode = false;
          return client;
        }),
    );
  }

  public setLoopMode(trainerIds: string[]): void {
    this.websocketDataService
      .getClients((client) => trainerIds.includes(client.trainerId))
      .map((client) => {
        client.loopMode = true;
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
              client.trainerId === id &&
              (client.askNextRound || client.askNextRoundLoop),
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
          .find((client) => client.trainerId === id && client.askNextRoundLoop)
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
      .getClients((client) => trainerIds.includes(client.trainerId))
      .forEach((client) => {
        if (client.askNextRoundLoop) {
          nextRoundLoop = true;
        }
        if (client.askNextRound) {
          nextRound = true;
        }
        if (client.loopMode) {
          loopMode = true;
        }
      });
    const message: WebsocketMessage = {
      type: "updateBattleStatus",
      payload: { nextRound, nextRoundLoop, loopMode },
    };
    this.websocketUtils.sendMessageToTrainers(trainerIds, message);
  }
}
