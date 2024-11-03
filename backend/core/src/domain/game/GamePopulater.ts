import Populater from 'shared/common/domain/Populater';
import { Model, PopulateOptions } from 'mongoose';
import TrainerPopulater from '../trainer/TrainerPopulater';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Game, { IGame } from './Game';

@Injectable()
class GamePopulater extends Populater<IGame> {
  constructor(
    protected trainerPopulater: TrainerPopulater,
    @InjectModel(Game.modelName)
    public readonly schema: Model<IGame>,
  ) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return {
      path: 'players.trainer',
      model: this.trainerPopulater.schema,
      populate: this.trainerPopulater.populate(),
    };
  }
}

export default GamePopulater;
