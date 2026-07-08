"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to send reset link');
      
      setStatus('success');
      setMessage('A reset link has been sent to your email.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#28104E]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#28104E]/5 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-black/5 p-12 border border-[#28104E]/10 relative z-10"
      >
        <div className="text-center mb-12">
          <h1 className="text-[#28104E] text-4xl font-serif tracking-[0.2em] mb-4">ATLAS</h1>
          <p className="text-gray-400 uppercase tracking-widest text-[10px] font-medium">Recovery Protocol</p>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-8 p-4 ${status === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'} border-l-4 text-xs rounded-r-lg`}
          >
            {message}
          </motion.div>
        )}

        {status !== 'success' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FDFCFB] border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#28104E]/30 transition-all text-sm"
                placeholder="admin@grekam.in"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#28104E] text-[#FDFCFB] rounded-2xl py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-[#180930] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 mt-4 shadow-xl shadow-[#28104E]/20"
            >
              {status === 'loading' ? 'Processing...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <Link href="/login" className="block text-center text-[#28104E] text-[10px] uppercase tracking-[0.2em] font-bold mt-4 hover:underline">
            Back to Login
          </Link>
        )}

        <div className="mt-8 text-center">
          <Link href="/login" className="text-[10px] text-gray-400 uppercase tracking-widest hover:text-[#28104E] transition-colors">
            Return to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
