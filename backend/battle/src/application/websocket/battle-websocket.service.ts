import { Injectable } from '@nestjs/common';
import {
  KafkaClientService,
  NeedReplyTopics,
} from '../core-interface/kafka-client.service';
import { firstValueFrom } from 'rxjs';
import { IBattleState } from '../battle/BattleInterfaces';

@Injectable()
export default class BattleWebsocketService {
  constructor(private readonly kafkaClientService: KafkaClientService) {}

  public playRound(battleState: IBattleState): void {
    this.kafkaClientService.getClient().emit('playRound', battleState);
  }

  public addInitBattleStatus(trainerId: string): void {
    this.kafkaClientService.getClient().emit('addInitBattleStatus', trainerId);
  }

  public deleteInitBattleStatus(trainerIds: string[]): void {
    this.kafkaClientService
      .getClient()
      .emit('deleteInitBattleStatus', trainerIds);
  }

  public getInitBattleReady(trainerIds: string[]): Promise<boolean> {
    return firstValueFrom(
      this.kafkaClientService
        .getClient()
        .send(NeedReplyTopics.getInitBattleReady, trainerIds),
    );
  }

  public async addAskNextRound(
    trainerIds: string[],
    status: boolean,
  ): Promise<void> {
    await firstValueFrom(
      this.kafkaClientService
        .getClient()
        .send(NeedReplyTopics.addAskNextRound, { trainerIds, status }),
    );
  }

  public async addAskNextRoundLoop(
    trainerIds: string[],
    status: boolean,
  ): Promise<void> {
    await firstValueFrom(
      this.kafkaClientService
        .getClient()
        .send(NeedReplyTopics.addAskNextRoundLoop, { trainerIds, status }),
    );
  }

  public async resetNextRoundStatus(trainerIds: string[]): Promise<void> {
    await firstValueFrom(
      this.kafkaClientService
        .getClient()
        .send(NeedReplyTopics.resetNextRoundStatus, trainerIds),
    );
  }

  public async setLoopMode(trainerIds: string[]): Promise<void> {
    await firstValueFrom(
      this.kafkaClientService
        .getClient()
        .send(NeedReplyTopics.setLoopMode, trainerIds),
    );
  }

  public getNextRoundStatus(trainerIds: string[]): Promise<boolean> {
    return firstValueFrom(
      this.kafkaClientService
        .getClient()
        .send(NeedReplyTopics.getNextRoundStatus, trainerIds),
    );
  }

  public getNextRoundLoopStatus(trainerIds: string[]): Promise<boolean> {
    return firstValueFrom(
      this.kafkaClientService
        .getClient()
        .send(NeedReplyTopics.getNextRoundLoopStatus, trainerIds),
    );
  }

  public updateNextRoundStatus(trainerIds: string[]): void {
    this.kafkaClientService
      .getClient()
      .emit('updateNextRoundStatus', trainerIds);
  }
}
