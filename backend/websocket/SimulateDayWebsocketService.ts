import WebsocketUtils from "./WebsocketUtils";
import { IGame } from "../domain/game/Game";
import WebsocketDataService from "./WebsocketDataService";
import { singleton } from "tsyringe";

@singleton()
export default class SimulateDayWebsocketService {
  constructor(
    private websocketUtils: WebsocketUtils,
    private websocketDataService: WebsocketDataService,
  ) {}

  public simulating(gameId: string, value: boolean): void {
    this.websocketUtils.sendMessageToClientInGame(gameId, {
      type: "simulating",
      payload: value,
    });
  }

  public changeTrainerSimulateDayStatus(
    trainerId: string,
    game: IGame,
    status: boolean,
  ): void {
    this.websocketDataService
      .getClients((client) => client.trainerId === trainerId.toString())
      .map((client) => {
        client.askNextDay = status;
        return client;
      });
    this.updateSimulateStatus(game);
  }

  public updateSimulateStatus(game: IGame): void {
    const wantNextDay = this.getNextDayStatus(game);
    const nbTrainers = game.players.length;
    this.websocketUtils.sendMessageToClientInGame(game._id.toString(), {
      type: "simulateStatus",
      payload: { wantNextDay, nbTrainers },
    });
  }

  public getNextDayStatus(game: IGame): number {
    const trainerIds = game.players
      .filter((player) => !!player.trainer)
      .map((player) => player.trainer._id.toString());
    return this.websocketDataService.getClients(
      (client) => trainerIds.includes(client.trainerId) && client.askNextDay,
    ).length;
  }
}
