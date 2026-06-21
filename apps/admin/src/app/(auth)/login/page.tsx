"use client";

import React, { useState } from 'react';
import { useAdminAuth } from '@/components/providers/AuthProvider';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#701A31]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#701A31]/5 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-black/5 p-12 border border-[#701A31]/10 relative z-10"
      >
        <div className="text-center mb-12">
          <img src="/logo-dark.svg" alt="Raaghas" className="h-14 w-auto mx-auto mb-3 object-contain" />
          <p className="text-gray-400 uppercase tracking-widest text-[10px] font-medium">Control Center · Est. 2022</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r-lg"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="w-full bg-[#FDFCFB] border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#701A31]/30 transition-all text-sm"
              placeholder="admin@raaghas.in"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-[#FDFCFB] border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#701A31]/30 transition-all text-sm"
              placeholder="••••••••"
            />
            <div className="flex justify-end px-1">
              <a 
                href="/forgot-password" 
                className="text-[9px] uppercase tracking-widest font-bold text-[#701A31]/60 hover:text-[#701A31] transition-colors"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#701A31] text-[#FDFCFB] rounded-2xl py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-[#5A1528] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 mt-4 shadow-xl shadow-[#701A31]/20"
          >
            {isLoading ? 'Authenticating...' : 'Enter Sanctuary'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-top border-gray-50 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-loose">
            Private Access Only<br/>
            Authorized Personnel & Management
          </p>
        </div>
      </motion.div>
    </div>
  );
}
