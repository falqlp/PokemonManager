import { IMapper } from "../../domain/IMapper";
import { IUser } from "../../domain/user/User";
import GameMapper from "../game/GameMapper";
import { singleton } from "tsyringe";

@singleton()
class UserMapper implements IMapper<IUser> {
  constructor(protected gameMapper: GameMapper) {}

  public map(dto: IUser): IUser {
    dto.games.map((value) => this.gameMapper.map(value));
    dto.password = undefined;
    return dto;
  }
}

export default UserMapper;
