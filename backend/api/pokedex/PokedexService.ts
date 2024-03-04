import evolutionService from "../evolution/EvolutionService";
import PokemonBaseService from "../pokemonBase/PokemonBaseService";
import { IPokemonBase } from "../pokemonBase/PokemonBase";
import { IPokedex, IPokedexEvolution, IPokedexMoveLearned } from "./Pokedex";
import MoveLearningService from "../moveLearning/MoveLearningService";
import MoveService from "../move/MoveService";
import moveLearning from "../moveLearning/MoveLearning";
import move from "../move/Move";
import moveService from "../move/MoveService";

export class PokedexService {
  public static getInstance(): PokedexService {
    if (!PokedexService.instance) {
      PokedexService.instance = new PokedexService(
        PokemonBaseService.getInstance(),
        MoveLearningService.getInstance(),
        MoveService.getInstance()
      );
    }
    return PokedexService.instance;
  }
  private static instance: PokedexService;
  constructor(
    protected pokemonBaseService: PokemonBaseService,
    protected moveLearningService: MoveLearningService,
    protected moveService: MoveService
  ) {}
  public async getPokemonDetails(pokemonId: number): Promise<IPokedex> {
    const evolutions = await this.getEvolutions(pokemonId);
    const evolutionOf = await this.getEvolutionOf(pokemonId);
    const movesLearned = await this.getMovesLearned(pokemonId);
    const pokemonBase: IPokemonBase =
      await this.pokemonBaseService.getPokemonBaseById(pokemonId);
    return {
      evolutions,
      evolutionOf,
      pokemonBase,
      movesLearned,
    };
  }

  protected async getEvolutions(
    pokemonId: number
  ): Promise<IPokedexEvolution[]> {
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
    return evolutions;
  }
  protected async getEvolutionOf(
    pokemonId: number
  ): Promise<IPokedexEvolution[]> {
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
        evolutionOf.unshift({
          pokemon: await this.pokemonBaseService.getPokemonBaseById(
            isEvolution2.pokemonId
          ),
          evolutionMethod: isEvolution2.evolutionMethod,
          minLevel: isEvolution2.minLevel,
        });
      }
    }
    return evolutionOf;
  }

  protected async getMovesLearned(
    pokemonId: number
  ): Promise<IPokedexMoveLearned[]> {
    const movesLearning =
      await this.moveLearningService.getMovesOfAllEvolutions(pokemonId, 100);
    const movesLearned: IPokedexMoveLearned[] = [];
    for (const moveLearning of movesLearning) {
      const move = await this.moveService.get(moveLearning.moveId);
      if (move.power > 0) {
        movesLearned.push({
          move,
          levelLearnAt: moveLearning.levelLearnAt,
          learnMethod: moveLearning.learnMethod,
        });
      }
    }
    movesLearned.sort((a, b) => a.levelLearnAt - b.levelLearnAt);
    return movesLearned;
  }
}
