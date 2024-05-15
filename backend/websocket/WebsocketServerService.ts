import WebSocket, { WebSocketServer } from "ws";
import GameRepository from "../domain/game/GameRepository";
import { IPokemon } from "../domain/pokemon/Pokemon";
import { container, singleton } from "tsyringe";
import { Server } from "https";
import { HandleWebsocketMessageService } from "./HandleWebsocketMessageService";

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
        await this.handleWebsocketMessageService.deleteRegistrationGame(ws);
        this.clients = this.clients.filter((client) => client.id !== ws.id);
      });
      ws.send(
        JSON.stringify({
          type: "connexion",
          payload: "Connected with websocket",
        }),
      );
    });
  }

  public async updatePlayer(trainerId: string, gameId: string): Promise<void> {
    const player = (await container.resolve(GameRepository).get(gameId)).player;
    const clients = this.clients.filter((client) => client.gameId === gameId);
    if (player._id.toString() === trainerId && clients.length > 0) {
      clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "updatePlayer" }));
        }
      });
    }
  }

  public sendMessageToClientInGame(
    gameId: string,
    message: WebsocketMessage,
  ): void {
    const clients = this.clients.filter((client) => client.gameId === gameId);
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
    this.sendMessageToClientInGame(pokemon.gameId, message);
  }

  public notify(key: string, type: NotificationType, gameId: string): void {
    const message = {
      type: "notify",
      payload: {
        key,
        type,
      },
    };
    this.sendMessageToClientInGame(gameId, message);
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
    this.sendMessageToClientInGame(pokemon.gameId, message);
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
      }
    }
  }
}

export default WebsocketServerService;
