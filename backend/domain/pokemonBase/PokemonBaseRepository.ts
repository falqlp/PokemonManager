import PokemonBase, { IPokemonBase } from "./PokemonBase";
import ReadOnlyRepository from "../ReadOnlyRepository";
import PokemonBaseMapper from "./PokemonBaseMapper";
import { sample } from "../../utils/RandomUtils";

class PokemonBaseRepository extends ReadOnlyRepository<IPokemonBase> {
  private static instance: PokemonBaseRepository;
  public static getInstance(): PokemonBaseRepository {
    if (!PokemonBaseRepository.instance) {
      PokemonBaseRepository.instance = new PokemonBaseRepository(
        PokemonBase,
        PokemonBaseMapper,
      );
    }
    return PokemonBaseRepository.instance;
  }

  public getPokemonBaseById(id: number): Promise<IPokemonBase> {
    return this.schema.findOne({ id });
  }

  public async getStartersBase(seed?: string): Promise<IPokemonBase[]> {
    const aggregation = this.schema.aggregate();
    aggregation.lookup({
      from: "evolutions",
      localField: "id",
      foreignField: "pokemonId",
      as: "evolution",
    });
    aggregation.unwind("evolution");
    aggregation.lookup({
      from: "evolutions",
      localField: "evolution.evolveTo",
      foreignField: "pokemonId",
      as: "evolution.evolution",
    });
    aggregation.match({
      base: true,
      "evolution.evolution": { $ne: [] },
    });
    const dtos = sample<IPokemonBase>(await aggregation, 3, seed);
    return dtos.map((pokemon: IPokemonBase) => {
      delete (pokemon as any).evolution;
      this.mapper.map(pokemon);
      return pokemon;
    });
  }

  public async generateBasePokemon(
    quantity: number,
    query: any,
  ): Promise<IPokemonBase[]> {
    return this.schema.aggregate().match(query).sample(quantity);
  }
}

export default PokemonBaseRepository;
