export function splitArray<T>(inputArray: T[]): T[][] {
  const array1: T[] = [];
  const array2: T[] = [];

  inputArray.forEach((element, index) => {
    const position = Math.floor(index / 3);
    const phase = index % 3;

    if (position % 2 === 0 && phase !== 2) {
      array1.push(element);
    } else if (position % 2 !== 0 && phase === 2) {
      array1.push(element);
    } else {
      array2.push(element);
    }
  });

  return [array1, array2];
}
