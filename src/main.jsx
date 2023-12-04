import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
import File from './file'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <File />
    </BrowserRouter>
  </React.StrictMode>
)
