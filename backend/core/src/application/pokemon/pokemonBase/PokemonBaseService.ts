import { IWishList } from '../../../domain/trainer/nursery/Nursery';
import PokemonBaseRepository from '../../../domain/pokemon/pokemonBase/PokemonBaseRepository';
import { Injectable } from '@nestjs/common';
import { IPokemonBase } from 'shared/models/pokemon/pokemon-models';

export const RANDOM_TYPE_RATE = 0.1;

@Injectable()
class PokemonBaseService {
  constructor(protected pokemonBaseRepository: PokemonBaseRepository) {}

  public async generateEggBase(wishlist: IWishList): Promise<IPokemonBase> {
    let query = this.getDefaultQuery();
    if (Math.random() >= RANDOM_TYPE_RATE) {
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
      ultraBeast: { $not: { $eq: true } },
      paradox: { $not: { $eq: true } },
    };
  }

  public getBaseGenerationQuery(): any {
    return {
      base: true,
      legendary: { $not: { $eq: true } },
      mythical: { $not: { $eq: true } },
      ultraBeast: { $not: { $eq: true } },
      paradox: { $not: { $eq: true } },
    };
  }

  public chooseTypeBasedOnWishlist(wishlist: IWishList): string {
    const filteredTypes = Object.entries(
      (wishlist.typeRepartition as unknown as { toObject: () => any }).toObject
        ? (
            wishlist.typeRepartition as unknown as { toObject: () => any }
          ).toObject()
        : wishlist.typeRepartition,
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
      this.getBaseGenerationQuery(),
    );
  }
}

export default PokemonBaseService;
