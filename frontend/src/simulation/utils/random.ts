export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Returns a float between 0 (inclusive) and 1 (exclusive)
  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  // Returns a float between min and max
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  // Returns a random element from an array
  choice<T>(arr: T[]): T {
    const idx = Math.floor(this.next() * arr.length);
    return arr[idx];
  }
}

export const randomRange = (min: number, max: number): number => {
  return min + Math.random() * (max - min);
};

export const randomChoice = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};
