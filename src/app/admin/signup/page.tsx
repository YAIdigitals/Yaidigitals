'use client';
import { useRouter } from 'next/navigation';
import { createClientSupabase } from '@/lib/supabase/client';
import { useState } from 'react';

export default function Signup() {
  const router = useRouter();
  const supabase = createClientSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signup = async () => {
    await supabase.auth.signUp({ email, password });
    alert('Signup successful. Now login.');
    router.push('/admin/login');
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20 space-y-4">
      <h1 className="text-2xl font-bold">Create admin account</h1>
      <input className="border rounded px-3 py-2 w-full" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border rounded px-3 py-2 w-full" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={signup} className="bg-black text-white px-4 py-2 rounded w-full">Sign up</button>
    </div>
  );
}
