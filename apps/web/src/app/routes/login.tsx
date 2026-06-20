import { GoogleLogin } from '@react-oauth/google';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartNoAxesColumnIncreasing, UsersRound } from 'lucide-react';

import { loginWithGoogle } from '@/features/auth/api/auth-api';
import { applyThemeColor } from '@/lib/theme-colors';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    applyThemeColor('orange', false);
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-y-auto bg-background text-foreground"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, var(--grid-line) 0 var(--grid-line-width), transparent var(--grid-line-width) var(--grid-size)), repeating-linear-gradient(90deg, var(--grid-line) 0 var(--grid-line-width), transparent var(--grid-line-width) var(--grid-size))",
        backgroundAttachment: "fixed",
        backgroundPosition: "0 0, 0 0",
        backgroundSize: "var(--grid-size) var(--grid-size)",
      }}
    >
      <main className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-10 px-5 py-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)] lg:items-center lg:gap-16 lg:px-8">
        <section className="min-w-0 space-y-6">
          <div className="space-y-3">
            <h1 className="max-w-3xl text-5xl leading-none md:text-7xl">
              Read more together.
            </h1>
            <p className="max-w-xl text-lg font-base">
              Sign in to keep your shelves, score, and friends in one place.
            </p>
          </div>

          <div className="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-[1fr_1.25fr]">
            <div className="rounded-base border-2 border-border bg-main p-4 text-main-foreground shadow-shadow">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs opacity-80">2026 Score</p>
                  <p className="text-3xl font-heading">31.84</p>
                </div>
                <ChartNoAxesColumnIncreasing className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                {[68, 44, 82, 55, 73].map((height, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-3 w-16 rounded-base border-2 border-border bg-background" />
                    <div
                      className="h-3 rounded-base border-2 border-border bg-background"
                      style={{ width: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-base border-2 border-border bg-background p-4 shadow-shadow">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-heading">Currently Reading:</p>
                <UsersRound className="h-5 w-5" />
              </div>
              <div className="flex gap-2 overflow-hidden pb-1 pr-1">
                {[
                  ['var(--main)', 'Pride and Prejudice'],
                  ['var(--chart-2)', 'Moby-Dick'],
                  ['var(--chart-4)', 'Jane Eyre'],
                  ['var(--chart-5)', 'The Odyssey'],
                ].map(([color, title]) => (
                  <div
                    key={title}
                    className="flex h-40 w-24 flex-none flex-col justify-between rounded-base border-2 border-border p-2 text-xs shadow-shadow"
                    style={{ backgroundColor: color }}
                  >
                    <span className="font-heading leading-tight">{title}</span>
                    <span className="h-2 w-10 rounded-base border-2 border-border bg-background" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full max-w-sm justify-self-center rounded-base border-2 border-border bg-main p-5 text-main-foreground shadow-shadow lg:justify-self-end">
          <div className="rounded-base border-2 border-border bg-background p-5 text-foreground shadow-shadow">
            <div className="mb-6 space-y-2 text-left">
              <h2 className="text-3xl">Sign in or start reading.</h2>
              <p className="text-sm opacity-80">Use your Google account to continue or create your shelf.</p>
            </div>

            <div className="flex min-h-12 items-center justify-center rounded-base border-2 border-border bg-secondary-background p-3 shadow-shadow">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (!credentialResponse.credential) return;
                  await loginWithGoogle(credentialResponse.credential);
                  navigate('/dashboard');
                }}
                onError={() => undefined}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
