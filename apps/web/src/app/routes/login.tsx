import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

import { loginWithGoogle } from '@/features/auth/api/auth-api';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) return;
          await loginWithGoogle(credentialResponse.credential);
          navigate('/dashboard');
        }}
        onError={() => undefined}
      />
    </div>
  );
}
