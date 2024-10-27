import Populater from 'shared/common/domain/Populater';
import { Model, PopulateOptions } from 'mongoose';
import GamePopulater from '../game/GamePopulater';
import { Injectable } from '@nestjs/common';
import User, { IUser } from './User';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
class UserPopulater extends Populater<IUser> {
  constructor(
    protected gamePopulater: GamePopulater,
    @InjectModel(User.modelName)
    public readonly schema: Model<IUser>,
  ) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return [
      {
        path: 'games',
        model: this.gamePopulater.schema,
        populate: this.gamePopulater.populate(),
      },
      {
        path: 'friends',
        model: this.schema,
      },
      {
        path: 'friendRequest',
        model: this.schema,
      },
    ];
  }
}

export default UserPopulater;
