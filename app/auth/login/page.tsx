'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🚀 Login form submitted');

    // Safety timeout - reset loading after 10 seconds if redirect doesn't happen
    const timeoutId = setTimeout(() => {
      console.warn('⏱️ Login timeout - resetting loading state');
      setLoading(false);
      setError('Login is taking longer than expected. Please try again.');
    }, 10000);

    try {
      const { error: authError } = await signIn(email, password);

      clearTimeout(timeoutId);

      if (authError) {
        console.error('🔴 Auth error:', authError.message);
        setError(authError.message);
        setLoading(false);
      } else {
        console.log('🎉 Login request completed, waiting for redirect...');
        // Loading state will remain true until redirect happens
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('🔴 Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#000000]" />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">Picxie</h1>
          <p className="text-[#666]">Photo Management</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-8">Sign In</h2>

          {error && (
            <div
              className="mb-6 p-4 rounded-lg flex items-center gap-3"
              style={{
                background: 'rgba(255, 100, 100, 0.1)',
                border: '1px solid rgba(255, 100, 100, 0.2)',
              }}
            >
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <span className="text-white text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-white/60 uppercase tracking-widest mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#e9d5ff] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-white/60 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#e9d5ff] focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg font-medium transition-slow disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading ? 'rgba(255, 255, 255, 0.05)' : 'rgba(233, 213, 255, 0.15)',
                border: '1px solid rgba(233, 213, 255, 0.3)',
                color: loading ? '#666' : '#e9d5ff',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-8 text-center">
            <p className="text-[#666] text-sm">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-[#e9d5ff] hover:underline transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
