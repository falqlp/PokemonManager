import EffectivenessService from "../../../api/pokemon/EffectivenessService";

describe("EffectivenessService", () => {
  let service: EffectivenessService;

  beforeAll(() => {
    service = EffectivenessService.getInstance();
  });

  it("should correctly calculate effectiveness", () => {
    const types = ["WATER"];
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
});
