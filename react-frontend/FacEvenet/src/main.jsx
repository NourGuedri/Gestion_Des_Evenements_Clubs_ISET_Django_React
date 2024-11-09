import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';


// import "bootstrap/dist/css/bootstrap.min.css";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      {/* <PrimeReactProvider theme="lara-light-cyan" > */}
    <App />

      {/* </PrimeReactProvider> */}
  </React.StrictMode>,
)
