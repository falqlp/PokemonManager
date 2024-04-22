import WebSocket, { WebSocketServer } from "ws";
import GameRepository from "./domain/game/GameRepository";
import { IPokemon } from "./api/pokemon/Pokemon";

let wss: WebSocketServer;
const clients: { [gameId: string]: WebSocket[] } = {};

export interface WebsocketMessage {
  type: string;
  payload?: any;
}

export const initializeWebSocketServer = (server: any): void => {
  wss = new WebSocketServer({ server });
  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", (message: string) => {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type === "register") {
        const gameId = parsedMessage.payload.gameId;
        if (!clients[gameId]) {
          clients[gameId] = [];
        }
        clients[gameId].push(ws);
      }
    });
    ws.on("message", (message: string) => {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type === "deleteRegistration") {
        const gameId = parsedMessage.payload.gameId;
        if (clients[gameId]) {
          delete clients[gameId];
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
};

export const updatePlayer = async (
  trainerId: string,
  gameId: string,
): Promise<void> => {
  const player = (await GameRepository.getInstance().get(gameId)).player;
  if (player._id.toString() === trainerId && clients[gameId]) {
    clients[gameId].forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "updatePlayer" }));
      }
    });
  }
};

export const sendMessageToClientInGame = (
  gameId: string,
  message: WebsocketMessage,
): void => {
  clients[gameId]?.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

export const notifyNewMoveLearned = (pokemon: IPokemon): void => {
  const message = {
    type: "notifyNewMoveLearned",
    payload: {
      key: "NOTIFY_NEW_MOVE_LEARNED",
      pokemonName: pokemon.nickname ?? pokemon.basePokemon.name,
    },
  };
  sendMessageToClientInGame(pokemon.gameId, message);
};

export const notify = (key: string, type: string, gameId: string): void => {
  const message = {
    type: "notify",
    payload: {
      key,
      type,
    },
  };
  sendMessageToClientInGame(gameId, message);
};

export const eggHatched = (pokemon: IPokemon): void => {
  const message = {
    type: "eggHatched",
    payload: {
      pokemonBase: pokemon.basePokemon,
      shiny: pokemon.shiny,
      _id: pokemon._id,
    },
  };
  sendMessageToClientInGame(pokemon.gameId, message);
};
