import { WebSocketServer } from "ws";
import { singleton } from "tsyringe";
import { Server } from "https";
import { HandleWebsocketMessageService } from "./HandleWebsocketMessageService";
import WebsocketDataService, {
  CustomWebsocket,
  WebsocketMessage,
} from "./WebsocketDataService";
import WebsocketUtils from "./WebsocketUtils";
import SimulateDayWebsocketService from "./SimulateDayWebsocketService";
import { mongoId } from "../utils/MongoUtils";

@singleton()
class WebsocketServerService {
  private wss: WebSocketServer;

  constructor(
    private handleWebsocketMessageService: HandleWebsocketMessageService,
    private websocketDataService: WebsocketDataService,
    private websocketUtils: WebsocketUtils,
    private simulateDayWebsocketService: SimulateDayWebsocketService,
  ) {}

  public initializeWebSocketServer(server: Server): void {
    this.wss = new WebSocketServer({ server });
    this.wss.on("connection", (ws: CustomWebsocket) => {
      ws.id = mongoId().toString();
      this.websocketDataService.push(ws);
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
        this.websocketDataService.set(
          this.websocketDataService.getClients((client) => client.id !== ws.id),
        );
      });
      ws.send(
        JSON.stringify({
          type: "connexion",
          payload: "Connected with websocket",
        }),
      );
    });
    setTimeout(
      () => {
        this.websocketUtils.reloadAll();
      },
      process.env.MONGODB_LOCAL === "1" ? 0 : 2000,
    );
  }

  private handleResponse(message: WebsocketMessage | void): void {
    if (message) {
      if (message.type === "deleteRegistration" && message.payload) {
        this.simulateDayWebsocketService.updateSimulateStatus(message.payload);
      }
    }
  }
}

export default WebsocketServerService;
