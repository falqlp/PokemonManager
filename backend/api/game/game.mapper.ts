import { IMapper } from "../IMapper";
import { IGame } from "./game";
import TrainerService from "../trainer/trainer.service";

class GameMapper implements IMapper<IGame> {
  private static instance: GameMapper;
  constructor(protected trainerService: TrainerService) {}
  public async map(dto: IGame): Promise<IGame> {
    dto.player = await this.trainerService.get(dto.player as unknown as string);
    return dto;
  }

  public update(dto: IGame): IGame {
    return dto;
  }

  public static getInstance(): GameMapper {
    if (!GameMapper.instance) {
      GameMapper.instance = new GameMapper(TrainerService.getInstance());
    }
    return GameMapper.instance;
  }
}

export default GameMapper;
