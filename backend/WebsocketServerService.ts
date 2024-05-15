import WebSocket, { WebSocketServer } from "ws";
import GameRepository from "./domain/game/GameRepository";
import { IPokemon } from "./domain/pokemon/Pokemon";
import { container, singleton } from "tsyringe";
import { mongoId } from "./utils/MongoUtils";
import { Server } from "https";

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
}

@singleton()
class WebsocketServerService {
  private wss: WebSocketServer;
  private clients: CustomWebsocket[] = [];

  constructor(private gameRepository: GameRepository) {}

  public initializeWebSocketServer(server: Server): void {
    this.wss = new WebSocketServer({ server });
    this.wss.on("connection", (ws: CustomWebsocket) => {
      ws.on("message", (message: string) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "register") {
          const gameId = parsedMessage.payload.gameId;
          const trainerId = parsedMessage.payload.trainerId;
          ws.id = mongoId().toString();
          ws.gameId = gameId;
          ws.startTime = Date.now();
          ws.trainerId = trainerId;
          this.clients.push(ws);
        }
      });
      ws.on("message", async (message: string) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "deleteRegistration") {
          const gameId = parsedMessage.payload.gameId;
          this.clients = this.clients.filter((client) => client.id !== ws.id);
          await this.gameRepository.updatePlayingTime(
            gameId,
            Date.now() - ws.startTime,
          );
        }
      });
      ws.on("close", async () => {
        const gameId = ws.gameId;
        const client = this.clients.find((client) => client.id === ws.id);
        if (gameId && client) {
          this.clients = this.clients.filter((client) => client.id !== ws.id);
          await this.gameRepository.updatePlayingTime(
            gameId,
            Date.now() - ws.startTime,
          );
        }
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
}

export default WebsocketServerService;
