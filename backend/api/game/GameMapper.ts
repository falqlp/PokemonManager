import { IMapper } from "../../domain/IMapper";
import { IGame } from "../../domain/game/Game";
import TrainerMapper from "../trainer/TrainerMapper";
import { singleton } from "tsyringe";

@singleton()
class GameMapper implements IMapper<IGame> {
  constructor(protected trainerMapper: TrainerMapper) {}

  public map(dto: IGame): IGame {
    dto.player = dto.player ? this.trainerMapper.map(dto.player) : undefined;
    return dto;
  }
}

export default GameMapper;
