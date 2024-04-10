import { IMapper } from "../IMapper";
import { IUser } from "./User";
import GameService from "../game/GameService";
import { PopulateOptions } from "mongoose";
import Game from "../game/Game";
import HashService from "../../application/hash/HashService";

class UserMapper implements IMapper<IUser> {
  private static instance: UserMapper;
  constructor(
    protected gameService: GameService,
    protected hashService: HashService
  ) {}
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
    delete dto.password;
    return dto;
  }

  public async update(dto: IUser): Promise<IUser> {
    if (dto.password) {
      dto.password = await this.hashService.hashPassword(dto.password);
    }
    return dto;
  }

  public static getInstance(): UserMapper {
    if (!UserMapper.instance) {
      UserMapper.instance = new UserMapper(
        GameService.getInstance(),
        HashService.getInstance()
      );
    }
    return UserMapper.instance;
  }
}

export default UserMapper;
