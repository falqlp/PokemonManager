import Populater from 'shared/common/domain/Populater';
import { Model, PopulateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Pokemon, { IPokemon } from './Pokemon';
import Move, { IMove } from '../move/Move';
import PokemonBase, { IPokemonBase } from './pokemonBase/PokemonBase';

@Injectable()
class PokemonPopulater extends Populater<IPokemon> {
  constructor(
    @InjectModel(Pokemon.modelName)
    public readonly schema: Model<IPokemon>,
    @InjectModel(Move.modelName)
    private readonly move: Model<IMove>,
    @InjectModel(PokemonBase.modelName)
    private readonly pokemonBase: Model<IPokemonBase>,
  ) {
    super();
  }
  public populate(): PopulateOptions | PopulateOptions[] {
    return [
      { path: 'moves', model: this.move },
      { path: 'basePokemon', model: this.pokemonBase },
    ];
  }
}

export default PokemonPopulater;
