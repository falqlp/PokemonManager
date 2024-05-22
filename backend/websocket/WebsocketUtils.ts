import WebSocket from "ws";
import WebsocketDataService, {
  CustomWebsocket,
  NotificationType,
  WebsocketMessage,
} from "./WebsocketDataService";
import { IPokemon } from "../domain/pokemon/Pokemon";
import { singleton } from "tsyringe";

@singleton()
export default class WebsocketUtils {
  constructor(private websocketDataService: WebsocketDataService) {}

  public reloadAll(): void {
    this.sendMessageToClients(
      { type: "reload" },
      this.websocketDataService.getClients(),
    );
  }

  public async updatePlayer(trainerId: string, gameId: string): Promise<void> {
    const clients = this.websocketDataService.getClients(
      (client) =>
        client.gameId === gameId.toString() &&
        client.trainerId === trainerId.toString(),
    );

    clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "updatePlayer" }));
      }
    });
  }

  public sendMessageToClientInGame(
    gameId: string,
    message: WebsocketMessage,
  ): void {
    const clients = this.websocketDataService.getClients(
      (client) => client.gameId === gameId.toString(),
    );
    this.sendMessageToClients(message, clients);
  }

  private sendMessageToClients(
    message: WebsocketMessage,
    clients: CustomWebsocket[],
  ): void {
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
    this.sendMessageToTrainers([pokemon.trainerId], message);
  }

  public notify(key: string, type: NotificationType, trainerId: string): void {
    const message = {
      type: "notify",
      payload: {
        key,
        type,
      },
    };
    this.sendMessageToTrainers([trainerId], message);
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
    this.sendMessageToTrainers([pokemon.trainerId], message);
  }

  public notifyUser(
    key: string,
    userId: string,
    type?: NotificationType,
  ): void {
    const message: WebsocketMessage = {
      type: "notify",
      payload: { key, type: type ?? NotificationType.Neutral },
    };
    this.sendMessageToUsers([userId], message);
  }

  public updateUsers(userIds: string[]): void {
    const message: WebsocketMessage = {
      type: "updateUser",
    };
    userIds = userIds.map((id) => id.toString());
    this.sendMessageToUsers(userIds, message);
  }

  public sendMessageToUsers(
    userIds: string[],
    message: WebsocketMessage,
  ): void {
    const clients = this.websocketDataService.getClients((client) =>
      userIds.includes(client.userId),
    );
    this.sendMessageToClients(message, clients);
  }

  public sendMessageToTrainers(
    trainersIds: string[],
    message: WebsocketMessage,
  ): void {
    trainersIds = trainersIds.map((trainersId) => trainersId.toString());
    const clients = this.websocketDataService.getClients((client) =>
      trainersIds.includes(client.trainerId),
    );
    this.sendMessageToClients(message, clients);
  }

  public updateGame(gameId: string): void {
    this.sendMessageToClientInGame(gameId, { type: "updateGame" });
  }
}
