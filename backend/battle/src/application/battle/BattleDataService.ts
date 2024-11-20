import { Injectable } from '@nestjs/common';
import { IBattleState } from './BattleInterfaces';
import BattleStateRepository from '../../domain/BattleStateRepository';

@Injectable()
export class BattleDataService {
  constructor(private readonly battleStateRepository: BattleStateRepository) {}

  public async getBattleState(key: string): Promise<IBattleState> {
    return await this.battleStateRepository.get(key);
  }

  public async setBattleState(
    key: string,
    battleState: IBattleState,
  ): Promise<IBattleState> {
    return await this.battleStateRepository.set(key, battleState);
  }

  public delete(key: string): void {
    this.battleStateRepository.delete(key).then();
  }
}
