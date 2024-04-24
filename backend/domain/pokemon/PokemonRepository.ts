import Pokemon, { IPokemon } from "./Pokemon";
import Trainer from "../trainer/Trainer";
import CompleteRepository from "../CompleteRepository";
import Nursery from "../nursery/Nursery";
import PokemonPopulater from "./PokemonPopulater";
import { FilterQuery, UpdateQuery } from "mongoose";

class PokemonRepository extends CompleteRepository<IPokemon> {
  private static instance: PokemonRepository;

  public static getInstance(): PokemonRepository {
    if (!PokemonRepository.instance) {
      PokemonRepository.instance = new PokemonRepository(
        Pokemon,
        PokemonPopulater.getInstance(),
      );
    }
    return PokemonRepository.instance;
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
