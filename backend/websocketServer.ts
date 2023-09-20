import WebSocket from "ws";
import PartyService from "./api/party/party.service";
import { ObjectId } from "mongodb";
import pokemon, { IPokemon } from "./api/pokemon/pokemon";

let wss: WebSocket.Server;
const clients: { [partyId: string]: WebSocket[] } = {};

export const initializeWebSocketServer = (server: any) => {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", (message: string) => {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type === "register") {
        const partyId = parsedMessage.payload.partyId;
        if (!clients[partyId]) {
          clients[partyId] = [];
        }
        clients[partyId].push(ws);
      }
    });
    ws.send(
      JSON.stringify({ type: "connexion", payload: "Connected with websocket" })
    );
  });
};

export const sendMessageToClients = (message: any) => {
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

export const updatePlayer = async (trainerId: string, partyId: string) => {
  const player = (await PartyService.getInstance().get(partyId)).player;
  if (new ObjectId(trainerId).equals(player._id) && clients[partyId]) {
    clients[partyId].forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "updatePlayer" }));
      }
    });
  }
};

export const notifyNewMoveLearned = (pokemon: IPokemon): void => {
  clients[pokemon.partyId].forEach((client: WebSocket) => {
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
