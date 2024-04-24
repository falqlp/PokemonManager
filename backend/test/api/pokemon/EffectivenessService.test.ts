import EffectivenessService from "../../../application/pokemon/EffectivenessService";
import { PokemonType } from "../../../models/Types/Types";
import { container } from "tsyringe";

describe("EffectivenessService", () => {
  let service: EffectivenessService;

  beforeAll(() => {
    service = container.resolve(EffectivenessService);
  });

  it("should correctly calculate water effectiveness", () => {
    const types = [PokemonType.WATER];
    const effectiveness = service.calculateEffectiveness(types);
    expect(effectiveness.FIRE).toBe(0.5);
    expect(effectiveness.WATER).toBe(0.5);
    expect(effectiveness.NORMAL).toBe(1);
    expect(effectiveness.ELECTRIC).toBe(2);
    expect(effectiveness.GRASS).toBe(2);
    expect(effectiveness.FIGHTING).toBe(1);
    expect(effectiveness.POISON).toBe(1);
    expect(effectiveness.GROUND).toBe(1);
    expect(effectiveness.FLYING).toBe(1);
    expect(effectiveness.PSY).toBe(1);
    expect(effectiveness.BUG).toBe(1);
    expect(effectiveness.ROCK).toBe(1);
    expect(effectiveness.GHOST).toBe(1);
    expect(effectiveness.DRAGON).toBe(1);
    expect(effectiveness.DARK).toBe(1);
    expect(effectiveness.STEEL).toBe(0.5);
    expect(effectiveness.FAIRY).toBe(1);
  });

  it("should correctly calculate ground effectiveness", () => {
    const types = [PokemonType.GROUND];
    const effectiveness = service.calculateEffectiveness(types);
    expect(effectiveness.FIRE).toBe(1);
    expect(effectiveness.WATER).toBe(2);
    expect(effectiveness.NORMAL).toBe(1);
    expect(effectiveness.ELECTRIC).toBe(0);
    expect(effectiveness.GRASS).toBe(2);
    expect(effectiveness.FIGHTING).toBe(1);
    expect(effectiveness.POISON).toBe(0.5);
    expect(effectiveness.GROUND).toBe(1);
    expect(effectiveness.FLYING).toBe(1);
    expect(effectiveness.PSY).toBe(1);
    expect(effectiveness.BUG).toBe(1);
    expect(effectiveness.ROCK).toBe(0.5);
    expect(effectiveness.GHOST).toBe(1);
    expect(effectiveness.DRAGON).toBe(1);
    expect(effectiveness.DARK).toBe(1);
    expect(effectiveness.STEEL).toBe(1);
    expect(effectiveness.FAIRY).toBe(1);
  });
});
