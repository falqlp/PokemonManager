import TrainerService from "../trainer/TrainerService";
import { IPokemon } from "../pokemon/Pokemon";
import { ITrainer } from "../trainer/Trainer";
import normalRandomUtils from "../../utils/normalRandomUtils";
import evolutionService from "../evolution/EvolutionService";
import { IPokemonBase } from "../pokemonBase/PokemonBase";
import MoveLearningService from "../moveLearning/MoveLearningService";

const XP_PER_LEVEL = 100000;

class ExperienceService {
  private static instance: ExperienceService;
  public static getInstance(): ExperienceService {
    if (!ExperienceService.instance) {
      ExperienceService.instance = new ExperienceService(
        TrainerService.getInstance(),
        MoveLearningService.getInstance()
      );
    }
    return ExperienceService.instance;
  }

  constructor(
    protected trainerService: TrainerService,
    protected moveLearningService: MoveLearningService
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
    let trainer = await this.trainerService.getComplete(trainerId);
    const xpAndLevelGain: { xp: number; level: number }[] = [];
    const pokemonPromise = trainer.pokemons
      .filter((pokemon) => pokemon.level !== 0)
      .map(async (pokemon) => {
        const res = await this.mapPokemonXp(
          pokemon,
          trainer.trainingCamp.level
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
          trainer.trainingCamp.level
        );
        if (res?.evolutions) {
          evolutions.push(res.evolutions);
        }
        return storage;
      });
    await Promise.all(pokemonPromise);
    await Promise.all(storagePromise);
    const updateTrainer = { ...(trainer as any)._doc } as ITrainer;
    await this.trainerService.update(updateTrainer._id, updateTrainer);
    return { trainer, xpAndLevelGain, evolutions };
  }

  public async mapPokemonXp(
    pokemon: IPokemon,
    trainingCampLevel: number
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
    let result = this.updateLevelAndXp(pokemon, trainingCampLevel);
    pokemon = result.pokemon;
    const levelUp = result.variation > 0;
    if (levelUp) {
      if (pokemon.level > pokemon.maxLevel) {
        pokemon.maxLevel = pokemon.level;
        await this.moveLearningService.newMoveLearned(pokemon);
      }
      const evolution = await evolutionService.evolve(
        pokemon.basePokemon.id,
        pokemon.level,
        "LEVEL-UP"
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
    trainingCampLevel: number
  ): { pokemon: IPokemon; variation: number; xpGain: number } {
    const xpGain = this.getXp(pokemon, trainingCampLevel);
    pokemon.exp += xpGain;
    const result = this.getLevel(pokemon.level, pokemon.exp);
    pokemon.level = result.level;
    pokemon.exp = result.exp;
    pokemon.trainingPourcentage = 0;
    return { pokemon, variation: result.variation, xpGain };
  }

  public getXp(pokemon: IPokemon, lvlTrainingCamp: number): number {
    const gainXp =
      (0.1 + 0.9 * pokemon.trainingPourcentage) *
        lvlTrainingCamp *
        50 *
        (pokemon.potential - pokemon.level) -
      Math.pow((pokemon.level * pokemon.age * 7) / 5000, 2);
    return Math.floor(
      normalRandomUtils.normalRandom(7 * gainXp, lvlTrainingCamp * 500)
    );
  }

  public getLevel(
    level: number,
    exp: number
  ): { level: number; exp: number; variation: number } {
    let variation = 0;
    while (exp > XP_PER_LEVEL) {
      exp -= XP_PER_LEVEL;
      level++;
      if (level > 100) {
        level = 100;
        exp = XP_PER_LEVEL;
      } else {
        variation++;
      }
    }
    while (exp < 0) {
      level--;
      exp += XP_PER_LEVEL;
      if (level < 0) {
        level = 0;
        exp = 0;
      } else {
        variation++;
      }
    }
    return { level, exp, variation };
  }
}

export default ExperienceService;
