import PokemonBaseRepository from '../../domain/pokemon/pokemonBase/PokemonBaseRepository';
import { IPokedex, IPokedexEvolution, IPokedexMoveLearned } from './Pokedex';
import MoveRepository from '../../domain/move/MoveRepository';
import EvolutionRepository from '../../domain/evolution/EvolutionRepository';
import MoveLearningService from '../moveLearning/MoveLearningService';
import { Injectable } from '@nestjs/common';
import { IPokemonBase } from 'shared/models/pokemon/pokemon-models';

@Injectable()
export class PokedexService {
  constructor(
    protected pokemonBaseRepository: PokemonBaseRepository,
    protected moveLearningService: MoveLearningService,
    protected moveService: MoveRepository,
    protected evolutionRepository: EvolutionRepository,
  ) {}

  public async getPokemonDetails(pokemonId: number): Promise<IPokedex> {
    const evolutions = await this.getEvolutions(pokemonId);
    const evolutionOf = await this.getEvolutionOf(pokemonId);
    const movesLearned = await this.getMovesLearned(pokemonId);
    const pokemonBase: IPokemonBase =
      await this.pokemonBaseRepository.getPokemonBaseById(pokemonId);
    return {
      evolutions,
      evolutionOf,
      pokemonBase,
      movesLearned,
    };
  }

  public async getEvolutions(pokemonId: number): Promise<IPokedexEvolution[]> {
    const evolutions: IPokedexEvolution[] = [];
    const hasEvolutions =
      await this.evolutionRepository.hasEvolution(pokemonId);
    for (const evolution of hasEvolutions) {
      evolutions.push({
        pokemon: await this.pokemonBaseRepository.getPokemonBaseById(
          evolution.evolveTo,
        ),
        evolutionMethod: evolution.evolutionMethod,
        minLevel: evolution.minLevel,
      });
      const hasEvolutions2 = await this.evolutionRepository.hasEvolution(
        evolution.evolveTo,
      );
      for (const evolution2 of hasEvolutions2) {
        evolutions.push({
          pokemon: await this.pokemonBaseRepository.getPokemonBaseById(
            evolution2.evolveTo,
          ),
          evolutionMethod: evolution2.evolutionMethod,
          minLevel: evolution2.minLevel,
        });
      }
    }
    return evolutions;
  }

  public async getEvolutionOf(pokemonId: number): Promise<IPokedexEvolution[]> {
    const evolutionOf: IPokedexEvolution[] = [];
    const isEvolution = await this.evolutionRepository.isEvolution(pokemonId);
    if (isEvolution) {
      evolutionOf.push({
        pokemon: await this.pokemonBaseRepository.getPokemonBaseById(
          isEvolution.pokemonId,
        ),
        evolutionMethod: isEvolution.evolutionMethod,
        minLevel: isEvolution.minLevel,
      });
      const isEvolution2 = await this.evolutionRepository.isEvolution(
        isEvolution.pokemonId,
      );
      if (isEvolution2) {
        evolutionOf.unshift({
          pokemon: await this.pokemonBaseRepository.getPokemonBaseById(
            isEvolution2.pokemonId,
          ),
          evolutionMethod: isEvolution2.evolutionMethod,
          minLevel: isEvolution2.minLevel,
        });
      }
    }
    return evolutionOf;
  }

  public async getMovesLearned(
    pokemonId: number,
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
