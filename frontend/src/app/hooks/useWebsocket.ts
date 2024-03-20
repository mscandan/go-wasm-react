import { useCallback, useEffect, useState } from 'react';

export const useWebsocket = () => {
  const [messages, setMessages] = useState<Array<string>>([]);

  const connectToSocket = useCallback(async () => {
    try {
      const onMessageReceive = (msg: string) => {
        console.log('msg received', msg);
        setMessages((curr) => [...curr, msg]);
      };
      await fetch('https://simple-socket-golang.onrender.com/setCookies', {
        credentials: 'include',
      });

      await window.connectToWebsocketV2(
        'wss://simple-socket-golang.onrender.com/ws',
        ['hi', 'bro']
      );

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
