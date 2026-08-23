'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientSupabase } from '@/lib/supabase/client';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClientSupabase();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    router.push('/admin');
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20 space-y-4">
      <h1 className="text-2xl font-bold">Admin login</h1>
      <form onSubmit={login} className="space-y-3">
        <input
          className="border rounded px-3 py-2 w-full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-black text-white px-4 py-2 rounded w-full" type="submit">
          Login
        </button>
      </form>
      <p className="text-sm text-gray-600">
        Signup <a className="text-blue-600 underline" href="/admin/signup">here</a>
      </p>
    </div>
  );
}
