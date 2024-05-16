import { singleton } from "tsyringe";
import { mongoId } from "../utils/MongoUtils";
import { CustomWebsocket, WebsocketMessage } from "./WebsocketServerService";
import GameRepository from "../domain/game/GameRepository";
import BattleService from "../application/battle/BattleService";

@singleton()
export class HandleWebsocketMessageService {
  constructor(
    private gameRepository: GameRepository,
    private battleService: BattleService,
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
    ws.id = mongoId().toString();
    ws.gameId = gameId;
    ws.startTime = Date.now();
    ws.trainerId = trainerId;
  };

  private registerUser = (ws: CustomWebsocket, payload: any): void => {
    ws.userId = payload.userId;
  };

  private registerTrainer = (ws: CustomWebsocket, payload: any): void => {
    ws.trainerId = payload.trainerId;
  };

  deleteRegistrationGame = async (ws: CustomWebsocket): Promise<void> => {
    if (ws.gameId) {
      await this.gameRepository.updatePlayingTime(
        ws.gameId,
        Date.now() - ws.startTime,
      );
      ws.gameId = undefined;
    }
  };

  private deleteRegistrationUser = async (
    ws: CustomWebsocket,
  ): Promise<void> => {
    if (ws.userId) {
      ws.userId = undefined;
    }
  };

  private deleteRegistrationTrainer = async (
    ws: CustomWebsocket,
  ): Promise<void> => {
    if (ws.trainerId) {
      ws.trainerId = undefined;
    }
  };

  private playRound = async (
    ws: CustomWebsocket,
    payload: any,
  ): Promise<WebsocketMessage> => {
    const res = await this.battleService.playNextRound(
      payload.battleId,
      payload.init,
    );
    return { type: "playRound", payload: res };
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
    playRound: this.playRound,
  };
}
