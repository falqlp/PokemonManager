import WebSocket from "ws";
import GameService from "./api/game/game.service";
import { ObjectId } from "mongodb";
import pokemon, { IPokemon } from "./api/pokemon/pokemon";

let wss: WebSocket.Server;
const clients: { [gameId: string]: WebSocket[] } = {};

export const initializeWebSocketServer = (server: any) => {
  wss = new WebSocket.Server({ server });

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
    ws.send(
      JSON.stringify({ type: "connexion", payload: "Connected with websocket" })
    );
  });
};

export const updatePlayer = async (trainerId: string, gameId: string) => {
  const player = (await GameService.getInstance().get(gameId)).player;
  if (player._id.toString() === trainerId && clients[gameId]) {
    clients[gameId].forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "updatePlayer" }));
      }
    });
  }
};

export const notifyNewMoveLearned = (pokemon: IPokemon): void => {
  clients[pokemon.gameId].forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "notifyNewMoveLearned",
          payload: {
            key: "NOTIFY_NEW_MOVE_LEARNED",
            pokemonName: pokemon.nickname ?? pokemon.basePokemon.name,
          },
        })
      );
    }
  });
};

export const notify = (key: string, type: string, gameId: string): void => {
  clients[gameId].forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "notify",
          payload: {
            key,
            type,
          },
        })
      );
    }
  });
};

export const eggHatched = (pokemon: IPokemon): void => {
  clients[pokemon.gameId].forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "eggHatched",
          payload: {
            pokemonBase: pokemon.basePokemon,
            _id: pokemon._id,
          },
        })
      );
    }
  });
};
