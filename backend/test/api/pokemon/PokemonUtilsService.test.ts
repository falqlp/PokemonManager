import PokemonUtilsService from "../../../application/pokemon/PokemonUtilsService";
import { mocked } from "jest-mock";
import { IPokemonStats } from "../../../models/PokemonModels/pokemonStats";
import { IPokemon } from "../../../domain/pokemon/Pokemon";
import { PokemonTestMother } from "./PokemonTestMother";
import { StatsTestMother } from "../Stats/StatsTestMother";
import { normalRandom } from "../../../utils/RandomUtils";

jest.mock("../../../utils/RandomUtils");

describe("PokemonUtilsService", () => {
  let service: PokemonUtilsService;

  beforeEach(() => {
    service = PokemonUtilsService.getInstance();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("generatePotential method", () => {
    it("should generate a potential correctly for nursery level 0", () => {
      mocked(normalRandom).mockReturnValueOnce(0);
      const result = service.generatePotential(0);
      expect(result).toBe(10);
    });

    it("should not exceed 100 when the generated potential is more than 100", () => {
      mocked(normalRandom).mockReturnValueOnce(1000);
      const result = service.generatePotential(8);
      expect(result).toBe(100);
    });
  });
  describe("generateIvs", () => {
    it("should correctly generate a pokemonStats object with random values", () => {
      const pokemonStats: IPokemonStats = service.generateIvs();

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
  describe("generateHiddenPotential method", () => {
    it("returns potential range in string format", () => {
      const potential = 50;
      const pattern = /^\d{1,3}\s*-\s*\d{1,3}$/;
      expect(service.generateHiddenPotential(potential)).toMatch(pattern);
    });

    describe.each([0, 10, 50, 100])(
      "potential is between 0 and 100",
      (potential) => {
        it(`test for potential: ${potential}`, () => {
          const result = service.generateHiddenPotential(potential);
          const [pMin, pMax] = result.split("-").map(Number);
          expect(pMin).toBeGreaterThanOrEqual(0);
          expect(pMax).toBeLessThanOrEqual(100);
          expect(pMin).toBeLessThanOrEqual(pMax);
        });
      },
    );
  });

  describe("updateStats", () => {
    const pokemonUtilsService = PokemonUtilsService.getInstance();
    let mockPokemon: IPokemon;

    beforeEach(() => {
      mockPokemon = PokemonTestMother.withCustomOptions({
        stats: StatsTestMother.getAll0(),
      });
    });

    it("should correctly update Pokemon stats when level is not 0", () => {
      const {
        basePokemon: { baseStats },
        iv,
        ev,
      } = mockPokemon;

      const stats = pokemonUtilsService.updateStats(mockPokemon);

      expect(stats).toEqual({
        hp: pokemonUtilsService.calcHp(
          baseStats.hp,
          mockPokemon.level,
          iv.hp,
          ev.hp,
        ),
        atk: pokemonUtilsService.calcStat(
          baseStats.atk,
          mockPokemon.level,
          iv.atk,
          ev.atk,
        ),
        def: pokemonUtilsService.calcStat(
          baseStats.def,
          mockPokemon.level,
          iv.def,
          ev.def,
        ),
        spAtk: pokemonUtilsService.calcStat(
          baseStats.spAtk,
          mockPokemon.level,
          iv.spAtk,
          ev.spAtk,
        ),
        spDef: pokemonUtilsService.calcStat(
          baseStats.spDef,
          mockPokemon.level,
          iv.spDef,
          ev.spDef,
        ),
        spe: pokemonUtilsService.calcStat(
          baseStats.spe,
          mockPokemon.level,
          iv.spe,
          ev.spe,
        ),
      });
    });

    it("should return stats as 0 if level is 0", () => {
      mockPokemon.level = 0;

      const allStats0 = pokemonUtilsService.updateStats(mockPokemon);

      expect(allStats0).toEqual({
        hp: 0,
        atk: 0,
        def: 0,
        spAtk: 0,
        spDef: 0,
        spe: 0,
      });
    });
  });
  describe("calculateAge method", () => {
    it("should correctly calculate age when today's date is same as birthdate", () => {
      const currentYear = new Date().getFullYear();
      const birthday = new Date(currentYear, 5, 15);
      const today = new Date(currentYear, 5, 15);

      const result = service.calculateAge(birthday, today);

      expect(result).toEqual(0);
    });

    it("should correctly calculate age when todays date is later in the year than birthdate", () => {
      const currentYear = new Date().getFullYear();
      const birthday = new Date(currentYear - 25, 5, 15);
      const today = new Date(currentYear, 8, 15);

      const result = service.calculateAge(birthday, today);

      expect(result).toEqual(25);
    });

    it("should correctly calculate age when todays date is earlier in the year than birthdate", () => {
      const currentYear = new Date().getFullYear();
      const birthday = new Date(currentYear - 25, 8, 15);
      const today = new Date(currentYear, 5, 15);

      const result = service.calculateAge(birthday, today);

      expect(result).toEqual(24);
    });

    it("should correctly calculate age when todays date is the same month but later date than birthdate", () => {
      const currentYear = new Date().getFullYear();
      const birthday = new Date(currentYear - 25, 5, 15);
      const today = new Date(currentYear, 5, 20);

      const result = service.calculateAge(birthday, today);

      expect(result).toEqual(25);
    });

    it("should correctly calculate age when todays date is the same month but earlier date than birthdate", () => {
      const currentYear = new Date().getFullYear();
      const birthday = new Date(currentYear - 25, 5, 20);
      const today = new Date(currentYear, 5, 15);

      const result = service.calculateAge(birthday, today);

      expect(result).toEqual(24);
    });
  });
  describe("generateShiny method", () => {
    it("should return a boolean value", () => {
      const shiny = service.generateShiny();
      expect(typeof shiny).toBe("boolean");
    });

    it("should return true approximately 1/4096 of the time", () => {
      let shinyCounter = 0;
      const trials = 10_000_000;
      for (let i = 0; i < trials; i++) {
        if (service.generateShiny()) {
          shinyCounter += 1;
        }
      }
      const shinyRate = shinyCounter / trials;
      expect(shinyRate).toBeCloseTo(1 / 4096, 2); // "2" is the number of decimal places
    });
  });
});
