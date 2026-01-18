'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { initThreeScene } from '@/lib/threeScene';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'idle' | 'login' | 'signup'>('idle');
  const [loading, setLoading] = useState(false);

  // 🔥 Shader background init
  useEffect(() => {
    if (!containerRef.current) return;

    const cleanup = initThreeScene(containerRef.current, mouse.current);

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.set(
        e.clientX / window.innerWidth - 0.5,
        -(e.clientY / window.innerHeight) + 0.5
      );
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      cleanup();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const checkUser = async () => {
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMode(data.exists ? 'login' : 'signup');
    } catch (err) {
      alert('Error checking user');
    }
    setLoading(false);
  };

  // 🔑 Login API
  const handleLogin = async () => {
    if (!email || !password) return alert('Enter email and password');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) router.push('/home');
      else alert(data.message || 'Invalid credentials');
    } catch (err) {
      alert('Login failed');
    }
    setLoading(false);
  };

  // 🔑 Signup API
  const handleSignup = async () => {
    if (!email || !password) return alert('Enter email and password');
    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) router.push('/home');
      else alert(data.message || 'Signup failed');
    } catch (err) {
      alert('Signup failed');
    }
    setLoading(false);
  };

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Shader background */}
      <div ref={containerRef} className="absolute inset-0 -z-10" />

      {/* Auth card */}
      <div className="bg-black/70 backdrop-blur-xl rounded-3xl shadow-xl w-full max-w-5xl p-8 md:p-12 flex flex-col md:flex-row gap-8 text-white">
        {/* Left: Welcome info */}
        <div className="md:w-1/2 flex flex-col justify-center items-start">
          <h1 className="text-4xl font-bold mb-4">Welcome to TMDB</h1>
          <p className="mb-6 text-gray-300">
            Sign in if you already have an account, or create one to start using the app.
          </p>

          {mode === 'idle' && (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 mb-4 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={checkUser}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold"
              >
                {loading ? 'Checking...' : 'Continue'}
              </button>
            </>
          )}
        </div>

        {/* Right: Auth forms */}
        <div className="md:w-1/2 flex flex-col justify-center items-stretch">
          {mode === 'login' && (
            <>
              <h2 className="text-2xl font-bold mb-4">Sign In</h2>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 mb-4 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 transition font-semibold"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </>
          )}

          {mode === 'signup' && (
            <>
              <h2 className="text-2xl font-bold mb-4">Create Account</h2>
              <input
                type="password"
                placeholder="Create password"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 mb-4 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={handleSignup}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition font-semibold"
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
