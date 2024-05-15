import { singleton } from "tsyringe";
import { IBattleState } from "./BattleInterfaces";

@singleton()
export class BattleDataService {
  private battleMap: Map<string, IBattleState> = new Map();

  public get(key: string): IBattleState {
    return this.battleMap.get(key);
  }

  public set(key: string, battleState: IBattleState): void {
    this.battleMap.set(key, battleState);
  }

  public delete(key: string): void {
    this.battleMap.delete(key);
  }
}
