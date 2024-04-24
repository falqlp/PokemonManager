import { IBattleInstance } from "../../domain/battleInstance/Battle";
import { IMapper } from "../../domain/IMapper";
import TrainerMapper from "../trainer/TrainerMapper";

class BattleInstanceMapper implements IMapper<IBattleInstance> {
  private static instance: BattleInstanceMapper;
  constructor(protected trainerMapper: TrainerMapper) {}

  public map(entity: IBattleInstance): IBattleInstance {
    entity.player = this.trainerMapper.mapPartial(entity.player);
    entity.opponent = this.trainerMapper.mapPartial(entity.opponent);
    return entity;
  }

  public static getInstance(): BattleInstanceMapper {
    if (!BattleInstanceMapper.instance) {
      BattleInstanceMapper.instance = new BattleInstanceMapper(
        TrainerMapper.getInstance(),
      );
    }
    return BattleInstanceMapper.instance;
  }
}

export default BattleInstanceMapper;
