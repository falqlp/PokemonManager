import Battle, { IBattleInstance } from "./Battle";
import CompleteRepository from "../CompleteRepository";
import { BattleInstancePopulater } from "./BattleInstancePopulater";

class BattleInstanceRepository extends CompleteRepository<IBattleInstance> {
  private static instance: BattleInstanceRepository;
  public static getInstance(): BattleInstanceRepository {
    if (!BattleInstanceRepository.instance) {
      BattleInstanceRepository.instance = new BattleInstanceRepository(
        Battle,
        BattleInstancePopulater.getInstance(),
      );
    }
    return BattleInstanceRepository.instance;
  }

  public insertManyWithoutMapAndPopulate(
    dtos: IBattleInstance[],
  ): Promise<IBattleInstance[]> {
    return this.schema.insertMany(dtos);
  }
}

export default BattleInstanceRepository;
