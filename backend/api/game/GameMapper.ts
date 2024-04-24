import { IMapper } from "../../domain/IMapper";
import { IGame } from "../../domain/game/Game";
import TrainerMapper from "../trainer/TrainerMapper";

class GameMapper implements IMapper<IGame> {
  private static instance: GameMapper;
  constructor(protected trainerMapper: TrainerMapper) {}

  public map(dto: IGame): IGame {
    dto.player = dto.player ? this.trainerMapper.map(dto.player) : undefined;
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
