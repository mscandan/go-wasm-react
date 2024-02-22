import React, { useEffect } from 'react';
import './wasm_exec.js';

async function loadWasm(): Promise<void> {
  console.log('here we are top of loadWasm');
  const goWasm = new window.Go();

  fetch('app.wasm')
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.instantiate(bytes, goWasm.importObject))
    .then((results) => {
      console.log('here we end of loadWasm');
      goWasm.run(results.instance);
    });
}

export const LoadWasm: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    loadWasm()
      .then(() => {
        console.log('wasm is ready');
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (isLoading) {
    return <div>loading WebAssembly...</div>;
  }

  return children;
};
