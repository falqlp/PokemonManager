import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import WebsocketDataService, { WebsocketMessage } from './WebsocketDataService';
import { mongoId } from 'shared/utils/MongoUtils';
import { HandleWebsocketMessageService } from './HandleWebsocketMessageService';
import WebsocketUtils from './WebsocketUtils';
import SimulateDayWebsocketService from './SimulateDayWebsocketService';

@WebSocketGateway({
  namespace: '/core',
  cors: {
    origin: process.env.FRONT_URL,
  },
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private handleWebsocketMessageService: HandleWebsocketMessageService,
    private websocketDataService: WebsocketDataService,
    private websocketUtils: WebsocketUtils,
    private simulateDayWebsocketService: SimulateDayWebsocketService,
  ) {}

  afterInit(): void {
    console.log('WebSocket server initialized with Socket.IO');
    setTimeout(
      () => {
        this.websocketUtils.reloadAll();
      },
      process.env.MONGODB_LOCAL === '1' ? 0 : 2000,
    );
  }

  handleConnection(client: Socket): void {
    client.data.id = mongoId();
    this.websocketDataService.push(client);
    console.log(`Client connected: ${client.id}`);

    client.emit('connexion', {
      type: 'connexion',
      payload: 'Connected with socket.io',
    });

    // Gère les messages entrants pour chaque client
    client.on('message', async (message: string) => {
      const parsedMessage = JSON.parse(message);
      const response = await this.handleWebsocketMessageService.handleMessage(
        client,
        parsedMessage,
      );
      this.handleResponse(response, client);
    });
  }

  async handleDisconnect(client: Socket): Promise<void> {
    console.log(`Client disconnected: ${client.id}`);
    this.websocketDataService.set(
      this.websocketDataService.getClients((c) => c.data.id !== client.data.id),
    );

    // Appelle le service pour supprimer l'enregistrement de jeu
    await this.handleWebsocketMessageService.deleteRegistrationGame(client);
  }

  private handleResponse(
    message: WebsocketMessage | void,
    client: Socket,
  ): void {
    if (message) {
      if (message.type === 'deleteRegistration' && message.payload) {
        this.simulateDayWebsocketService.updateSimulateStatus(message.payload);
      }
      client.send(message.type, message.payload); // Envoie le message au client spécifique
    }
  }
}
