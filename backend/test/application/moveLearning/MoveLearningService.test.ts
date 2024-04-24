import MoveLearningService from "../../../application/moveLearning/MoveLearningService";
import { IMoveLearning } from "../../../domain/moveLearning/MoveLearning";
import { container } from "tsyringe";

describe("MoveLearningService", () => {
  let moveLearningService: MoveLearningService;
  let list1: IMoveLearning[];
  let list2: IMoveLearning[];

  beforeEach(() => {
    moveLearningService = container.resolve(MoveLearningService);

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

  describe("mergeAndOverwrite", () => {
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
});
