'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] dark:from-[#18181b] dark:to-[#1e293b]">
  {/* Contact button top right */}
  <div className="absolute right-8 top-8">
    <a href="mailto:support@syntestify.com" className="px-5 py-2 rounded-full bg-[#2563eb] text-white font-semibold border border-[#2563eb] shadow hover:bg-[#1e40af] transition-colors focus:outline-none focus:ring-2 focus:ring-[#818cf8] focus:ring-offset-2">
      Contact
    </a>
  </div>
  <div className="w-full max-w-md bg-white dark:bg-[#23272f] p-8 rounded-2xl shadow-xl flex flex-col items-center">
    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create your account</h2>
    <form onSubmit={handleSignUp} className="w-full flex flex-col gap-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#2563eb] text-white font-semibold py-2 rounded-lg shadow hover:bg-[#1e40af] transition-colors disabled:opacity-60"
      >
        {loading ? 'Signing up…' : 'Sign Up'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
    <div className="mt-4 text-sm text-gray-500 dark:text-gray-300">
      Already have an account?{' '}
      <a href="/auth/login" className="text-[#2563eb] hover:underline">Login</a>
    </div>
  </div>
</div>
  );
}
