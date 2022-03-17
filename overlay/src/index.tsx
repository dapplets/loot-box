import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from './App';
import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(
  <MemoryRouter>
    <App />
  </MemoryRouter>,
  document.getElementById('root'),
);
