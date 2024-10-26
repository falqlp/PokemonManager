import {
  getRandomFromArray,
  normalRandom,
  sample,
  shuffleArray,
} from './RandomUtils';

describe('normalRandom function', () => {
  test('should return a random value without parameters', () => {
    const value = normalRandom();
    expect(value).not.toBeNull();
    expect(value).not.toBeNaN();
  });

  test('should return a random value around 5 when mean=5 and stdDev=2', () => {
    let sum = 0;

    for (let i = 0; i < 1000; i++) {
      sum += normalRandom(5, 2);
    }

    const average = sum / 1000;
    expect(average).toBeCloseTo(5, 0);
  });
});
describe('sample function', () => {
  const documents = ['doc1', 'doc2', 'doc3', 'doc4'];

  it('should return a random subset of specified size from the list', () => {
    const subset = sample(documents, 2);

    expect(subset.length).toBe(2);
  });

  it('should return an empty array when sample size is 0', () => {
    const subset = sample(documents, 0);

    expect(subset).toEqual([]);
  });

  it('should return a consistent subset for a given seed', () => {
    const subset1 = sample(documents, 2, 'abc123');
    const subset2 = sample(documents, 2, 'abc123');

    expect(subset1).toEqual(subset2);
  });
});

describe('Test shuffleArray function', () => {
  it('should return a shuffled array', () => {
    const inputArray: number[] = [1, 2, 3, 4, 5];
    const shuffledArray = [...inputArray];
    shuffleArray(shuffledArray);
    expect(shuffledArray.sort()).toEqual(inputArray);
  });

  it('should handle empty array', () => {
    const emptyArray: any[] = [];
    const shuffledEmptyArray = [...emptyArray];
    shuffleArray(shuffledEmptyArray);
    expect(shuffledEmptyArray.length).toBe(0);
  });

  it('should handle array with one element', () => {
    const singleElementArray: number[] = [1];
    const shuffledSingleElementArray = [...singleElementArray];
    shuffleArray(shuffledSingleElementArray);
    expect(shuffledSingleElementArray).toEqual(singleElementArray);
  });
});

describe('getRandomFromArray function', () => {
  it('should throw an error when an empty array is passed', () => {
    const emptyArray: never[] = [];
    expect(() => getRandomFromArray(emptyArray)).toThrowError(
      'Array must not be empty',
    );
  });

  it('should return an element from a single-element array', () => {
    const singleElementArray = ['single-element'];
    expect(getRandomFromArray(singleElementArray)).toBe(singleElementArray[0]);
  });

  it('should return an element that exists within the array', () => {
    const multiElementArray = [
      'first-element',
      'second-element',
      'third-element',
    ];
    const result = getRandomFromArray(multiElementArray);
    expect(multiElementArray.includes(result)).toBeTruthy();
  });
});
