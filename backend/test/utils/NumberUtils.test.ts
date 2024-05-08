import { isPowerOfTwo } from "../../utils/NumberUtils";

describe("isPowerOfTwo", () => {
  test("will return false for non power of two numbers", () => {
    const numbers = [3, 5, 6, 7, 9, 0, -1, -2];

    for (const number of numbers) {
      expect(isPowerOfTwo(number)).toBeFalsy();
    }
  });

  test("will return true for power of two numbers", () => {
    const powerOfTwoNumbers = [1, 2, 4, 8, 16, 32];

    for (const powerOfTwoNumber of powerOfTwoNumbers) {
      expect(isPowerOfTwo(powerOfTwoNumber)).toBeTruthy();
    }
  });
});
