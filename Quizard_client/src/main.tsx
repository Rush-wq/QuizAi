import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

//import { auth0Config } from './auth0-config';
//import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*<Auth0Provider {...auth0Config}>
    </Auth0Provider>*/}
    <App />
  </StrictMode>,
)
