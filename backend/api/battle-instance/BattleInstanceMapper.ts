import { IBattleInstance } from "./Battle";
import { IMapper } from "../IMapper";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import { PopulateOptions } from "mongoose";
import TrainerMapper from "../../domain/trainer/TrainerMapper";
import Trainer from "../../domain/trainer/Trainer";

class BattleInstanceMapper implements IMapper<IBattleInstance> {
  private static instance: BattleInstanceMapper;
  constructor(
    protected trainerService: TrainerRepository,
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
        TrainerRepository.getInstance(),
        TrainerMapper.getInstance()
      );
    }
    return BattleInstanceMapper.instance;
  }
}

export default BattleInstanceMapper;
