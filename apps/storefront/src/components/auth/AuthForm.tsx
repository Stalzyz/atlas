"use client";

import { API_URL } from "@/lib/api";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, ShieldCheck, Phone, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

import { initFirebase, getFirebaseAuth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

interface AuthFormProps {
  onSuccess?: (user: any) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [step, setStep] = useState<"input" | "otp">("input");
  
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      redirectUser();
    }
  }, [isAuthenticated, authLoading]);

  const redirectUser = () => {
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect') || '/collections/all';
    const safeRedirect = redirectUrl.startsWith('/') && !redirectUrl.startsWith('//') ? redirectUrl : '/collections/all';
    window.location.href = safeRedirect;
  };

  const setupRecaptcha = async () => {
    if (!window.recaptchaVerifier) {
      // 1. Fetch public settings
      const settingsRes = await fetch(`${API_URL}/api/v1/settings/public`);
      const settings = await settingsRes.json();
      
      if (!settings.firebaseApiKey) {
        throw new Error("Firebase is not configured by the administrator yet.");
      }

      // 2. Initialize Firebase dynamically
      initFirebase({
        apiKey: settings.firebaseApiKey,
        authDomain: settings.firebaseAuthDomain,
        projectId: settings.firebaseProjectId,
        storageBucket: settings.firebaseStorageBucket,
        messagingSenderId: settings.firebaseMessagingSenderId,
        appId: settings.firebaseAppId,
      });

      const auth = getFirebaseAuth();

      // 3. Setup Recaptcha
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('recaptcha resolved');
        }
      });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (method === "email") {
        const res = await fetch(`${API_URL}/api/v1/auth/otp/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error("Failed to send Email OTP. Please try again.");
        setStep("otp");
      } else {
        // Phone Auth
        await setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        const formattedPhone = `+91${phone}`;
        const auth = getFirebaseAuth();
        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        setConfirmationResult(confirmation);
        setStep("otp");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      if (window.recaptchaVerifier && method === "phone") {
        window.recaptchaVerifier.render().then((widgetId) => grecaptcha.reset(widgetId));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let backendData;

      if (method === "email") {
        const res = await fetch(`${API_URL}/api/v1/auth/otp/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: otp }),
        });
        backendData = await res.json();
        if (!res.ok) throw new Error(backendData.message || "Invalid Email OTP");
      } else {
        // Phone Auth - Verify with Firebase first
        if (!confirmationResult) throw new Error("Please request OTP first.");
        const result = await confirmationResult.confirm(otp);
        const idToken = await result.user.getIdToken();
        
        // Send Firebase ID Token to Backend
        const res = await fetch(`${API_URL}/api/v1/auth/firebase-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: idToken }),
        });
        backendData = await res.json();
        if (!res.ok) throw new Error(backendData.message || "Authentication failed");
      }

      // Save session
      const domainOpt = typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? { domain: '.atlas.grekam.in' } : {};
      Cookies.set("auth_token", backendData.access_token, { expires: 30, path: '/', ...domainOpt });
      localStorage.setItem("user", JSON.stringify(backendData.user));
      
      if (onSuccess) onSuccess(backendData.user);
      redirectUser();

    } catch (err: any) {
      setError(err.message || "Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");

      const domainOpt = typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? { domain: '.atlas.grekam.in' } : {};
      Cookies.set("auth_token", data.access_token, { expires: 30, path: '/', ...domainOpt });
      localStorage.setItem("user", JSON.stringify(data.user));

      if (onSuccess) onSuccess(data.user);
      redirectUser();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div id="recaptcha-container"></div>
      <div className="bg-theme-glass backdrop-blur-xl border border-theme-glass-border rounded-[32px] p-8 md:p-12 shadow-2xl shadow-black/5">
        <div className="text-center mb-10">
          <div className="mb-8">
            <img src="/logo-dark.svg" alt="ATLAS" className="h-12 mx-auto object-contain mb-4" />
          </div>
          <h1 className="text-3xl font-serif text-theme-text mb-3 tracking-tight">
            {step === "input" ? "Welcome" : "Verify Code"}
          </h1>
          <p className="text-theme-text-muted text-sm font-medium">
             {step === "input" ? "Sign in to continue" : "Check your messages"}
          </p>
        </div>

        {step === "input" && (
          <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => setMethod("phone")}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${method === "phone" ? "bg-white text-theme-text shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              Phone
            </button>
            <button
              onClick={() => setMethod("email")}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${method === "email" ? "bg-white text-theme-text shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              Email
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === "input" ? (
            <motion.form
              key="input-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOtp}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest ml-1">
                   {method === "phone" ? "Mobile Number" : "Email Address"}
                </label>
                
                {method === "phone" ? (
                  <div className="flex bg-theme-bg border border-theme-border focus-within:border-primary focus-within:ring-0 rounded-2xl overflow-hidden transition-all text-theme-text text-sm font-medium">
                    <div className="px-4 py-4 bg-gray-50 border-r border-theme-border font-bold text-gray-500">
                      +91
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="99999 99999"
                      className="w-full bg-transparent pl-4 pr-4 py-4 outline-none"
                    />
                  </div>
                ) : (
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted/30 group-focus-within:text-primary transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-theme-bg border border-theme-border focus:border-primary focus:ring-0 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium transition-all text-theme-text"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || (method === "phone" && phone.length < 10) || (method === "email" && !email)}
                className="w-full bg-theme-text hover:bg-theme-text/90 text-white dark:text-black rounded-2xl py-4 text-xs font-bold uppercase tracking-widest shadow-xl shadow-theme-text/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
              </button>

              <div className="relative my-8 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-theme-border"></div></div>
                <span className="relative px-4 bg-theme-surface text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">Or continue with</span>
              </div>

              <div className="flex justify-center flex-col items-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google login failed")}
                  useOneTap
                  shape="pill"
                />
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="otp-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp}
              className="space-y-8"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest text-center block mb-4">
                  {method === "phone" ? "6-Digit Code" : "4-Digit Code"}
                </label>
                <div className="flex justify-center gap-4">
                  <input
                    type="text"
                    maxLength={method === "phone" ? 6 : 4}
                    required
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder={method === "phone" ? "000000" : "0000"}
                    className="w-40 text-center tracking-[8px] text-2xl font-bold bg-theme-bg border border-theme-border focus:border-primary focus:ring-0 rounded-2xl py-4 transition-all text-theme-text"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading || otp.length < (method === "phone" ? 6 : 4)}
                  className="w-full bg-theme-text hover:bg-theme-text/90 text-white dark:text-black rounded-2xl py-4 text-xs font-bold uppercase tracking-widest shadow-xl shadow-theme-text/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ShieldCheck className="w-4 h-4" /></>}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep("input")}
                  className="w-full text-theme-text-muted hover:text-theme-text text-[10px] font-bold uppercase tracking-widest transition-colors"
                >
                  Back to login
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center text-xs font-bold text-red-500 bg-red-500/10 py-3 rounded-xl border border-red-500/20"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
};

