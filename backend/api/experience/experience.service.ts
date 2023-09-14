import TrainerService from "../trainer/trainer.service";
import { IPokemon } from "../pokemon/pokemon";

const xpPerLevel = 100000;

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
  public async weeklyXpGain(trainerId: string): Promise<void> {
    const trainer = await this.trainerService.get(trainerId);
    const allPokemon = trainer.pokemons.concat(
      trainer.pcStorage.storage.map((storage) => storage.pokemon)
    );
    allPokemon.map((pokemon) => {
      pokemon.exp = this.getXp(pokemon, trainer.trainingCamp.level);
      const result = this.getLevel(pokemon.exp, pokemon.level);
      pokemon.level = result.level;
      pokemon.exp = result.exp;
      return pokemon;
    });
  }

  public getXp(pokemon: IPokemon, lvlTrainingCamp: number): number {
    const gainXp =
      (0.1 + 0.9 * pokemon.trainingPourcentage) *
        lvlTrainingCamp *
        50 *
        (pokemon.potential - pokemon.level) -
      Math.pow((pokemon.level * pokemon.age) / 5000, 2) / 7;
    return pokemon.exp + this.normalRandom(gainXp);
  }

  public getLevel(level: number, exp: number): { level: number; exp: number } {
    while (exp > xpPerLevel) {
      exp = -xpPerLevel;
      level++;
    }
    while (exp < 0) {
      level--;
      exp += xpPerLevel;
    }
    return { exp, level };
  }

  protected boxMullerRandom(): [number, number] {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    let num2 = Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v);
    return [num, num2];
  }

  public normalRandom(mean: number = 0, stdDev: number = 1): number {
    const [z] = this.boxMullerRandom();
    return z * stdDev + mean;
  }
}
