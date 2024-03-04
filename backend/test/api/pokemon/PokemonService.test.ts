import PokemonService from "../../../api/pokemon/PokemonService";
import { IPokemonStats } from "../../../models/PokemonModels/pokemonStats";

describe("PokemonService", () => {
  let pokemonService: PokemonService;

  beforeEach(() => {
    pokemonService = PokemonService.getInstance();
  });

  describe("generateIvs", () => {
    it("should correctly generate a pokemonStats object with random values", () => {
      const pokemonStats: IPokemonStats = pokemonService.generateIvs();

      const statsNames: (keyof IPokemonStats)[] = [
        "hp",
        "atk",
        "def",
        "spAtk",
        "spDef",
        "spe",
      ];

      statsNames.forEach((stat) => {
        expect(pokemonStats[stat]).toBeGreaterThanOrEqual(0);
        expect(pokemonStats[stat]).toBeLessThanOrEqual(31);
      });
    });
  });
});
