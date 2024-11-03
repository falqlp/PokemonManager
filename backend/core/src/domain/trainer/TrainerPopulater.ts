import Populater from 'shared/common/domain/Populater';
import { Model, PopulateOptions } from 'mongoose';
import PokemonPopulater from '../pokemon/PokemonPopulater';
import PcStoragePopulater from './pcStorage/PcStoragePopulater';
import NurseryPopulater from './nursery/NurseryPopulater';
import TrainingCampPopulater from './trainingCamp/TrainingCampPopulater';
import { Injectable } from '@nestjs/common';
import Competition, { ICompetition } from '../competiton/Competition';
import { InjectModel } from '@nestjs/mongoose';
import Trainer, { ITrainer } from './Trainer';

@Injectable()
class TrainerPopulater extends Populater<ITrainer> {
  constructor(
    protected pokemonPopulater: PokemonPopulater,
    protected pcStoragePopulater: PcStoragePopulater,
    protected nurseryPopulater: NurseryPopulater,
    protected trainingCampPopulater: TrainingCampPopulater,
    @InjectModel(Trainer.modelName)
    public readonly schema: Model<ITrainer>,
    @InjectModel(Competition.modelName)
    private readonly competition: Model<ICompetition>,
  ) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return [
      {
        path: 'pokemons',
        model: this.pokemonPopulater.schema,
        populate: this.pokemonPopulater.populate(),
      },
      {
        path: 'pcStorage',
        model: this.pcStoragePopulater.schema,
        populate: this.pcStoragePopulater.populate(),
      },
      {
        path: 'trainingCamp',
        model: this.trainingCampPopulater.schema,
        populate: this.trainingCampPopulater.populate(),
      },
      {
        path: 'nursery',
        model: this.nurseryPopulater.schema,
        populate: this.nurseryPopulater.populate(),
      },
      {
        path: 'competitions',
        model: this.competition,
      },
    ];
  }
}

export default TrainerPopulater;
