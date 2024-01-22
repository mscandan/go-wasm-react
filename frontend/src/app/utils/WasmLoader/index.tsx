import React, { useEffect } from 'react';
import './wasm_exec.js';

async function loadWasm(): Promise<void> {
  const goWasm = new window.Go();

  fetch('app.wasm')
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.instantiate(bytes, goWasm.importObject))
    .then((results) => {
      goWasm.run(results.instance);
    });
}

export const LoadWasm: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    loadWasm()
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (isLoading) {
    return <div>loading WebAssembly...</div>;
  }

  return children;
};
