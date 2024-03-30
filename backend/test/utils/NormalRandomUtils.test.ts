import { normalRandom } from "../../utils/normalRandomUtils";
describe("normalRandom function", () => {
  test("should return a random value between -1 and 1 when called without parameters", () => {
    const value = normalRandom();
    expect(value).toBeLessThanOrEqual(1);
    expect(value).toBeGreaterThanOrEqual(-1);
  });

  test("should return a random value around 5 when mean=5 and stdDev=2", () => {
    let sum = 0;

    for (let i = 0; i < 1000; i++) {
      sum += normalRandom(5, 2);
    }

    const average = sum / 1000;
    expect(average).toBeCloseTo(5, 0);
  });
});
