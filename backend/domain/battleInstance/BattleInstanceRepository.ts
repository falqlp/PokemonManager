import Battle, { IBattleInstance } from "./Battle";
import CompleteService from "../../api/CompleteService";
import BattleInstanceMapper from "./BattleInstanceMapper";

class BattleInstanceRepository extends CompleteService<IBattleInstance> {
  private static instance: BattleInstanceRepository;
  public static getInstance(): BattleInstanceRepository {
    if (!BattleInstanceRepository.instance) {
      BattleInstanceRepository.instance = new BattleInstanceRepository(
        Battle,
        BattleInstanceMapper.getInstance()
      );
    }
    return BattleInstanceRepository.instance;
  }

  public insertManyWithoutMapAndPopulate(
    dtos: IBattleInstance[]
  ): Promise<IBattleInstance[]> {
    return this.schema.insertMany(dtos);
  }
}

export default BattleInstanceRepository;
