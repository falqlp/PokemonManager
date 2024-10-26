import GameRepository from '../domain/game/GameRepository';
import { IGame } from '../domain/game/Game';
import WebsocketDataService, { WebsocketMessage } from './WebsocketDataService';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HandleWebsocketMessageService {
  constructor(
    private gameRepository: GameRepository,
    private websocketDataService: WebsocketDataService,
  ) {}

  async handleMessage(
    ws: Socket,
    message: WebsocketMessage,
  ): Promise<void | WebsocketMessage> {
    try {
      return this.messageHandleMap[message.type](ws, message.payload);
    } catch (error) {
      console.error(error);
    }
  }

  private registerGame = (ws: Socket, payload: any): void => {
    const gameId = payload.gameId;
    const trainerId = payload.trainerId;
    ws.data.gameId = gameId;
    ws.data.startTime = Date.now();
    ws.data.trainerId = trainerId;
    this.websocketDataService.update(ws);
  };

  private registerUser = (ws: Socket, payload: any): void => {
    ws.data.userId = payload.userId;
    this.websocketDataService.update(ws);
  };

  private registerTrainer = (ws: Socket, payload: any): void => {
    ws.data.trainerId = payload.trainerId;
    this.websocketDataService.update(ws);
  };

  public deleteRegistrationGame = async (
    ws: Socket,
  ): Promise<WebsocketMessage> => {
    let game: IGame;
    if (ws.data.gameId && ws.data.trainerId) {
      game = await this.gameRepository.updatePlayingTime(
        ws.data.gameId,
        ws.data.trainerId,
        Date.now() - ws.data.startTime,
      );
    }
    if (ws.data.gameId) {
      ws.data.askNextDay = undefined;
    }
    this.websocketDataService.update(ws);

    return { type: 'deleteRegistration', payload: game };
  };

  private deleteRegistrationUser = async (ws: Socket): Promise<void> => {
    if (ws.data.userId) {
      ws.data.userId = undefined;
      this.websocketDataService.update(ws);
    }
  };

  private deleteRegistrationTrainer = async (
    ws: Socket,
  ): Promise<WebsocketMessage> => {
    let game: IGame;
    if (ws.data.gameId && ws.data.trainerId) {
      game = await this.gameRepository.updatePlayingTime(
        ws.data.gameId,
        ws.data.trainerId,
        Date.now() - ws.data.startTime,
      );
    }
    if (ws.data.trainerId) {
      ws.data.trainerId = undefined;
    }
    this.websocketDataService.update(ws);

    return { type: 'deleteRegistration', payload: game };
  };

  private messageHandleMap: Record<
    string,
    (
      ws: Socket,
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
