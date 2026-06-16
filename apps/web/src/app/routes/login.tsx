import { GoogleLogin } from '@react-oauth/google';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginWithGoogle } from '@/features/auth/api/auth-api';
import { applyThemeColor } from '@/lib/theme-colors';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    applyThemeColor('orange', false);
  }, []);

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
