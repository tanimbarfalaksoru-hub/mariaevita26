import React, { useState } from 'react';
import { callBackend } from '../gas-api';
import { Shield, User, Lock, ArrowLeft } from 'lucide-react';

export default function LoginView({ switchView, showToast, showLoader, hideLoader, isDarkMode, toggleDarkMode }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoader("Otentikasi sistem...");
    try {
      await callBackend({ action: 'login', username, password });
      sessionStorage.setItem('portfolio_auth', 'true');
      showToast("Otentikasi Berhasil!");
      switchView('admin');
    } catch (err: any) {
      showToast(err.message || "Kredensial tidak valid.", true);
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-indigo-600/5 dark:bg-indigo-400/5 pattern-grid-lg"></div>
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 p-8 md:p-12 relative z-10 transition-colors duration-300">
        <div className="text-center mb-10">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-inner">
            <Shield className="w-12 h-12 text-indigo-600 dark:text-indigo-400 transform -rotate-3" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Area Admin</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">Kelola konten website Anda.</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input 
                type="text" 
                required 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-12 px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div className="mb-10">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-bold py-4 px-4 rounded-2xl transition duration-300 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 hover:-translate-y-0.5 text-lg">
            Masuk Sistem
          </button>
          <div className="mt-8 text-center">
            <button type="button" onClick={() => switchView('public')} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center w-full gap-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Website
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
