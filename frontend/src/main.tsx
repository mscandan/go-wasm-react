import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';
import { LoadWasm } from './app/utils/WasmLoader';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <LoadWasm>
        <App />
      </LoadWasm>
    </BrowserRouter>
  </StrictMode>
);
