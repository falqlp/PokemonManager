import { IMapper } from "../IMapper";
import { IGame } from "./game";
import { PopulateOptions } from "mongoose";
import Trainer from "../trainer/trainer";
import TrainerMapper from "../trainer/trainer.mapper";

class GameMapper implements IMapper<IGame> {
  private static instance: GameMapper;
  constructor(protected trainerMapper: TrainerMapper) {}

  public populate(): PopulateOptions {
    return {
      path: "player",
      model: Trainer,
      populate: this.trainerMapper.populate(),
    };
  }
  public async map(dto: IGame): Promise<IGame> {
    dto.player = this.trainerMapper.map(dto.player);
    return dto;
  }

  public async update(dto: IGame): Promise<IGame> {
    return dto;
  }

  public static getInstance(): GameMapper {
    if (!GameMapper.instance) {
      GameMapper.instance = new GameMapper(TrainerMapper.getInstance());
    }
    return GameMapper.instance;
  }
}

export default GameMapper;
