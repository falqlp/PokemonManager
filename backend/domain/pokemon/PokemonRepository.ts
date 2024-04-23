import Pokemon, { IPokemon } from "./Pokemon";
import Trainer from "../trainer/Trainer";
import CompleteRepository from "../CompleteRepository";
import PokemonMapper from "./PokemonMapper";
import { ListBody } from "../ReadOnlyRepository";
import Nursery from "../nursery/Nursery";

class PokemonRepository extends CompleteRepository<IPokemon> {
  private static instance: PokemonRepository;

  public static getInstance(): PokemonRepository {
    if (!PokemonRepository.instance) {
      PokemonRepository.instance = new PokemonRepository(
        Pokemon,
        PokemonMapper.getInstance(),
      );
    }
    return PokemonRepository.instance;
  }

  public async listComplete(
    body: ListBody,
    gameId?: string,
  ): Promise<IPokemon[]> {
    return await this.list(body, { map: this.mapper.mapComplete, gameId });
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
}

export default PokemonRepository;
