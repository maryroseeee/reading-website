import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0)

  return (
      <div className="flex h-screen items-center justify-center">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          await axios.post('http://localhost:4000/api/auth/google', {
            id_token: credentialResponse.credential,
          }, { withCredentials: true });
        }}
        onError={() => console.log('Login Failed')}
      />
    </div>
  )
}

export default App
