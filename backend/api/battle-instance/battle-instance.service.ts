import Battle, { IBattleInstance } from "./battle";
import CompleteService from "../CompleteService";
import BattleInstanceMapper from "./battle-instance.mapper";

class BattleInstanceService extends CompleteService<IBattleInstance> {
  private static instance: BattleInstanceService;
  public static getInstance(): BattleInstanceService {
    if (!BattleInstanceService.instance) {
      BattleInstanceService.instance = new BattleInstanceService(
        Battle,
        BattleInstanceMapper.getInstance()
      );
    }
    return BattleInstanceService.instance;
  }
}

export default BattleInstanceService;
