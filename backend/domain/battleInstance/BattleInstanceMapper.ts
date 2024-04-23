import { IBattleInstance } from "./Battle";
import { IMapper } from "../IMapper";
import { PopulateOptions } from "mongoose";
import TrainerMapper from "../trainer/TrainerMapper";
import Trainer from "../trainer/Trainer";

class BattleInstanceMapper implements IMapper<IBattleInstance> {
  private static instance: BattleInstanceMapper;
  constructor(protected trainerMapper: TrainerMapper) {}

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

  public mapComplete(entity: IBattleInstance): IBattleInstance {
    entity.player = this.trainerMapper.mapComplete(entity.player);
    entity.opponent = this.trainerMapper.mapComplete(entity.opponent);
    return entity;
  }

  public update(entity: IBattleInstance): IBattleInstance {
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
