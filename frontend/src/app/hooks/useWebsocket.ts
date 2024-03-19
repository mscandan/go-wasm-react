import { useCallback, useEffect, useState } from 'react';

export const useWebsocket = () => {
  const [messages, setMessages] = useState<Array<string>>([]);

  const connectToSocket = useCallback(() => {
    try {
      const onMessageReceive = (msg: string) => {
        console.log('msg received', msg);
        setMessages((curr) => [...curr, msg]);
      };

      window.connectToWebsocket('ws://localhost:8080/ws', onMessageReceive);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    connectToSocket();
  }, [connectToSocket]);

  return { messages };
};
