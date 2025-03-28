import Trainer, { ITrainer } from '../trainer/Trainer';
import CompleteRepository from 'shared/common/domain/CompleteRepository';
import Nursery, { INursery } from '../trainer/nursery/Nursery';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import PokemonPopulater from './PokemonPopulater';
import { IGame } from '../game/Game';
import { addYears } from 'shared/utils/DateUtils';
import PcStorage, { IPcStorage } from '../trainer/pcStorage/PcStorage';
import { InjectModel } from '@nestjs/mongoose';
import { IPokemon } from 'shared/models/pokemon/pokemon-models';
import Pokemon from './Pokemon';

@Injectable()
class PokemonRepository extends CompleteRepository<IPokemon> {
  constructor(
    pokemonPopulater: PokemonPopulater,
    @InjectModel(Pokemon.modelName)
    protected override readonly schema: Model<IPokemon>,
    @InjectModel(Trainer.modelName)
    private readonly trainerSchema: Model<ITrainer>,
    @InjectModel(Nursery.modelName)
    private readonly nurserySchema: Model<INursery>,
    @InjectModel(PcStorage.modelName)
    private readonly pcStorageSchema: Model<IPcStorage>,
  ) {
    super(schema, pokemonPopulater);
  }

  public override async delete(_id: string): Promise<IPokemon> {
    await this.trainerSchema.updateMany(
      { pokemons: { $in: [_id] } },
      { $pull: { pokemons: _id } },
    );
    await this.nurserySchema.updateMany(
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
    await this.trainerSchema.updateMany(
      { gameId: game._id },
      {
        $pull: { pokemons: { $in: oldPokemonIds } },
      },
    );
    await this.pcStorageSchema.updateMany(
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
