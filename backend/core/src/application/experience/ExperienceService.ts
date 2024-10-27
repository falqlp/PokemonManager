import TrainerRepository from '../../domain/trainer/TrainerRepository';
import { IPokemon } from '../../domain/pokemon/Pokemon';
import { ITrainer } from '../../domain/trainer/Trainer';
import { IPokemonBase } from '../../domain/pokemon/pokemonBase/PokemonBase';
import { normalRandom } from 'shared/utils/RandomUtils';
import EvolutionRepository from '../../domain/evolution/EvolutionRepository';
import MoveLearningService from '../moveLearning/MoveLearningService';
import { Injectable } from '@nestjs/common';
import { calculateAge } from 'shared/utils/DateUtils';
import GameRepository from '../../domain/game/GameRepository';
import PokemonService from '../pokemon/PokemonService';
import { IGame } from '../../domain/game/Game';

export const XP_PER_LEVEL = 100000;

@Injectable()
class ExperienceService {
  constructor(
    protected trainerRepository: TrainerRepository,
    protected moveLearningService: MoveLearningService,
    protected evolutionRepository: EvolutionRepository,
    protected gameRepository: GameRepository,
    protected pokemonService: PokemonService,
  ) {}

  public async weeklyXpGain(trainerId: string): Promise<{
    trainer: ITrainer;
    xpAndLevelGain: { xp: number; level: number }[];
    evolutions: { pokemonId: string; name: string; evolution: IPokemonBase }[];
  }> {
    const evolutions: {
      pokemonId: string;
      evolution: IPokemonBase;
      name: string;
    }[] = [];
    const trainer = await this.trainerRepository.get(trainerId);
    const actualDate = (await this.gameRepository.get(trainer.gameId))
      .actualDate;
    const xpAndLevelGain: { xp: number; level: number }[] = [];
    const pokemonPromise = trainer.pokemons
      .filter((pokemon) => pokemon.level !== 0)
      .map(async (pokemon) => {
        const res = await this.mapPokemonXp(
          pokemon,
          trainer.trainingCamp.level,
          actualDate,
        );
        xpAndLevelGain[
          trainer.pokemons.findIndex((pokemon2) => pokemon2._id === pokemon._id)
        ] = res;
        if (res?.evolutions) {
          evolutions.push(res.evolutions);
        }
        return pokemon;
      });
    const storagePromise = trainer.pcStorage.storage
      .filter((storage) => storage.pokemon.level !== 0)
      .map(async (storage) => {
        const res = await this.mapPokemonXp(
          storage.pokemon,
          trainer.trainingCamp.level,
          actualDate,
        );
        if (res?.evolutions) {
          evolutions.push(res.evolutions);
        }
        return storage;
      });
    await Promise.all(pokemonPromise);
    await Promise.all(storagePromise);
    return { trainer, xpAndLevelGain, evolutions };
  }

  public async mapPokemonXp(
    pokemon: IPokemon,
    trainingCampLevel: number,
    actualDate: Date,
  ): Promise<{
    xp: number;
    level: number;
    evolutions: { pokemonId: string; evolution: IPokemonBase; name: string };
  }> {
    if (pokemon.level === 0) {
      return;
    }
    let evolutions: {
      pokemonId: string;
      evolution: IPokemonBase;
      name: string;
    };
    const result = this.updateLevelAndXp(
      pokemon,
      trainingCampLevel,
      actualDate,
    );
    pokemon = result.pokemon;
    const levelUp = result.variation > 0;
    if (levelUp) {
      if (pokemon.level > pokemon.maxLevel) {
        pokemon.maxLevel = pokemon.level;
        this.moveLearningService.newMoveLearned(pokemon);
      }
      const evolution = await this.evolutionRepository.evolve(
        pokemon.basePokemon.id,
        pokemon.level,
        'LEVEL-UP',
      );
      if (evolution) {
        evolutions = {
          pokemonId: pokemon._id,
          evolution,
          name: pokemon.nickname ?? pokemon.basePokemon.name,
        };
      }
    }
    return { level: result.variation, xp: result.xpGain, evolutions };
  }

