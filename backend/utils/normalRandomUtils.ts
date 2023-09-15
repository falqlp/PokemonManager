const normalRandomUtils = {
  boxMullerRandom(): [number, number] {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    let num2 = Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v);
    return [num, num2];
  },

  normalRandom(mean: number = 0, stdDev: number = 1): number {
    const [z] = this.boxMullerRandom();
    return z * stdDev + mean;
  },
};
export default normalRandomUtils;
