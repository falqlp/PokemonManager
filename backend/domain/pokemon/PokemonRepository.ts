import Pokemon, { IPokemon } from "./Pokemon";
import Trainer from "../trainer/Trainer";
import CompleteRepository from "../CompleteRepository";
import Nursery from "../trainer/nursery/Nursery";
import { FilterQuery, UpdateQuery } from "mongoose";
import { singleton } from "tsyringe";
import PokemonPopulater from "./PokemonPopulater";

@singleton()
class PokemonRepository extends CompleteRepository<IPokemon> {
  constructor(pokemonPopulater: PokemonPopulater) {
    super(Pokemon, pokemonPopulater);
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
}

export default PokemonRepository;
