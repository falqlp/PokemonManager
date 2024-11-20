import { Injectable } from '@nestjs/common';
import { IBattleState } from './BattleInterfaces';

@Injectable()
export class BattleDataService {
  private battleMap: Map<string, IBattleState> = new Map();

  public getBattleState(key: string): IBattleState {
    if (!this.battleMap.has(key)) {
      return undefined;
    }
    return this.battleMap.get(key);
  }

  public setBattleState(key: string, battleState: IBattleState): IBattleState {
    this.battleMap.set(key, battleState);
    return this.battleMap.get(key);
  }

  public delete(key: string): void {
    this.battleMap.delete(key);
  }
}
