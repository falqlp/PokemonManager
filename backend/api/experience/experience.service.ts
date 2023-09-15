import TrainerService from "../trainer/trainer.service";
import { IPokemon } from "../pokemon/pokemon";
import { ITrainer } from "../trainer/trainer";
import normalRandomUtils from "../../utils/normalRandomUtils";

const XP_PER_LEVEL = 100000;

class ExperienceService {
  private static instance: ExperienceService;
  public static getInstance(): ExperienceService {
    if (!ExperienceService.instance) {
      ExperienceService.instance = new ExperienceService(
        TrainerService.getInstance()
      );
    }
    return ExperienceService.instance;
  }

  constructor(protected trainerService: TrainerService) {}
  public async weeklyXpGain(trainerId: string): Promise<{
    trainer: ITrainer;
    xpAndLevelGain: { xp: number; level: number }[];
  }> {
    let trainer = await this.trainerService.getComplete(trainerId);
    const xpAndLevelGain: { xp: number; level: number }[] = [];
    trainer.pokemons.forEach((pokemon) => {
      const xpGain = this.getXp(pokemon, trainer.trainingCamp.level);
      pokemon.exp += xpGain;
      const result = this.getLevel(pokemon.level, pokemon.exp);
      pokemon.level = result.level;
      pokemon.exp = result.exp;
      pokemon.trainingPourcentage = 0;
      xpAndLevelGain.push({ level: result.variation, xp: xpGain });
    });
    trainer.pcStorage.storage.forEach((storage) => {
      storage.pokemon.exp = this.getXp(
        storage.pokemon,
        trainer.trainingCamp.level
      );
      const result = this.getLevel(storage.pokemon.level, storage.pokemon.exp);
      storage.pokemon.level = result.level;
      storage.pokemon.exp = result.exp;
      storage.pokemon.trainingPourcentage = 0;
    });
    trainer = await this.trainerService.update(trainer._id, trainer);
    return { trainer, xpAndLevelGain };
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
