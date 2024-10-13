import BattleSideEffectService from "./BattleSideEffectService";
import { IBattlePokemon, IDamage } from "./BattleInterfaces";
import { SideEffect } from "../../domain/move/Move";

describe("BattleSideEffectService", () => {
  let service: BattleSideEffectService;

  beforeEach(() => {
    service = new BattleSideEffectService();
  });

  describe("drain method", () => {
    it("should correctly drain health from the defending Pokemon and heal the attacking Pokemon", () => {
      const attPokemon: IBattlePokemon = {
        currentHp: 50,
        stats: { hp: 100 },
      } as IBattlePokemon;
      const damage: IDamage = {
        damage: 40,
      } as IDamage;

      const value = 50; // 50% drain
      service.SIDE_EFFECT_MAP[SideEffect.DRAIN](
        value,
        attPokemon,
        null,
        damage,
      );

      expect(attPokemon.currentHp).toBe(70);
    });

    it("should not heal beyond the max HP", () => {
      const attPokemon: IBattlePokemon = {
        currentHp: 90,
        stats: { hp: 100 },
      } as IBattlePokemon;
      const damage: IDamage = {
        damage: 40,
      } as IDamage;

      const value = 50; // 50% drain
      service.SIDE_EFFECT_MAP[SideEffect.DRAIN](
        value,
        attPokemon,
        null,
        damage,
      );

      expect(attPokemon.currentHp).toBe(100); // HP should be capped at max HP (100)
    });

    it("should not allow HP to drop below 0", () => {
      const attPokemon: IBattlePokemon = {
        currentHp: 10,
        stats: { hp: 100 },
      } as IBattlePokemon;
      const damage: IDamage = {
        damage: 40,
      } as IDamage;

      const value = -50; // 50% drain
      service.SIDE_EFFECT_MAP[SideEffect.DRAIN](
        value,
        attPokemon,
        null,
        damage,
      );

      expect(attPokemon.currentHp).toBe(0); // HP should not be negative
    });
  });

  describe("reload method", () => {
    it("should set the reload value of the attacking Pokemon", () => {
      const attPokemon: IBattlePokemon = {
        reload: 0,
      } as IBattlePokemon;

      const value = 1;
      service.SIDE_EFFECT_MAP[SideEffect.RELOAD](value, attPokemon, null, null);

      expect(attPokemon.reload).toBe(1);
    });
  });
});
