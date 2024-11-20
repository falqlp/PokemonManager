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

  public addAskNextRound(trainerIds: string[], status: boolean): void {
    this.kafkaClientService
      .getClient()
      .emit('addAskNextRound', { trainerIds, status });
  }

  public addAskNextRoundLoop(trainerIds: string[], status: boolean): void {
    this.kafkaClientService
      .getClient()
      .emit('addAskNextRoundLoop', { trainerIds, status });
  }

  public resetNextRoundStatus(trainerIds: string[]): void {
    this.kafkaClientService
      .getClient()
      .emit('resetNextRoundStatus', trainerIds);
  }

  public setLoopMode(trainerIds: string[]): void {
    this.kafkaClientService.getClient().emit('setLoopMode', trainerIds);
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
