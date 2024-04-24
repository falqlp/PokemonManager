import WebSocket, { WebSocketServer } from "ws";
import GameRepository from "./domain/game/GameRepository";
import { IPokemon } from "./domain/pokemon/Pokemon";

export interface WebsocketMessage {
  type: string;
  payload?: any;
}

class WebsocketServerService {
  private static instance: WebsocketServerService;

  public static getInstance(): WebsocketServerService {
    if (!WebsocketServerService.instance) {
      WebsocketServerService.instance = new WebsocketServerService();
    }
    return WebsocketServerService.instance;
  }

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
      ws.send(
        JSON.stringify({
          type: "connexion",
          payload: "Connected with websocket",
        }),
      );
    });
  }

  public async updatePlayer(trainerId: string, gameId: string): Promise<void> {
    const player = (await GameRepository.getInstance().get(gameId)).player;
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
      },
    };
    this.sendMessageToClientInGame(pokemon.gameId, message);
  }

  public notify(key: string, type: string, gameId: string): void {
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
