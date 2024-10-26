import Populater from '../Populater';
import { Model, PopulateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import TournamentPopulater from './tournament/TournamentPopulater';
import TrainerPopulater from '../trainer/TrainerPopulater';
import Competition, { ICompetition } from './Competition';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export default class CompetitionPopulater extends Populater<ICompetition> {
  constructor(
    @InjectModel(Competition.modelName)
    public readonly schema: Model<ICompetition>,
    private tournamentPopulater: TournamentPopulater,
    private trainerPopulater: TrainerPopulater,
  ) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return [
      {
        path: 'tournament',
        model: this.tournamentPopulater.schema,
        populate: this.tournamentPopulater.populate(),
      },
      {
        path: 'groups',
        model: this.trainerPopulater.schema,
        populate: this.trainerPopulater.populate(),
      },
    ];
  }
}
