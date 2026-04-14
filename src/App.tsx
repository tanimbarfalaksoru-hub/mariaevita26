/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import PublicView from './components/PublicView';
import LoginView from './components/LoginView';
import AdminView from './components/AdminView';
import { fetchPublicData } from './gas-api';
import { AppState } from './types';
import { Loader2, CheckCircle2, AlertCircle, GraduationCap, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [view, setView] = useState<'public' | 'login' | 'admin'>('public');
  const [state, setState] = useState<AppState>({
    profile: {},
    subjects: [],
    projects: [],
    articles: [],
    galleries: [],
    messages: []
  });
  const [loading, setLoading] = useState(true);
  const [splash, setSplash] = useState(true);
  const [toast, setToast] = useState<{msg: string, isError: boolean} | null>(null);
  const [overlayLoading, setOverlayLoading] = useState<{show: boolean, text: string}>({show: false, text: ''});
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    initApp();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('portfolio_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('portfolio_theme', 'light');
      }
      return newMode;
    });
  };

  const initApp = async () => {
    try {
      const data = await fetchPublicData("getPublicData");
      setState({
        profile: data.profile || {},
        subjects: data.subjects || [],
        projects: data.projects || [],
        articles: data.articles || [],
        galleries: data.galleries || [],
        messages: []
      });
    } catch (err) {
      showToast("Gagal memuat data dari server.", true);
    } finally {
      setLoading(false);
      setTimeout(() => setSplash(false), 1200);
    }
  };

  const showToast = (msg: string, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3500);
  };

  const showLoader = (text = "Memuat data...") => setOverlayLoading({ show: true, text });
  const hideLoader = () => setOverlayLoading({ show: false, text: '' });

  const switchView = (newView: 'public' | 'login' | 'admin') => {
    if (newView === 'admin' && !sessionStorage.getItem('portfolio_auth')) {
      showToast('Akses ditolak. Silakan login terlebih dahulu.', true);
      setView('login');
      return;
    }
    setView(newView);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-50 selection:bg-indigo-200 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">
      <AnimatePresence>
        {splash && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center"
          >
            <div className="relative flex justify-center items-center mb-8">
              <div className="absolute animate-ping w-24 h-24 rounded-full bg-indigo-500 opacity-20"></div>
              <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl relative z-10">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-white text-2xl md:text-3xl font-extrabold tracking-widest uppercase mb-6 animate-pulse" style={{ letterSpacing: '0.3em' }}>Edukasi</h2>
            <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-1/2 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[90] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-white font-bold ${toast.isError ? 'bg-red-600' : 'bg-emerald-600'}`}
          >
            {toast.isError ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {overlayLoading.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-[80]"
          >
            <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
            <p className="text-indigo-800 dark:text-indigo-300 font-bold text-lg animate-pulse">{overlayLoading.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!splash && (
        <main>
          {view === 'public' && <PublicView state={state} switchView={switchView} showToast={showToast} showLoader={showLoader} hideLoader={hideLoader} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
          {view === 'login' && <LoginView switchView={switchView} showToast={showToast} showLoader={showLoader} hideLoader={hideLoader} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
          {view === 'admin' && <AdminView state={state} setState={setState} switchView={switchView} showToast={showToast} showLoader={showLoader} hideLoader={hideLoader} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
        </main>
      )}
    </div>
  );
}
