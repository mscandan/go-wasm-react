declare global {
  export interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Go: any;
    myGolangFunction: (num1: number, num2: number) => number;
  }
}

export {};
