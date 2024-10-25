import Battle, { IBattleInstance } from "./Battle";
import CompleteRepository from "../CompleteRepository";
import { singleton } from "tsyringe";
import { BattleInstancePopulater } from "./BattleInstancePopulater";

@singleton()
class BattleInstanceRepository extends CompleteRepository<IBattleInstance> {
  constructor(populater: BattleInstancePopulater) {
    super(Battle, populater);
  }

  public insertManyWithoutMapAndPopulate(
    dtos: IBattleInstance[],
  ): Promise<IBattleInstance[]> {
    return this.schema.insertMany(dtos);
  }
}

export default BattleInstanceRepository;
