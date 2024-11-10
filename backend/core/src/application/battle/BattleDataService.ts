import { Injectable } from '@nestjs/common';
import { IBattleState } from './BattleInterfaces';
import { IBattleParticipationEvent, IDamageEvent } from 'shared/models';

@Injectable()
export class BattleDataService {
  private battleMap: Map<
    string,
    {
      battleState: IBattleState;
      battleStats: {
        damageEvents: IDamageEvent[];
        battleParticipationEvents: IBattleParticipationEvent[];
      };
    }
  > = new Map();

  public getBattleState(key: string): IBattleState {
    if (!this.battleMap.has(key)) {
      return undefined;
    }
    return this.battleMap.get(key).battleState;
  }

  public getDamageEvents(key: string): IDamageEvent[] {
    if (!this.battleMap.has(key)) {
      return [];
    }
    return this.battleMap.get(key).battleStats.damageEvents;
  }

  public getBattleParticipationEvents(
    key: string,
  ): IBattleParticipationEvent[] {
    if (!this.battleMap.has(key)) {
      return [];
    }
    return this.battleMap.get(key).battleStats.battleParticipationEvents;
  }

  public setBattleState(key: string, battleState: IBattleState): void {
    if (!this.battleMap.has(key)) {
      this.battleMap.set(key, {
        battleState,
        battleStats: { battleParticipationEvents: [], damageEvents: [] },
      });
    }
    this.battleMap.get(key).battleState = battleState;
  }

  public delete(key: string): void {
    this.battleMap.delete(key);
  }
}
