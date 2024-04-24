import { IWishList } from "../../domain/nursery/Nursery";
import { IPokemonBase } from "../../domain/pokemonBase/PokemonBase";
import PokemonBaseRepository from "../../domain/pokemonBase/PokemonBaseRepository";
import { singleton } from "tsyringe";

@singleton()
class PokemonBaseService {
  constructor(protected pokemonBaseRepository: PokemonBaseRepository) {}

  public async generateEggBase(wishlist: IWishList): Promise<IPokemonBase> {
    let query = this.getDefaultQuery();
    if (Math.random() >= 0.3) {
      const choosenType = this.chooseTypeBasedOnWishlist(wishlist);
      query = this.getTypeBasedQuery(choosenType);
    }
    return this.getRandomPokemon(query);
  }

  public getTypeBasedQuery(choosenType: string): any {
    return {
      ...this.getDefaultQuery(),
      types: { $in: [choosenType.toUpperCase()] },
    };
  }

  public getDefaultQuery(): any {
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
      ).toObject(),
    ).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([type, percentage]) => percentage !== null && (percentage as number) > 0,
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

  public async getRandomPokemon(query: any): Promise<IPokemonBase> {
    const pokemons = await this.pokemonBaseRepository.list({ custom: query });
    const randomIndex = Math.floor(Math.random() * pokemons.length);
    return pokemons[randomIndex];
  }

  public generateBasePokemon(quantity: number): Promise<IPokemonBase[]> {
    return this.pokemonBaseRepository.generateBasePokemon(
      quantity,
      this.getDefaultQuery(),
    );
  }
}

export default PokemonBaseService;
