export function App() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <button
        onClick={() => {
          alert(window.myGolangFunction(2, 3));
        }}
      >
        Click here to invoke WebAssembly!
      </button>
    </div>
  );
}

export default App;
