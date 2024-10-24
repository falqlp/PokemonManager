import { IMapper } from "../../domain/IMapper";
import { IGame } from "../../domain/game/Game";
import TrainerMapper from "../trainer/TrainerMapper";
import { singleton } from "tsyringe";

@singleton()
class GameMapper implements IMapper<IGame> {
  constructor(protected trainerMapper: TrainerMapper) {}

  public map(dto: IGame): IGame {
    dto.players = dto.players?.map((player) => {
      if (player.trainer) {
        player.trainer = this.trainerMapper.map(player.trainer);
      }
      return player;
    });
    return dto;
  }
}

export default GameMapper;
