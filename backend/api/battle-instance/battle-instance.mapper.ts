import Battle, { IBattleInstance } from "./battle";
import { IMapper } from "../IMapper";
import TrainerService from "../trainer/trainer.service";

class BattleInstanceMapper implements IMapper<IBattleInstance> {
  private static instance: BattleInstanceMapper;
  constructor(protected trainerService: TrainerService) {}
  async map(entity: IBattleInstance): Promise<IBattleInstance> {
    entity.player = await this.trainerService.getPartial(
      entity.player as unknown as string
    );
    entity.opponent = await this.trainerService.getPartial(
      entity.opponent as unknown as string
    );
    return entity;
  }

  update(entity: IBattleInstance): IBattleInstance {
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
