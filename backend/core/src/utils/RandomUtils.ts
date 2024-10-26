import * as seedrandom from 'seedrandom';

function boxMullerRandom(): [number, number] {
  let u = 0,
    v = 0;
  while (u === 0) {
    u = Math.random();
  }
  while (v === 0) {
    v = Math.random();
  }
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  const num2 = Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v);
  return [num, num2];
}

export function normalRandom(mean: number = 0, stdDev: number = 1): number {
  const [z] = boxMullerRandom();
  return z * stdDev + mean;
}

export function sample<T>(
  documents: T[],
  sampleSize: number,
  seed?: string,
): T[] {
  console.info(seedrandom);
  const rng = seedrandom(seed ?? '');
  const sampled: T[] = [];
  const docs = [...documents];

  while (sampled.length < sampleSize && docs.length > 0) {
    const index = Math.floor(rng() * docs.length);
    sampled.push(docs.splice(index, 1)[0]);
  }

  return sampled;
}

export function shuffleArray(array: any[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function getRandomFromArray<T>(array: T[], seed?: string): T {
  if (array.length === 0) {
    throw new Error('Array must not be empty');
  }
  if (seed) {
    const rng = seedrandom(seed ?? '');
    return array[Math.floor(rng() * array.length)];
  }
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomValue(seed: string): number {
  const rng = seedrandom(seed ?? '');
  return rng();
}
