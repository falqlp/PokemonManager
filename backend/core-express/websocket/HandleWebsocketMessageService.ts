import { singleton } from "tsyringe";
import GameRepository from "../domain/game/GameRepository";
import { IGame } from "../domain/game/Game";
import WebsocketDataService, {
  CustomWebsocket,
  WebsocketMessage,
} from "./WebsocketDataService";

@singleton()
export class HandleWebsocketMessageService {
  constructor(
    private gameRepository: GameRepository,
    private websocketDataService: WebsocketDataService,
  ) {}

  async handleMessage(
    ws: CustomWebsocket,
    message: WebsocketMessage,
  ): Promise<void | WebsocketMessage> {
    try {
      return this.messageHandleMap[message.type](ws, message.payload);
    } catch (error) {
      console.error(error);
    }
  }

  private registerGame = (ws: CustomWebsocket, payload: any): void => {
    const gameId = payload.gameId;
    const trainerId = payload.trainerId;
    ws.gameId = gameId;
    ws.startTime = Date.now();
    ws.trainerId = trainerId;
    this.websocketDataService.update(ws);
  };

  private registerUser = (ws: CustomWebsocket, payload: any): void => {
    ws.userId = payload.userId;
    this.websocketDataService.update(ws);
  };

  private registerTrainer = (ws: CustomWebsocket, payload: any): void => {
    ws.trainerId = payload.trainerId;
    this.websocketDataService.update(ws);
  };

  public deleteRegistrationGame = async (
    ws: CustomWebsocket,
  ): Promise<WebsocketMessage> => {
    let game: IGame;
    if (ws.gameId && ws.trainerId) {
      game = await this.gameRepository.updatePlayingTime(
        ws.gameId,
        ws.trainerId,
        Date.now() - ws.startTime,
      );
    }
    if (ws.gameId) {
      ws.askNextDay = undefined;
    }
    this.websocketDataService.update(ws);

    return { type: "deleteRegistration", payload: game };
  };

  private deleteRegistrationUser = async (
    ws: CustomWebsocket,
  ): Promise<void> => {
    if (ws.userId) {
      ws.userId = undefined;
      this.websocketDataService.update(ws);
    }
  };

  private deleteRegistrationTrainer = async (
    ws: CustomWebsocket,
  ): Promise<WebsocketMessage> => {
    let game: IGame;
    if (ws.gameId && ws.trainerId) {
      game = await this.gameRepository.updatePlayingTime(
        ws.gameId,
        ws.trainerId,
        Date.now() - ws.startTime,
      );
    }
    if (ws.trainerId) {
      ws.trainerId = undefined;
    }
    this.websocketDataService.update(ws);

    return { type: "deleteRegistration", payload: game };
  };

  private messageHandleMap: Record<
    string,
    (
      ws: CustomWebsocket,
      payload?: any,
    ) => void | Promise<void> | Promise<WebsocketMessage>
  > = {
    registerGame: this.registerGame,
    deleteRegistrationGame: this.deleteRegistrationGame,
    registerUser: this.registerUser,
    deleteRegistrationUser: this.deleteRegistrationUser,
    registerTrainer: this.registerTrainer,
    deleteRegistrationTrainer: this.deleteRegistrationTrainer,
  };
}
