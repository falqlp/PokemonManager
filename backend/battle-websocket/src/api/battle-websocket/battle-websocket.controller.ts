import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  BattleWebsocketGateway,
  BattleWebsocketMessage,
} from '../../application/battle-websocket/battle-websocket.gateway';

@Controller('battle-websocket')
export class BattleWebsocketController {
  constructor(
    private readonly battleWebsocketGateway: BattleWebsocketGateway,
  ) {}

  @MessagePattern('playRound')
  public playRound(
    @Payload()
    battleState: {
      player: { _id: string };
      opponent: { _id: string };
    },
  ): void {
    const trainers: string[] = [
      battleState.player._id.toString(),
      battleState.opponent._id.toString(),
    ];
    const message: BattleWebsocketMessage = {
      type: 'playRound',
      payload: battleState,
    };
    this.battleWebsocketGateway.sendMessageToTrainers(trainers, message);
  }

  @MessagePattern('addInitBattleStatus')
  public async addInitBattleStatus(
    @Payload() trainerId: string,
  ): Promise<void> {
    (await this.battleWebsocketGateway.getClientIn(trainerId)).map((client) => {
      client.data.initBattle = true;
      return client;
    });
  }

  @MessagePattern('deleteInitBattleStatus')
  public async deleteInitBattleStatus(
    @Payload() trainerIds: string[],
  ): Promise<void> {
    (await this.battleWebsocketGateway.getClientIn(trainerIds)).map(
      (client) => {
        client.data.initBattle = false;
        return client;
      },
    );
  }

  @MessagePattern('getInitBattleReady')
  public async getInitBattleReady(
    @Payload() trainerIds: string[],
  ): Promise<boolean> {
    return (await this.battleWebsocketGateway.getClientIn(trainerIds)).every(
      (client) => client.data.initBattle,
    );
  }

  @MessagePattern('addAskNextRound')
  public async addAskNextRound(
    @Payload('trainerIds') trainerIds: string[],
    @Payload('status') status: boolean,
  ): Promise<void> {
    (await this.battleWebsocketGateway.getClientIn(trainerIds)).map(
      (client) => {
        client.data.askNextRound = status;
        return client;
      },
    );
  }

  @MessagePattern('addAskNextRoundLoop')
  public async addAskNextRoundLoop(
    @Payload('trainerIds') trainerIds: string[],
    @Payload('status') status: boolean,
  ): Promise<void> {
    (await this.battleWebsocketGateway.getClientIn(trainerIds)).map(
      (client) => {
        client.data.askNextRoundLoop = status;
        return client;
      },
    );
  }

  @MessagePattern('resetNextRoundStatus')
  public async resetNextRoundStatus(
    @Payload() trainerIds: string[],
  ): Promise<void> {
    (await this.battleWebsocketGateway.getClientIn(trainerIds)).map(
      (client) => {
        client.data.askNextRound = false;
        client.data.askNextRoundLoop = false;
        client.data.loopMode = false;
        return client;
      },
    );
  }

  @MessagePattern('setLoopMode')
  public async setLoopMode(@Payload() trainerIds: string[]): Promise<void> {
    (await this.battleWebsocketGateway.getClientIn(trainerIds)).map(
      (client) => {
        client.data.loopMode = true;
        return client;
      },
    );
  }

  @MessagePattern('getNextRoundStatus')
  public async getNextRoundStatus(
    @Payload() trainerIds: string[],
  ): Promise<boolean> {
    const clients = await this.battleWebsocketGateway.getClientIn(trainerIds);
    return !!clients.find(
      (client) => client.data.askNextRound || client.data.askNextRoundLoop,
    );
  }

  @MessagePattern('getNextRoundLoopStatus')
  public async getNextRoundLoopStatus(
    @Payload() trainerIds: string[],
  ): Promise<boolean> {
    const clients = await this.battleWebsocketGateway.getClientIn(trainerIds);
    return !!clients.find((client) => client.data.askNextRoundLoop);
  }

  @MessagePattern('updateNextRoundStatus')
  public async updateNextRoundStatus(
    @Payload() trainerIds: string[],
  ): Promise<void> {
    let nextRound: boolean = false;
    let nextRoundLoop: boolean = false;
    let loopMode: boolean = false;
    (await this.battleWebsocketGateway.getClientIn(trainerIds)).forEach(
      (client) => {
        if (client.data.askNextRoundLoop) {
          nextRoundLoop = true;
        }
        if (client.data.askNextRound) {
          nextRound = true;
        }
        if (client.data.loopMode) {
          loopMode = true;
        }
      },
    );
    const message: BattleWebsocketMessage = {
      type: 'updateBattleStatus',
      payload: { nextRound, nextRoundLoop, loopMode },
    };
    this.battleWebsocketGateway.sendMessageToTrainers(trainerIds, message);
  }
}
