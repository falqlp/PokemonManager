import seedrandom from "seedrandom";

function boxMullerRandom(): [number, number] {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  let num2 = Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v);
  return [num, num2];
}

export function normalRandom(mean: number = 0, stdDev: number = 1): number {
  const [z] = boxMullerRandom();
  return z * stdDev + mean;
}

export function sample<T>(
  documents: T[],
  sampleSize: number,
  seed?: string
): T[] {
  const rng = seedrandom(seed ?? "");
  const sampled: T[] = [];
  const docs = [...documents];

  while (sampled.length < sampleSize && docs.length > 0) {
    const index = Math.floor(rng() * docs.length);
    sampled.push(docs.splice(index, 1)[0]);
  }

  return sampled;
}
