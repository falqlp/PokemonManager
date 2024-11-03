import Populater from 'shared/common/domain/Populater';
import { Model, PopulateOptions } from 'mongoose';
import PokemonPopulater from '../../pokemon/PokemonPopulater';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import PcStorage, { IPcStorage } from './PcStorage';

@Injectable()
class PcStoragePopulater extends Populater<IPcStorage> {
  constructor(
    protected pokemonPopulater: PokemonPopulater,
    @InjectModel(PcStorage.modelName)
    public readonly schema: Model<IPcStorage>,
  ) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return {
      path: 'storage',
      populate: {
        path: 'pokemon',
        model: this.pokemonPopulater.schema,
        populate: this.pokemonPopulater.populate(),
      },
    };
  }
}

export default PcStoragePopulater;
