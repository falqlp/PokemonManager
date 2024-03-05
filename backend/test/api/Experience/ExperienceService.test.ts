import ExperienceService from "../../../api/experience/ExperienceService";
import { IPokemon } from "../../../api/pokemon/Pokemon";
import { PokemonTestMother } from "../pokemon/PokemonTestMother";

describe("ExperienceService", () => {
  let experienceService: ExperienceService;
  let pokemon: IPokemon;

  beforeEach(() => {
    experienceService = ExperienceService.getInstance();
  });

  describe("getXp", () => {
    beforeEach(() => {
      pokemon = PokemonTestMother.generateBulbasaur();
    });

    it("should return the correctly calculated experience points for a provided pokemon", () => {
      const xp = experienceService.getXp(pokemon, 1);
      expect(xp).toBeDefined();
      expect(xp).not.toBeNaN();
    });
  });

  describe("getLevel", () => {
    it("should return increased level when positive experience is provided", () => {
      const initialLevel = 1;
      const initialExp = 1000000;
      const result = experienceService.getLevel(initialLevel, initialExp);

      expect(result.level).toBeGreaterThan(initialLevel);
      expect(result.exp).toBeLessThan(initialExp);
      expect(result.variation).toBeGreaterThan(0);
    });

    it("should return decreased level when negative experience is provided", () => {
      const initialLevel = 50;
      const initialExp = -1000000;
      const result = experienceService.getLevel(initialLevel, initialExp);

      expect(result.level).toBeLessThan(initialLevel);
      expect(result.exp).toBeGreaterThanOrEqual(0);
      expect(result.variation).toBeGreaterThan(0);
    });

    it("should never return level more than 100 even with absurd experience", () => {
      const initialLevel = 90;
      const initialExp = 1e9;
      const result = experienceService.getLevel(initialLevel, initialExp);

      expect(result.level).toEqual(100);
      expect(result.exp).toBeLessThan(initialExp);
    });

    it("should never return level less than zero even with absurd negative experience", () => {
      const initialLevel = 10;
      const initialExp = -1e9;
      const result = experienceService.getLevel(initialLevel, initialExp);

      expect(result.level).toEqual(0);
      expect(result.exp).toEqual(0);
    });
  });
  describe("updateLevelAndXp", () => {
    it("should update the level and experience of a Pokémon", () => {
      const pokemon = PokemonTestMother.generateBulbasaur() as IPokemon;
      jest.spyOn(experienceService, "getXp").mockReturnValue(10);
      jest.spyOn(experienceService, "getLevel").mockReturnValue({
        level: pokemon.level,
        exp: pokemon.exp,
        variation: 0,
      });
      const result = experienceService.updateLevelAndXp(pokemon, 10);

      expect(result).toHaveProperty("pokemon");
      expect(result).toHaveProperty("variation");

      expect(result).toHaveProperty("xpGain");

      expect(experienceService.getXp).toHaveBeenCalledWith(pokemon, 10);
      expect(experienceService.getLevel).toHaveBeenCalledWith(
        pokemon.level,
        pokemon.exp + 10
      );
    });
  });
});
