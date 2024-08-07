import PokemonBase, { IPokemonBase } from "./PokemonBase";
import ReadOnlyRepository from "../../ReadOnlyRepository";
import { sample } from "../../../utils/RandomUtils";
import { singleton } from "tsyringe";
import { EmptyPopulater } from "../../EmptyPopulater";

@singleton()
class PokemonBaseRepository extends ReadOnlyRepository<IPokemonBase> {
  constructor(populater: EmptyPopulater) {
    super(PokemonBase, populater);
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
      legendary: { $not: { $eq: true } },
      "evolution.evolution": { $ne: [] },
    });
    const dtos = sample<IPokemonBase>(await aggregation, 6, seed);
    return dtos.map((pokemon: IPokemonBase) => {
      delete (pokemon as any).evolution;
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
