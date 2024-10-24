import { IBattleInstance } from "../../domain/battleInstance/Battle";
import { IMapper } from "../../domain/IMapper";
import TrainerMapper from "../trainer/TrainerMapper";
import { singleton } from "tsyringe";

@singleton()
class BattleInstanceMapper implements IMapper<IBattleInstance> {
  constructor(protected trainerMapper: TrainerMapper) {}

  public map(entity: IBattleInstance): IBattleInstance {
    entity.player = this.trainerMapper.mapPartial(entity.player);
    entity.opponent = this.trainerMapper.mapPartial(entity.opponent);
    return entity;
  }
}

export default BattleInstanceMapper;
