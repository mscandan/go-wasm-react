import { useCallback, useEffect, useState } from 'react';

export const useWebsocket = () => {
  const [messages, setMessages] = useState<Array<string>>([]);

  const connectToSocket = useCallback(async () => {
    try {
      const onMessageReceive = (msg: string) => {
        console.log('msg received', msg);
        setMessages((curr) => [...curr, msg]);
      };
      await fetch('http://localhost:80/setCookies', {
        credentials: 'include',
      });

      await window.connectToWebsocketV2('ws://localhost:80/ws', ['hi', 'bro']);

      window.listenForMessagesV2(onMessageReceive);
      window.sendMessageV2(JSON.stringify({ start: 10, end: 20 }));
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    connectToSocket();
  }, [connectToSocket]);

  return { messages };
};
