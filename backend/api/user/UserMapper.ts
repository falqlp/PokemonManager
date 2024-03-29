import { IMapper } from "../IMapper";
import { IUser } from "./User";
import GameService from "../game/GameService";
import { PopulateOptions } from "mongoose";
import Pokemon from "../pokemon/Pokemon";
import Game from "../game/Game";

class UserMapper implements IMapper<IUser> {
  private static instance: UserMapper;
  constructor(protected gameService: GameService) {}
  public populate(): PopulateOptions {
    return {
      path: "games",
      model: Game,
    };
  }
  public async map(dto: IUser): Promise<IUser> {
    dto.games = await this.gameService.list({
      ids: dto.games as unknown as string[],
    });
    return dto;
  }

  public update(dto: IUser): IUser {
    return dto;
  }

  public static getInstance(): UserMapper {
    if (!UserMapper.instance) {
      UserMapper.instance = new UserMapper(GameService.getInstance());
    }
    return UserMapper.instance;
  }
}

export default UserMapper;
