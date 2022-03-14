import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import './index.css';
import App from './App';

// HashRouter https://localhost:3000/#1
// BrowserRouter https://localhost:3000/1
// MemoryRouter

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
