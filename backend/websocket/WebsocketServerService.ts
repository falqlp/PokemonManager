import WebSocket, { WebSocketServer } from "ws";
import { IPokemon } from "../domain/pokemon/Pokemon";
import { singleton } from "tsyringe";
import { Server } from "https";
import { HandleWebsocketMessageService } from "./HandleWebsocketMessageService";
import { IGame } from "../domain/game/Game";

export interface WebsocketMessage {
  type: string;
  payload?: any;
}
export enum NotificationType {
  Neutral = "Neutral",
  Success = "Success",
  Error = "Error",
}

export interface CustomWebsocket extends WebSocket {
  id: string;
  gameId?: string;
  startTime?: number;
  trainerId?: string;
  userId?: string;
  askNextDay?: boolean;
}

@singleton()
class WebsocketServerService {
  private wss: WebSocketServer;
  private clients: CustomWebsocket[] = [];

  constructor(
    private handleWebsocketMessageService: HandleWebsocketMessageService,
  ) {}

  public initializeWebSocketServer(server: Server): void {
    this.wss = new WebSocketServer({ server });
    this.wss.on("connection", (ws: CustomWebsocket) => {
      this.clients.push(ws);
      ws.on("message", async (message: string) => {
        this.handleResponse(
          await this.handleWebsocketMessageService.handleMessage(
            ws,
            JSON.parse(message),
          ),
        );
      });
      ws.on("close", async () => {
        this.handleResponse(
          await this.handleWebsocketMessageService.deleteRegistrationGame(ws),
        );
        this.clients = this.clients.filter((client) => client.id !== ws.id);
      });
      ws.send(
        JSON.stringify({
          type: "connexion",
          payload: "Connected with websocket",
        }),
      );
    });
    setTimeout(() => {
      this.reloadAll();
    }, 2000);
  }

  private reloadAll(): void {
    this.sendMessageToClients({ type: "reload" }, this.clients);
  }

  public async updatePlayer(trainerId: string, gameId: string): Promise<void> {
    const clients = this.clients.filter(
      (client) =>
        client.gameId === gameId.toString() &&
        client.trainerId === trainerId.toString(),
    );

    clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "updatePlayer" }));
      }
    });
  }

  public sendMessageToClientInGame(
    gameId: string,
    message: WebsocketMessage,
  ): void {
    const clients = this.clients.filter(
      (client) => client.gameId === gameId.toString(),
    );
    this.sendMessageToClients(message, clients);
  }

  private sendMessageToClients(
    message: WebsocketMessage,
    clients: CustomWebsocket[],
  ): void {
    clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  public notifyNewMoveLearned(pokemon: IPokemon): void {
    const message = {
      type: "notifyNewMoveLearned",
      payload: {
        key: "NOTIFY_NEW_MOVE_LEARNED",
        pokemonName: pokemon.nickname ?? pokemon.basePokemon.name,
        id: pokemon._id.toString(),
      },
    };
    this.sendMessageToTrainers([pokemon.trainerId], message);
  }

  public notify(key: string, type: NotificationType, trainerId: string): void {
    const message = {
      type: "notify",
      payload: {
        key,
        type,
      },
    };
    this.sendMessageToTrainers([trainerId], message);
  }

  public eggHatched(pokemon: IPokemon): void {
    const message = {
      type: "eggHatched",
      payload: {
        pokemonBase: pokemon.basePokemon,
        shiny: pokemon.shiny,
        _id: pokemon._id,
      },
    };
    this.sendMessageToTrainers([pokemon.trainerId], message);
  }

  public notifyUser(
    key: string,
    userId: string,
    type?: NotificationType,
  ): void {
    const message: WebsocketMessage = {
      type: "notify",
      payload: { key, type: type ?? NotificationType.Neutral },
    };
    this.sendMessageToUsers([userId], message);
  }

  public updateUsers(userIds: string[]): void {
    const message: WebsocketMessage = {
      type: "updateUser",
    };
    userIds = userIds.map((id) => id.toString());
    this.sendMessageToUsers(userIds, message);
  }

  public sendMessageToUsers(
    userIds: string[],
    message: WebsocketMessage,
  ): void {
    const clients = this.clients.filter((client) =>
      userIds.includes(client.userId),
    );
    this.sendMessageToClients(message, clients);
  }

  public sendMessageToTrainers(
    trainersIds: string[],
    message: WebsocketMessage,
  ): void {
    trainersIds = trainersIds.map((trainersId) => trainersId.toString());
    const clients = this.clients.filter((client) =>
      trainersIds.includes(client.trainerId),
    );
    this.sendMessageToClients(message, clients);
  }

  private handleResponse(message: WebsocketMessage | void): void {
    if (message) {
      if (message.type === "playRound") {
        const trainers: string[] = [
          message.payload.player._id.toString(),
          message.payload.opponent._id.toString(),
        ];
        this.clients
          .filter((client) => trainers.includes(client.trainerId))
          .forEach((client: CustomWebsocket) => {
            client.send(JSON.stringify(message));
          });
      } else if (message.type === "deleteRegistration" && message.payload) {
        this.updateSimulateStatus(message.payload);
      }
    }
  }

  public changeTrainerSimulateDayStatus(
    trainerId: string,
    game: IGame,
    status: boolean,
  ): void {
    this.clients
      .filter((client) => client.trainerId === trainerId.toString())
      .map((client) => {
        client.askNextDay = status;
        return client;
      });
    this.updateSimulateStatus(game);
  }

  public updateSimulateStatus(game: IGame): void {
    const wantNextDay = this.getNextDayStatus(game);
    const nbTrainers = game.players.length;
    this.sendMessageToClientInGame(game._id.toString(), {
      type: "simulateStatus",
      payload: { wantNextDay, nbTrainers },
    });
  }

  public getNextDayStatus(game: IGame): number {
    const trainerIds = game.players.map((player) =>
      player.trainer._id.toString(),
    );
    return this.clients.filter(
      (client) => trainerIds.includes(client.trainerId) && client.askNextDay,
    ).length;
  }

  public updateGame(gameId: string): void {
    this.sendMessageToClientInGame(gameId, { type: "updateGame" });
  }

  public simulating(gameId: string, value: boolean): void {
    this.sendMessageToClientInGame(gameId, {
      type: "simulating",
      payload: value,
    });
  }
}

export default WebsocketServerService;
