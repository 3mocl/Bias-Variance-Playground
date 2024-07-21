
export const randomNormal = (mean = 0, stdDev = 1, size = 1) => {
    const randoms = [];
    for (let i = 0; i < size; i++) {
      let u = 0, v = 0;
      while (u === 0) u = Math.random(); // Convert [0,1) to (0,1)
      while (v === 0) v = Math.random();
      const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      randoms.push(num * stdDev + mean);
    }
    return randoms;
  };