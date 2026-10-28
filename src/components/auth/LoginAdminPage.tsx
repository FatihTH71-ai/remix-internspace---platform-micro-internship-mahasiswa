import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export const LoginAdminPage: React.FC = () => {
  const { loginAs } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const validEmail = cleanEmail === 'admin@internspace.com';
    const validPassword = password === 'admin123';

    if (!validEmail || !validPassword) {
      setError('Invalid admin e-mail or password.');
      return;
    }

    // Local demo only. For production, validate credentials on the backend.
    loginAs({
      id: `admin-${cleanEmail}`,
      name: 'Administrator',
      email: cleanEmail,
      role: 'admin',
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0764a8] via-[#0b6bb9] to-[#1976d2] px-4 py-8">
      <section className="w-full max-w-[400px] rounded-[24px] bg-white px-10 pb-10 pt-11 shadow-[0_20px_50px_rgba(0,40,100,0.25)]">
        {/* Logo + badge (logo returns to landing page) */}
        <div className="flex w-full justify-center">
          <div className="inline-flex items-center gap-3">
            <span className="text-[32px] font-extrabold leading-none tracking-[-0.04em] text-[#0b5a9e]">
              internspace
            </span>
            <span className="rounded-full bg-[#0077c8] px-3 py-1.5 text-[9px] font-bold leading-none tracking-wide text-white">
              ADMIN
            </span>
          </div>
        </div>

        <h1 className="mt-3 text-center text-[20px] font-medium text-[#5b6169]">
          Log in to the system
        </h1>

        <form onSubmit={handleSubmit} noValidate className="mt-8">
          {/* Admin e-mail */}
          <label
            htmlFor="admin-email"
            className="block text-[14px] font-medium uppercase text-[#6b7280]"
          >
            Admin e-mail
          </label>
          <div className="relative mt-3">
            <Mail
              strokeWidth={1.5}
              className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#6b7280]"
            />
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError('');
              }}
              placeholder="Enter you admin e-mail...."
              required
              className="h-[39px] w-full rounded-md border border-[#e5e7eb] bg-[#f8f9fa] pl-11 pr-3 text-[15px] text-[#1f2937] outline-none transition placeholder:text-[#6b7280] focus:border-[#0077c8] focus:bg-white focus:ring-4 focus:ring-[#0077c8]/10"
            />
          </div>

          {/* Password */}
          <label
            htmlFor="admin-password"
            className="mt-6 block text-[15px] font-medium text-[#6b7280]"
          >
            Password
          </label>
          <div className="relative mt-3">
            <Lock
              strokeWidth={1.5}
              className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#6b7280]"
            />
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError('');
              }}
              placeholder="Enter the password...."
              required
              className="h-[39px] w-full rounded-md border border-[#e5e7eb] bg-[#f8f9fa] pl-11 pr-11 text-[15px] text-[#1f2937] outline-none transition placeholder:text-[#6b7280] focus:border-[#0077c8] focus:bg-white focus:ring-4 focus:ring-[#0077c8]/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#6b7280] transition hover:text-[#0077c8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0077c8]/40"
            >
              {showPassword ? (
                <EyeOff strokeWidth={1.5} className="h-[18px] w-[18px]" />
              ) : (
                <Eye strokeWidth={1.5} className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-center text-[13px] text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 h-[40px] w-full rounded-full bg-[#0077c8] text-[14px] font-bold text-white transition hover:bg-[#0069b3] focus:outline-none focus:ring-4 focus:ring-[#0077c8]/30"
          >
            Log in
          </button>
        </form>
      </section>
    </main>
  );
};

export default LoginAdminPage;