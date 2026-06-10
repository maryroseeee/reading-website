import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/app'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { env } from './config/env'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={env.googleClientId}>
    <App />
  </GoogleOAuthProvider>,
)
