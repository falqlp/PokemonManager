import WebSocket from "ws";
import PartyService from "./api/party/party.service";
import { ObjectId } from "mongodb";

let wss: WebSocket.Server;

export const initializeWebSocketServer = (server: any) => {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", (message: string) => {
      console.log(`Received message => ${message}`);
    });
    ws.send(JSON.stringify("Connected with websocket"));
  });
};

export const sendMessageToClients = (message: any) => {
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

export const updatePlayer = async (trainerId: string) => {
  const player = (await PartyService.getInstance().list({}))[0].player;
  if (new ObjectId(trainerId).equals(player._id)) {
    wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "updatePlayer" }));
      }
    });
  }
};
