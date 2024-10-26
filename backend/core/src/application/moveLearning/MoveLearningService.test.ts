import MoveLearningService from "./MoveLearningService";
import { IMoveLearning } from "../../domain/moveLearning/MoveLearning";
import { container } from "tsyringe";
import MoveRepository from "../../domain/move/MoveRepository";
import { MoveTestMother } from "../../test/domain/Move/MoveTestMother";
import MoveLearningRepository from "../../domain/moveLearning/MoveLearningRepository";
import EvolutionRepository from "../../domain/evolution/EvolutionRepository";

describe("MoveLearningService", () => {
  let moveLearningService: MoveLearningService;
  let moveRepository: MoveRepository;
  let moveLearningRepository: MoveLearningRepository;
  let evolutionRepository: EvolutionRepository;

  beforeEach(() => {
    moveLearningService = container.resolve(MoveLearningService);
    moveRepository = container.resolve(MoveRepository);
    moveLearningRepository = container.resolve(MoveLearningRepository);
    evolutionRepository = container.resolve(EvolutionRepository);
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe("mergeAndOverwrite", () => {
    let list1: IMoveLearning[];
    let list2: IMoveLearning[];
    beforeEach(() => {
      list1 = [
        {
          learnMethod: "method1",
          levelLearnAt: 1,
          pokemonId: 1,
          moveId: "move1",
        } as IMoveLearning,
        {
          learnMethod: "method2",
          levelLearnAt: 2,
          pokemonId: 2,
          moveId: "move2",
        } as IMoveLearning,
      ];

      list2 = [
        {
          learnMethod: "method1",
          levelLearnAt: 1,
          pokemonId: 1,
          moveId: "move1",
        } as IMoveLearning,
        {
          learnMethod: "method3",
          levelLearnAt: 3,
          pokemonId: 3,
          moveId: "move3",
        } as IMoveLearning,
      ];
    });
    it("should merge and overwrite the lists", () => {
      const result = moveLearningService.mergeAndOverwrite(list1, list2);
      expect(result.length).toBe(3);
      expect(result).toContainEqual({
        learnMethod: "method1",
        levelLearnAt: 1,
        pokemonId: 1,
        moveId: "move1",
      } as IMoveLearning);
      expect(result).toContainEqual({
        learnMethod: "method2",
        levelLearnAt: 2,
        pokemonId: 2,
        moveId: "move2",
      } as IMoveLearning);
      expect(result).toContainEqual({
        learnMethod: "method3",
        levelLearnAt: 3,
        pokemonId: 3,
        moveId: "move3",
      } as IMoveLearning);
    });
  });
  describe("learnableMoves", () => {
    let getMovesOfAllEvolutionsSpy: jest.SpyInstance;
    beforeEach(() => {
      getMovesOfAllEvolutionsSpy = jest.spyOn(
        moveLearningService,
        "getMovesOfAllEvolutions",
      );
    });
    it("should return filtered moves based on power", async () => {
      const id = 1;
      const level = 10;
      const query = { sort: { power: -1 } };

      const allMoves = [
        MoveTestMother.withCustomOptions({ power: 40, id: 1, _id: "1" }),
        MoveTestMother.withCustomOptions({ power: 50, id: 2, _id: "2" }),
        MoveTestMother.withCustomOptions({ power: 0, id: 3, _id: "3" }),
      ];

      const allMovesLearnings: IMoveLearning[] = [
        {
          learnMethod: "level-up",
          levelLearnAt: 1,
          pokemonId: id,
          moveId: "1",
        },
        {
          learnMethod: "level-up",
          levelLearnAt: 1,
          pokemonId: id,
          moveId: "2",
        },
        {
          learnMethod: "level-up",
          levelLearnAt: 1,
          pokemonId: id,
          moveId: "3",
        },
      ];
      getMovesOfAllEvolutionsSpy.mockResolvedValue(allMovesLearnings);
      jest.spyOn(moveRepository, "list").mockResolvedValue(allMoves);

      const result = await moveLearningService.learnableMoves(id, level, query);

      expect(getMovesOfAllEvolutionsSpy).toHaveBeenCalledWith(id, level);
      expect(moveRepository.list).toHaveBeenCalledWith({
        ...query,
        ids: ["1", "2", "3"],
      });
      expect(result).toEqual([allMoves[0], allMoves[1]]);
    });

    it("should handle empty move list correctly", async () => {
      const id = 1;
      const level = 10;

      getMovesOfAllEvolutionsSpy.mockResolvedValue([]);

      jest.spyOn(moveRepository, "list").mockResolvedValue([]);

      const result = await moveLearningService.learnableMoves(id, level);

      expect(getMovesOfAllEvolutionsSpy).toHaveBeenCalledWith(id, level);
      expect(moveRepository.list).toHaveBeenCalledWith({ ids: [] });
      expect(result).toEqual([]);
    });
  });
  describe("getMovesOfAllEvolutions", () => {
    let getAllMoveAtLevelSpy: jest.SpyInstance;
    let isEvolutionSpy: jest.SpyInstance;
    beforeEach(() => {
      getAllMoveAtLevelSpy = jest.spyOn(
        moveLearningRepository,
        "getAllMoveAtLevel",
      );
      isEvolutionSpy = jest.spyOn(evolutionRepository, "isEvolution");
    });
    it("should return moves of all evolutions including recursive evolutions", async () => {
      const id = 1;
      const level = 10;
      const evolutionId = 2;
      const evolutionLevel = 15;

      const movesAtLevel: IMoveLearning[] = [
        {
          learnMethod: "level-up",
          levelLearnAt: 10,
          pokemonId: id,
          moveId: "move1",
        },
      ];

      const movesAtEvolutionLevel: IMoveLearning[] = [
        {
          learnMethod: "level-up",
          levelLearnAt: 16,
          pokemonId: evolutionId,
          moveId: "move2",
        },
      ];

      const movesAtPreviousEvolution: IMoveLearning[] = [
        {
          learnMethod: "level-up",
          levelLearnAt: 15,
          pokemonId: evolutionId,
          moveId: "move3",
        },
      ];

      getAllMoveAtLevelSpy
        .mockResolvedValueOnce(movesAtLevel)
        .mockResolvedValueOnce(movesAtEvolutionLevel)
        .mockResolvedValueOnce(movesAtPreviousEvolution);

      isEvolutionSpy
        .mockResolvedValueOnce({
          pokemonId: evolutionId,
          minLevel: evolutionLevel,
        })
        .mockResolvedValueOnce(null);

      const result = await moveLearningService.getMovesOfAllEvolutions(
        id,
        level,
      );

      expect(getAllMoveAtLevelSpy).toHaveBeenCalledWith(id, level);
      expect(getAllMoveAtLevelSpy).toHaveBeenCalledWith(
        evolutionId,
        evolutionLevel + 1,
      );
      expect(getAllMoveAtLevelSpy).toHaveBeenCalledWith(
        evolutionId,
        evolutionLevel,
      );
      expect(isEvolutionSpy).toHaveBeenCalledWith(id);

      expect(result).toEqual(
        expect.arrayContaining([
          {
            learnMethod: "level-up",
            levelLearnAt: 10,
            pokemonId: id,
            moveId: "move1",
          },
          {
            learnMethod: "level-up",
            levelLearnAt: 16,
            pokemonId: evolutionId,
            moveId: "move2",
          },
          {
            learnMethod: "level-up",
            levelLearnAt: 15,
            pokemonId: evolutionId,
            moveId: "move3",
          },
        ]),
      );
    });

    it("should return moves of the pokemon if there is no evolution", async () => {
      const id = 1;
      const level = 10;

      const movesAtLevel: IMoveLearning[] = [
        {
          learnMethod: "level-up",
          levelLearnAt: 10,
          pokemonId: id,
          moveId: "move1",
        },
      ];

      getAllMoveAtLevelSpy.mockResolvedValueOnce(movesAtLevel);
      isEvolutionSpy.mockResolvedValueOnce(null);

      const result = await moveLearningService.getMovesOfAllEvolutions(
        id,
        level,
      );

      expect(getAllMoveAtLevelSpy).toHaveBeenCalledWith(id, level);
      expect(isEvolutionSpy).toHaveBeenCalledWith(id);
      expect(result).toEqual(movesAtLevel);
    });
  });
});
