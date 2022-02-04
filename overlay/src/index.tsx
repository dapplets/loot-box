import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from './App';
import 'semantic-ui-css/semantic.min.css';
import { DataProvider } from './DataContext/DataContext';
ReactDOM.render(
  <MemoryRouter>
    <DataProvider>
      <App />
    </DataProvider>
  </MemoryRouter>,
  document.getElementById('root'),
);
