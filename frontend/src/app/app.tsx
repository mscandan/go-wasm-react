import { useWebsocket } from './hooks/useWebsocket';

export function App() {
  const { messages } = useWebsocket();

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {messages.map((el, idx) => (
        <span key={`${idx}-message`}>{el}</span>
      ))}
    </div>
  );
}

export default App;
