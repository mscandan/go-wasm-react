declare global {
  export interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Go: any;
    connectToWebsocket: (url: string) => void;
    sendMessage: (msg: string) => void;
    listenForMessages: (onMessageReceive: (msg: string) => void) => void;
  }
}

export {};
