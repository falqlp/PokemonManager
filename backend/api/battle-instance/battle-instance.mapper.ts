import Battle, { IBattleInstance } from "./battle";
import { IMapper } from "../IMapper";
import TrainerService from "../trainer/trainer.service";

class BattleInstanceMapper implements IMapper<IBattleInstance> {
  private static instance: BattleInstanceMapper;
  constructor(protected trainerService: TrainerService) {}
  async map(entity: IBattleInstance): Promise<IBattleInstance> {
    entity.player = await this.trainerService.get(
      entity.player as unknown as string
    );
    entity.opponent = await this.trainerService.get(
      entity.opponent as unknown as string
    );
    return entity;
  }

  update(entity: IBattleInstance): IBattleInstance {
    entity.player = entity.player._id;
    entity.opponent = entity.opponent._id;
    return entity;
  }
  public static getInstance(): BattleInstanceMapper {
    if (!BattleInstanceMapper.instance) {
      BattleInstanceMapper.instance = new BattleInstanceMapper(
        TrainerService.getInstance()
      );
    }
    return BattleInstanceMapper.instance;
  }
}

export default BattleInstanceMapper;
