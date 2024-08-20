declare module 'polynomial-regression' {
    export function createModel(): {
      fit(data: [number, number][], degrees: number[]): void;
      estimate(degree: number, x: number): number;
      saveExpressions(path: string): void;
    };
  }