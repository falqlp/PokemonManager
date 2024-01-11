import { IBattleInstance } from "./battle";
import { IMapper } from "../IMapper";
import TrainerService from "../trainer/trainer.service";
import { PopulateOptions } from "mongoose";
import TrainerMapper from "../trainer/trainer.mapper";
import Trainer from "../trainer/trainer";

class BattleInstanceMapper implements IMapper<IBattleInstance> {
  private static instance: BattleInstanceMapper;
  constructor(
    protected trainerService: TrainerService,
    protected trainerMapper: TrainerMapper
  ) {}

  public populate(): PopulateOptions[] {
    return [
      {
        path: "player",
        model: Trainer,
        populate: this.trainerMapper.populate(),
      },
      {
        path: "opponent",
        model: Trainer,
        populate: this.trainerMapper.populate(),
      },
    ];
  }
  public map(entity: IBattleInstance): IBattleInstance {
    entity.player = this.trainerMapper.mapPartial(entity.player);
    entity.opponent = this.trainerMapper.mapPartial(entity.opponent);
    return entity;
  }

  public update(entity: IBattleInstance): IBattleInstance {
    return entity;
  }
  public static getInstance(): BattleInstanceMapper {
    if (!BattleInstanceMapper.instance) {
      BattleInstanceMapper.instance = new BattleInstanceMapper(
        TrainerService.getInstance(),
        TrainerMapper.getInstance()
      );
    }
    return BattleInstanceMapper.instance;
  }
}

export default BattleInstanceMapper;
