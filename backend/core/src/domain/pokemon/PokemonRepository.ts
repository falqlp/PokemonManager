import Pokemon, { IPokemon } from './Pokemon';
import Trainer from '../trainer/Trainer';
import CompleteRepository from '../CompleteRepository';
import Nursery from '../trainer/nursery/Nursery';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import PokemonPopulater from './PokemonPopulater';
import { IGame } from '../game/Game';
import { addYears } from '../../utils/DateUtils';
import PcStorage from '../trainer/pcStorage/PcStorage';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
class PokemonRepository extends CompleteRepository<IPokemon> {
  constructor(
    pokemonPopulater: PokemonPopulater,
    @InjectModel(Pokemon.modelName)
    protected override readonly schema: Model<IPokemon>,
  ) {
    super(schema, pokemonPopulater);
  }

  public override async delete(_id: string): Promise<IPokemon> {
    await Trainer.updateMany(
      { pokemons: { $in: [_id] } },
      { $pull: { pokemons: _id } },
    );
    await Nursery.updateMany(
      { eggs: { $in: [_id] } },
      { $pull: { eggs: _id } },
    );
    return super.delete(_id);
  }

  public findOneAndUpdate(
    filter: FilterQuery<IPokemon>,
    update: UpdateQuery<IPokemon>,
  ): Promise<IPokemon> {
    return this.schema.findOneAndUpdate(filter, update);
  }

  public async archiveOldPokemon(game: IGame): Promise<void> {
    const old = addYears(game.actualDate, -8);
    const oldPokemons = await this.list(
      { custom: { birthday: { $lte: old } } },
      { gameId: game._id },
    );
    const oldPokemonIds = oldPokemons.map((pokemon) => pokemon._id);
    await Trainer.updateMany(
      { gameId: game._id },
      {
        $pull: { pokemons: { $in: oldPokemonIds } },
      },
    );
    await PcStorage.updateMany(
      { gameId: game._id },
      {
        $pull: { storage: { pokemon: { $in: oldPokemonIds } } },
      },
    );
    await this.schema.updateMany(
      { _id: { $in: oldPokemonIds } },
      { $unset: { trainerId: '' } },
    );
  }
}

export default PokemonRepository;
