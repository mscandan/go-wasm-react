import { useCallback, useEffect, useState } from 'react';

export const useWebsocket = () => {
  const [messages, setMessages] = useState<Array<string>>([]);

  const connectToSocket = useCallback(async () => {
    try {
      const onMessageReceive = (msg: string) => {
        console.log('msg received', msg);
        setMessages((curr) => [...curr, msg]);
      };
      console.log('we are here now starting connection', new Date());
      await window.connectToWebsocketV2('ws://localhost:8080/ws');
      console.log('we are here now connection started', new Date());

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
