declare global {
  export interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Go: any;
    connectToWebsocket: (
      url: string,
      onMessageReceive: (msg: string) => void
    ) => void;
  }
}

export {};
