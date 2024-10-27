import Populater from 'shared/common/domain/Populater';
import { Model, PopulateOptions } from 'mongoose';
import PokemonPopulater from '../../pokemon/PokemonPopulater';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Nursery, { INursery } from './Nursery';

@Injectable()
class NurseryPopulater extends Populater<INursery> {
  constructor(
    protected pokemonPopulater: PokemonPopulater,
    @InjectModel(Nursery.modelName)
    public readonly schema: Model<INursery>,
  ) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return {
      path: 'eggs',
      model: this.pokemonPopulater.schema,
      populate: this.pokemonPopulater.populate(),
    };
  }
}

export default NurseryPopulater;
