import { singleton } from "tsyringe";
import { IBattleState } from "./BattleInterfaces";

@singleton()
export class BattleDataService {
  private battleMap: Map<
    string,
    { battleState: IBattleState; interval?: number }
  > = new Map();

  public getBattleState(key: string): IBattleState {
    if (!this.battleMap.has(key)) {
      return undefined;
    }
    return this.battleMap.get(key).battleState;
  }

  public setBattleState(key: string, battleState: IBattleState): void {
    if (!this.battleMap.has(key)) {
      this.battleMap.set(key, { battleState });
    }
    this.battleMap.get(key).battleState = battleState;
  }

  public delete(key: string): void {
    this.battleMap.delete(key);
  }
}
