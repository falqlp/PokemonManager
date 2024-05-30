import { BattleDataService } from "./BattleDataService";
import {
  IBattlePokemon,
  IBattleState,
  IBattleTrainer,
  IDamage,
} from "./BattleInterfaces";
import { container } from "tsyringe";
import BattleTrainerTestMother from "../../test/domain/battle/BattleTrainerTestMother";

describe("BattleDataService", () => {
  let service: BattleDataService;
  let mockBattleState: IBattleState;

  beforeEach(() => {
    service = container.resolve(BattleDataService);
    mockBattleState = {
      player: {} as IBattleTrainer,
      opponent: {} as IBattleTrainer,
      battleOrder: [{}] as IBattlePokemon[],
      damage: {} as IDamage,
    };
  });

  describe("getBattleState", () => {
    it("should return undefined if no state for the key", () => {
      expect(service.getBattleState("non-existing-key")).toBeUndefined();
    });

    it("should return the battle state for the key", () => {
      const key = "existing-key";
      service.setBattleState(key, mockBattleState);
      expect(service.getBattleState(key)).toBe(mockBattleState);
    });
  });

  // Testing the setBattleState Method
  describe("setBattleState", () => {
    it("should set the state for a new key and get the same state", () => {
      const key = "new-key";
      service.setBattleState(key, mockBattleState);
      expect(service.getBattleState(key)).toEqual(mockBattleState);
    });

    it("should update the state for an existing key and get the updated state", () => {
      const key = "existing-key";
      const newState = {
        ...mockBattleState,
        player: BattleTrainerTestMother.getBattleTrainer(),
      };
      service.setBattleState(key, newState);
      expect(service.getBattleState(key)).toEqual(newState);
    });
  });
  describe("delete", () => {
    it("should delete the state for a key", () => {
      const key = "existing-key";
      service.setBattleState(key, mockBattleState);
      expect(service.getBattleState(key)).toEqual(mockBattleState);
      service.delete(key);
      expect(service.getBattleState(key)).toBeUndefined();
    });

    it("should not fail when deleting a state for a non-existing key", () => {
      const key = "non-existing-key";
      expect(() => service.delete(key)).not.toThrow();
    });
  });
});
