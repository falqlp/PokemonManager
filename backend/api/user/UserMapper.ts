import { IMapper } from "../../domain/IMapper";
import { IUser } from "../../domain/user/User";
import GameMapper from "../game/GameMapper";

class UserMapper implements IMapper<IUser> {
  private static instance: UserMapper;
  constructor(protected gameMapper: GameMapper) {}

  public map(dto: IUser): IUser {
    dto.games.map((value) => this.gameMapper.map(value));
    dto.password = undefined;
    return dto;
  }

  public static getInstance(): UserMapper {
    if (!UserMapper.instance) {
      UserMapper.instance = new UserMapper(GameMapper.getInstance());
    }
    return UserMapper.instance;
  }
}

export default UserMapper;
