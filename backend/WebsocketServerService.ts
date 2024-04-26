import WebSocket, { WebSocketServer } from "ws";
import GameRepository from "./domain/game/GameRepository";
import { IPokemon } from "./domain/pokemon/Pokemon";
import { container, singleton } from "tsyringe";

export interface WebsocketMessage {
  type: string;
  payload?: any;
}

@singleton()
class WebsocketServerService {
  private wss: WebSocketServer;
  private clients: { [gameId: string]: WebSocket[] } = {};

  public initializeWebSocketServer(server: any): void {
    this.wss = new WebSocketServer({ server });
    this.wss.on("connection", (ws: WebSocket) => {
      ws.on("message", (message: string) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "register") {
          const gameId = parsedMessage.payload.gameId;
          if (!this.clients[gameId]) {
            this.clients[gameId] = [];
          }
          this.clients[gameId].push(ws);
          (ws as any).gameId = gameId;
        }
      });
      ws.on("message", (message: string) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "deleteRegistration") {
          const gameId = parsedMessage.payload.gameId;
          if (this.clients[gameId]) {
            delete this.clients[gameId];
          }
        }
      });
      ws.on("close", () => {
        const gameId = (ws as any).gameId;
        if (gameId && this.clients[gameId]) {
          const index = this.clients[gameId].indexOf(ws);
          if (index !== -1) {
            this.clients[gameId].splice(index, 1);
            if (this.clients[gameId].length === 0) {
              delete this.clients[gameId];
            }
          }
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
    if (player._id.toString() === trainerId && this.clients[gameId]) {
      this.clients[gameId].forEach((client: WebSocket) => {
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
    this.clients[gameId]?.forEach((client: WebSocket) => {
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

  public notify(key: string, gameId: string): void {
    const message = {
      type: "notify",
      payload: {
        key,
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
