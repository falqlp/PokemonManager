import TrainerRepository from "../../domain/trainer/TrainerRepository";
import { IPokemon } from "../../domain/pokemon/Pokemon";
import { ITrainer } from "../../domain/trainer/Trainer";
import { IPokemonBase } from "../../domain/pokemonBase/PokemonBase";
import { normalRandom } from "../../utils/RandomUtils";
import EvolutionRepository from "../../domain/evolution/EvolutionRepository";
import MoveLearningService from "../moveLearning/MoveLearningService";
import TrainerService from "../trainer/TrainerService";
import { singleton } from "tsyringe";

const XP_PER_LEVEL = 100000;

@singleton()
class ExperienceService {
  constructor(
    protected trainerRepository: TrainerRepository,
    protected moveLearningService: MoveLearningService,
    protected evolutionRepository: EvolutionRepository,
    protected trainerService: TrainerService,
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
    const xpAndLevelGain: { xp: number; level: number }[] = [];
    const pokemonPromise = trainer.pokemons
      .filter((pokemon) => pokemon.level !== 0)
      .map(async (pokemon) => {
        const res = await this.mapPokemonXp(
          pokemon,
          trainer.trainingCamp.level,
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
        );
        if (res?.evolutions) {
          evolutions.push(res.evolutions);
        }
        return storage;
      });
    await Promise.all(pokemonPromise);
    await Promise.all(storagePromise);
    const updateTrainer = { ...(trainer as any)._doc } as ITrainer;
    await this.trainerService.update(updateTrainer);
    return { trainer, xpAndLevelGain, evolutions };
  }

  public async mapPokemonXp(
    pokemon: IPokemon,
    trainingCampLevel: number,
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
    const result = this.updateLevelAndXp(pokemon, trainingCampLevel);
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
        "LEVEL-UP",
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
  ): { pokemon: IPokemon; variation: number; xpGain: number } {
    const xpGain = this.getXp(pokemon, trainingCampLevel);
    pokemon.exp += xpGain;
    const result = this.getLevel(pokemon.level, pokemon.exp);
    pokemon.level = result.level;
    pokemon.exp = result.exp;
    pokemon.trainingPercentage = 0;
    return { pokemon, variation: result.variation, xpGain };
  }

  public getXp(pokemon: IPokemon, lvlTrainingCamp: number): number {
    const gain =
      (0.9 + 0.1 * pokemon.trainingPercentage) * //TODO a changer lorsque l'entrainement arrivera
      lvlTrainingCamp *
      70 *
      (pokemon.potential - pokemon.level);
    const loss = Math.pow(pokemon.age, 2) * pokemon.level;
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
}

export default ExperienceService;
