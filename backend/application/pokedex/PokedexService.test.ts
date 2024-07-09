import { container } from "tsyringe";
import MoveLearningService from "../moveLearning/MoveLearningService";
import EvolutionRepository from "../../domain/evolution/EvolutionRepository";
import { PokedexService } from "./PokedexService";
import PokemonBaseRepository from "../../domain/pokemon/pokemonBase/PokemonBaseRepository";
import { PokemonBaseTestMother } from "../../test/domain/PokemonBase/PokemonBaseTestMother";
import { IEvolution } from "../../domain/evolution/Evolution";
import MoveRepository from "../../domain/move/MoveRepository";
import { IMove } from "../../domain/move/Move";
import { MoveTestMother } from "../../test/domain/Move/MoveTestMother";
import { IMoveLearning } from "../../domain/moveLearning/MoveLearning";

describe("PokedexService", () => {
  let pokemonBaseRepository: PokemonBaseRepository;
  let moveLearningService: MoveLearningService;
  let moveService: MoveRepository;
  let evolutionRepository: EvolutionRepository;
  let pokedexService: PokedexService;

  beforeEach(() => {
    pokemonBaseRepository = container.resolve(PokemonBaseRepository);
    moveLearningService = container.resolve(MoveLearningService);
    moveService = container.resolve(MoveRepository);
    evolutionRepository = container.resolve(EvolutionRepository);
    pokedexService = container.resolve(PokedexService);
  });

  describe("getPokemonDetails", () => {
    beforeEach(() => {
      jest.spyOn(pokemonBaseRepository, "getPokemonBaseById");
    });
    it("Should return the pokemon details with evolutions, evolutionOf, pokemonBase and movesLearned", async () => {
      jest
        .spyOn(pokemonBaseRepository, "getPokemonBaseById")
        .mockImplementation((id) =>
          Promise.resolve(PokemonBaseTestMother.generateBulbasaurBase()),
        );
      jest
        .spyOn(evolutionRepository, "hasEvolution")
        .mockImplementation((id) => Promise.resolve([]));
      jest
        .spyOn(evolutionRepository, "isEvolution")
        .mockImplementation((id) => Promise.resolve(null));
      jest
        .spyOn(moveLearningService, "getMovesOfAllEvolutions")
        .mockImplementation((id) => Promise.resolve([]));

      const pokemonId = 1;
      const result = await pokedexService.getPokemonDetails(pokemonId);

      expect(result).toEqual(
        expect.objectContaining({
          evolutions: expect.any(Array),
          evolutionOf: expect.any(Array),
          pokemonBase: expect.objectContaining({ id: pokemonId }),
          movesLearned: expect.any(Array),
        }),
      );
      expect(pokemonBaseRepository.getPokemonBaseById).toHaveBeenCalledWith(
        pokemonId,
      );
      expect(evolutionRepository.hasEvolution).toHaveBeenCalledWith(pokemonId);
      expect(evolutionRepository.isEvolution).toHaveBeenCalledWith(pokemonId);
      expect(moveLearningService.getMovesOfAllEvolutions).toHaveBeenCalledWith(
        pokemonId,
        100,
      );
    });
  });
  describe("getEvolutions", () => {
    it("should return the evolutions of the pokemon", async () => {
      const pokemonId = 1;
      const pokemonBase = PokemonBaseTestMother.generateBulbasaurBase();

      const evolution: IEvolution = {
        pokemonId,
        evolveTo: 2,
        evolutionMethod: "level-up",
        minLevel: 16,
      };

      jest
        .spyOn(evolutionRepository, "hasEvolution")
        .mockImplementation((id) => Promise.resolve([evolution]));
      jest
        .spyOn(pokemonBaseRepository, "getPokemonBaseById")
        .mockImplementation((id) => Promise.resolve(pokemonBase));

      const result = await pokedexService.getEvolutions(pokemonId);

      expect(result).toEqual([
        {
          evolutionMethod: "level-up",
          minLevel: 16,
          pokemon: pokemonBase,
        },
        {
          evolutionMethod: "level-up",
          minLevel: 16,
          pokemon: pokemonBase,
        },
      ]);
      expect(pokemonBaseRepository.getPokemonBaseById).toHaveBeenCalledTimes(2);
      expect(evolutionRepository.hasEvolution).toHaveBeenCalledTimes(2);
      expect(evolutionRepository.hasEvolution).toHaveBeenCalledWith(pokemonId);
    });
  });
  describe("getEvolutionOf", () => {
    it("should return the evolved forms of the pokemon", async () => {
      const pokemonId = 1;
      const pokemonBase = PokemonBaseTestMother.generateBulbasaurBase();

      const evolution: IEvolution = {
        pokemonId,
        evolutionMethod: "level-up",
        minLevel: 16,
        evolveTo: 1,
      };

      jest
        .spyOn(evolutionRepository, "isEvolution")
        .mockImplementation((id) => Promise.resolve(evolution));
      jest
        .spyOn(pokemonBaseRepository, "getPokemonBaseById")
        .mockImplementation((id) => Promise.resolve(pokemonBase));

      const result = await pokedexService.getEvolutionOf(pokemonId);

      const expected = [
        {
          pokemon: pokemonBase,
          evolutionMethod: "level-up",
          minLevel: 16,
        },
        {
          pokemon: pokemonBase,
          evolutionMethod: "level-up",
          minLevel: 16,
        },
      ];

      expect(result).toEqual(expected);
      expect(evolutionRepository.isEvolution).toHaveBeenCalledWith(pokemonId);
      expect(pokemonBaseRepository.getPokemonBaseById).toHaveBeenCalledWith(
        evolution.evolveTo,
      );
    });
  });
  describe("getMovesLearned", () => {
    it("should return a list of moves learned by a Pokemon, sorted by level needed to learn", async () => {
      const pokemonId = 1;

      const moveLearning: IMoveLearning = {
        moveId: 1,
        levelLearnAt: 5,
        learnMethod: "level-up",
      };

      const move: IMove = {
        id: 1,
        power: 10,
        category: "physical",
        name: "Tackle",
        type: "Normal",
      };

      jest
        .spyOn(moveLearningService, "getMovesOfAllEvolutions")
        .mockImplementation((id, level) => Promise.resolve([moveLearning]));
      jest
        .spyOn(moveService, "get")
        .mockImplementation((id) => Promise.resolve(move));

      const result = await pokedexService.getMovesLearned(pokemonId);

      const expected: IPokedexMoveLearned = {
        move,
        levelLearnAt: moveLearning.levelLearnAt,
        learnMethod: moveLearning.learnMethod,
      };

      expect(result).toEqual([expected]);
      expect(moveLearningService.getMovesOfAllEvolutions).toHaveBeenCalledWith(
        pokemonId,
        100,
      );
      expect(moveService.get).toHaveBeenCalledWith(moveLearning.moveId);
    });

    it("should not return a move if power is 0 or less", async () => {
      const pokemonId = 1;

      const moveLearning: IMoveLearning = {
        moveId: "1",
        levelLearnAt: 5,
        learnMethod: "level-up",
        pokemonId,
      };

      const move: IMove = MoveTestMother.basicMove();

      jest
        .spyOn(moveLearningService, "getMovesOfAllEvolutions")
        .mockImplementation(() => Promise.resolve([moveLearning]));
      jest
        .spyOn(moveService, "get")
        .mockImplementation(() => Promise.resolve(move));

      const result = await pokedexService.getMovesLearned(pokemonId);

      expect(result).toEqual([]);
      expect(moveLearningService.getMovesOfAllEvolutions).toHaveBeenCalledWith(
        pokemonId,
        100,
      );
      expect(moveService.get).toHaveBeenCalledWith(moveLearning.moveId);
    });
  });
});
