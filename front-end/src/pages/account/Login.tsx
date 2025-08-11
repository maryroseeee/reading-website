import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          await axios.post(
            'http://localhost:4000/api/auth/google',
            {
              id_token: credentialResponse.credential,
            },
            { withCredentials: true }
          );
          navigate('/dashboard');
        }}
        onError={() => console.log('Login Failed')}
      />
    </div>
  );
}