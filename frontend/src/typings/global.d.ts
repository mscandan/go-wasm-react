declare global {
  export interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Go: any;
    useGolangHttpCall: <T>(url: string) => Promise<Response<T>>;
  }
}

export {};
