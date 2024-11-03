import { IMapper } from 'shared/common/domain/IMapper';
import { IUser } from '../../domain/user/User';
import GameMapper from '../game/GameMapper';
import { Injectable } from '@nestjs/common';

@Injectable()
class UserMapper implements IMapper<IUser> {
  constructor(protected gameMapper: GameMapper) {}

  public map(dto: IUser): IUser {
    dto.games?.map((value) => this.gameMapper.map(value));
    dto.password = undefined;
    dto.friends = dto.friends ?? [];
    dto.friendRequest = dto.friendRequest ?? [];
    return dto;
  }
}

export default UserMapper;
