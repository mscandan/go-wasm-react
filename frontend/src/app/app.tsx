import useApi from './hooks/useApi';

export function App() {
  const { data, refetch } = useApi('https://api.quotable.io/quotes/random');

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
      <button onClick={refetch}>Click here to invoke WebAssembly!</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;
