import { splitArray } from './ArrayUtils';

describe('splitArray function', () => {
  it('splits the array according to the defined rule', () => {
    const inputArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const output = splitArray(inputArray);
    expect(output).toEqual([
      [1, 2, 6, 7, 8, 12],
      [3, 4, 5, 9, 10, 11],
    ]);
  });
  it('works with an empty array', () => {
    const inputArray: number[] = [];
    const output = splitArray(inputArray);
    expect(output).toEqual([[], []]);
  });
  it('works with array of one element', () => {
    const inputArray = ['Test'];
    const output = splitArray(inputArray);
    expect(output).toEqual([['Test'], []]);
  });
});
