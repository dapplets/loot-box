import { Buffer } from 'buffer'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Polyfill for near-api-js
Object.defineProperty(window, 'Buffer', { value: Buffer })

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)
