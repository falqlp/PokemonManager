import { normalRandom } from "../../utils/normalRandomUtils";
describe("normalRandom function", () => {
  test("should return a random value without parameters", () => {
    const value = normalRandom();
    expect(value).not.toBeNull();
    expect(value).not.toBeNaN();
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
