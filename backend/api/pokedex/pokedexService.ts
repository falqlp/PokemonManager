import evolutionService from "../evolution/evolution.service";
import PokemonBaseService from "../pokemonBase/pokemonBase.service";
import { IPokemonBase } from "../pokemonBase/pokemonBase";
import { IPokedex, IPokedexEvolution } from "./pokedex";

export class PokedexService {
  public static getInstance(): PokedexService {
    if (!PokedexService.instance) {
      PokedexService.instance = new PokedexService(
        PokemonBaseService.getInstance()
      );
    }
    return PokedexService.instance;
  }
  private static instance: PokedexService;
  constructor(protected pokemonBaseService: PokemonBaseService) {}
  public async getPokemonDetails(pokemonId: number): Promise<IPokedex> {
    // code to fetch and return pokemon details
    const evolutions: IPokedexEvolution[] = [];
    const hasEvolutions = await evolutionService.hasEvolution(pokemonId);
    for (const evolution of hasEvolutions) {
      evolutions.push({
        pokemon: await this.pokemonBaseService.getPokemonBaseById(
          evolution.evolveTo
        ),
        evolutionMethod: evolution.evolutionMethod,
        minLevel: evolution.minLevel,
      });
      const hasEvolutions2 = await evolutionService.hasEvolution(
        evolution.evolveTo
      );
      for (const evolution2 of hasEvolutions2) {
        evolutions.push({
          pokemon: await this.pokemonBaseService.getPokemonBaseById(
            evolution2.evolveTo
          ),
          evolutionMethod: evolution2.evolutionMethod,
          minLevel: evolution2.minLevel,
        });
      }
    }
    const evolutionOf: IPokedexEvolution[] = [];
    const isEvolution = await evolutionService.isEvolution(pokemonId);
    if (isEvolution) {
      evolutionOf.push({
        pokemon: await this.pokemonBaseService.getPokemonBaseById(
          isEvolution.pokemonId
        ),
        evolutionMethod: isEvolution.evolutionMethod,
        minLevel: isEvolution.minLevel,
      });
      const isEvolution2 = await evolutionService.isEvolution(
        isEvolution.pokemonId
      );
      if (isEvolution2) {
        evolutionOf.push({
          pokemon: await this.pokemonBaseService.getPokemonBaseById(
            isEvolution2.pokemonId
          ),
          evolutionMethod: isEvolution2.evolutionMethod,
          minLevel: isEvolution2.minLevel,
        });
      }
    }
    const pokemonBase: IPokemonBase =
      await this.pokemonBaseService.getPokemonBaseById(pokemonId);
    return {
      evolutions,
      evolutionOf,
      pokemonBase,
    };
  }
}