  public updateLevelAndXp(
    pokemon: IPokemon,
    trainingCampLevel: number,
    actualDate: Date,
  ): { pokemon: IPokemon; variation: number; xpGain: number } {
    const xpGain = this.getXp(pokemon, trainingCampLevel, actualDate);
    pokemon.exp += xpGain;
    const result = this.getLevel(pokemon.level, pokemon.exp);
    pokemon.level = result.level;
    pokemon.exp = result.exp;
    pokemon.trainingPercentage = 0;
    return { pokemon, variation: result.variation, xpGain };
  }

  public getXp(
    pokemon: IPokemon,
    lvlTrainingCamp: number,
    actualDate: Date,
  ): number {
    const gain =
      (0.9 + 0.1 * pokemon.trainingPercentage) * //TODO a changer lorsque l'entrainement arrivera
      lvlTrainingCamp *
      70 *
      (pokemon.potential - pokemon.level);
    const loss =
      Math.pow(calculateAge(pokemon.birthday, actualDate), 2) * pokemon.level;
    const gainXp = gain - loss;
    return Math.floor(normalRandom(7 * gainXp, lvlTrainingCamp * 500));
  }

  public getLevel(
    level: number,
    exp: number,
  ): { level: number; exp: number; variation: number } {
    let variation = 0;
    while (exp > XP_PER_LEVEL) {
      exp -= XP_PER_LEVEL;
      level += 1;
      if (level > 100) {
        level = 100;
        exp = XP_PER_LEVEL;
      } else {
        variation += 1;
      }
    }
    while (exp < 0) {
      level -= 1;
      exp += XP_PER_LEVEL;
      if (level < 0) {
        level = 0;
        exp = 0;
      } else {
        variation += 1;
      }
    }
    return { level, exp, variation };
  }

  async xpForOtherTrainer(game: IGame, actualDate: Date): Promise<void> {
    const trainers = await this.trainerRepository.list({
      custom: {
        gameId: game._id,
        _id: {
          $not: { $in: game.players.map((player) => player.trainer._id) },
        },
      },
    });
    let pokemons: IPokemon[] = [];
    for (const trainer of trainers) {
      for (const pokemon of trainer.pokemons.filter(
        (pokemon) => pokemon.level !== 0,
      )) {
        await this.updateOtherPokemon(pokemon, trainer, actualDate);
      }
      for (const pokemon of trainer.pcStorage.storage.map((st) => st.pokemon)) {
        await this.updateOtherPokemon(pokemon, trainer, actualDate);
      }
      pokemons = [
        ...pokemons,
        ...trainer.pokemons,
        ...trainer.pcStorage.storage.map((st) => st.pokemon),
      ];
    }
    await this.pokemonService.updateMany(pokemons, game._id);
  }

  private async updateOtherPokemon(
    pokemon: IPokemon,
    trainer: ITrainer,
    actualDate: Date,
  ): Promise<void> {
    const res = this.updateLevelAndXp(
      pokemon,
      trainer.trainingCamp.level,
      actualDate,
    );
    pokemon.maxLevel = Math.max(pokemon.maxLevel, pokemon.level);
    if (res.variation > 0) {
      pokemon.moves = (
        await this.moveLearningService.learnableMoves(
          pokemon.basePokemon.id,
          pokemon.maxLevel,
          {
            sort: { power: -1 },
          },
        )
      ).slice(0, 2);
      const evolution = await this.evolutionRepository.evolve(
        pokemon.basePokemon.id,
        pokemon.level,
        'LEVEL-UP',
      );
      if (evolution) {
        pokemon.basePokemon = evolution;
      }
    }
  }
}

export default ExperienceService;
