import PokemonBase, { IPokemonBase } from "./PokemonBase";
import ReadOnlyService from "../ReadOnlyService";
import PokemonBaseMapper from "./PokemonBaseMapper";
import { IWishList } from "../nursery/Nursery";
import { sample } from "../../utils/RandomUtils";

class PokemonBaseService extends ReadOnlyService<IPokemonBase> {
  private static instance: PokemonBaseService;
  public static getInstance(): PokemonBaseService {
    if (!PokemonBaseService.instance) {
      PokemonBaseService.instance = new PokemonBaseService(
        PokemonBase,
        PokemonBaseMapper
      );
    }
    return PokemonBaseService.instance;
  }
  public async generateEggBase(wishlist: IWishList): Promise<IPokemonBase> {
    let query = this.getDefaultQuery();
    if (Math.random() >= 0.3) {
      const choosenType = this.chooseTypeBasedOnWishlist(wishlist);
      query = this.getTypeBasedQuery(choosenType);
    }
    return this.getRandomPokemon(query);
  }

  public getDefaultQuery() {
    return {
      base: true,
      legendary: { $not: { $eq: true } },
      mythical: { $not: { $eq: true } },
    };
  }

  public chooseTypeBasedOnWishlist(wishlist: IWishList): string {
    const filteredTypes = Object.entries(
      (
        wishlist.typeRepartition as unknown as { toObject: () => any }
      ).toObject()
    ).filter(
      ([type, percentage]) => percentage !== null && (percentage as number) > 0
    );
    let cumulative = 0;
    const randomNumber = Math.random() * 100;
    for (const [type, percentage] of filteredTypes) {
      cumulative += percentage as number;
      if (randomNumber < cumulative) {
        return type;
      }
    }
    return null;
  }

  public getTypeBasedQuery(choosenType: string) {
    return {
      ...this.getDefaultQuery(),
      types: { $in: [choosenType.toUpperCase()] },
    };
  }

  public async getRandomPokemon(query: any): Promise<IPokemonBase> {
    const pokemons = await PokemonBase.find(query);
    const randomIndex = Math.floor(Math.random() * pokemons.length);
    return pokemons[randomIndex];
  }

  public getPokemonBaseById(id: number) {
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
}

export default PokemonBaseService;
