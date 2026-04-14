import React, { useState, useEffect } from 'react';
import { callBackend, fetchPublicData } from '../gas-api';
import { AppState } from '../types';
import { 
  Settings, UserCog, BookOpen, Briefcase, Image as ImageIcon, 
  Mail, LogOut, ExternalLink, PlusCircle, Trash2, RefreshCw,
  Moon, Sun
} from 'lucide-react';

export default function AdminView({ state, setState, switchView, showToast, showLoader, hideLoader, isDarkMode, toggleDarkMode }: any) {
  const [activeTab, setActiveTab] = useState('profil');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState(state.profile);
  
  useEffect(() => {
    setProfileForm(state.profile);
  }, [state.profile]);

  const handleLogout = () => {
    sessionStorage.removeItem('portfolio_auth');
    showToast("Sesi diakhiri secara aman.");
    switchView('public');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoader("Menyimpan ke database...");
    try {
      await callBackend({ action: 'saveProfile', data: profileForm });
      setState((prev: AppState) => ({ ...prev, profile: profileForm }));
      showToast("Profil berhasil diperbarui!");
    } catch(err: any) {
      showToast(err.message || "Gagal menyimpan konfigurasi.", true);
    } finally {
      hideLoader();
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const sub = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      desc: (form.elements.namedItem('desc') as HTMLTextAreaElement).value
    };
    showLoader("Memproses data...");
    try {
      const newSub = await callBackend({ action: 'addSubject', data: sub });
      setState((prev: AppState) => ({ ...prev, subjects: [...prev.subjects, newSub] }));
      form.reset();
      showToast("Mata Pelajaran ditambahkan.");
    } catch(err: any) {
      showToast(err.message || "Gagal menambah data.", true);
    } finally {
      hideLoader();
    }
  };

  const deleteSubject = async (id: string) => {
    if(!confirm("Hapus mata pelajaran ini secara permanen?")) return;
    showLoader("Menghapus entri...");
    try {
      await callBackend({ action: 'deleteSubject', id });
      setState((prev: AppState) => ({ ...prev, subjects: prev.subjects.filter(s => s.id !== id) }));
      showToast("Data telah dihapus.");
    } catch(err: any) {
      showToast(err.message || "Operasi hapus gagal.", true);
    } finally {
      hideLoader();
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const proj = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      image: (form.elements.namedItem('image') as HTMLInputElement).value,
      desc: (form.elements.namedItem('desc') as HTMLTextAreaElement).value,
      link: (form.elements.namedItem('link') as HTMLInputElement).value
    };
    showLoader("Menambahkan portofolio...");
    try {
      const newProj = await callBackend({ action: 'addProject', data: proj });
      setState((prev: AppState) => ({ ...prev, projects: [...prev.projects, newProj] }));
      form.reset();
      showToast("Karya tersimpan.");
    } catch(err: any) {
      showToast(err.message || "Gagal menyimpan portofolio.", true);
    } finally {
      hideLoader();
    }
  };

  const deleteProject = async (id: string) => {
    if(!confirm("Hapus portofolio ini secara permanen?")) return;
    showLoader("Menghapus data...");
    try {
      await callBackend({ action: 'deleteProject', id });
      setState((prev: AppState) => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
      showToast("Data telah dihapus.");
    } catch(err: any) {
      showToast(err.message || "Gagal menghapus.", true);
    } finally {
      hideLoader();
    }
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const gal = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      image: (form.elements.namedItem('image') as HTMLInputElement).value,
      desc: (form.elements.namedItem('desc') as HTMLTextAreaElement).value
    };
    showLoader("Menyimpan ke galeri...");
    try {
      const newGal = await callBackend({ action: 'addGallery', data: gal });
      setState((prev: AppState) => ({ ...prev, galleries: [...prev.galleries, newGal] }));
      form.reset();
      showToast("Foto berhasil diunggah.");
    } catch(err: any) {
      showToast(err.message || "Gagal upload galeri.", true);
    } finally {
      hideLoader();
    }
  };

  const deleteGallery = async (id: string) => {
    if(!confirm("Hapus foto ini dari galeri?")) return;
    showLoader("Memproses penghapusan...");
    try {
      await callBackend({ action: 'deleteGallery', id });
      setState((prev: AppState) => ({ ...prev, galleries: prev.galleries.filter(g => g.id !== id) }));
      showToast("Foto dihapus.");
    } catch(err: any) {
      showToast(err.message || "Gagal menghapus foto.", true);
    } finally {
      hideLoader();
    }
  };

  const fetchMessages = async () => {
    showLoader("Sinkronisasi pesan...");
    try {
      const msgs = await fetchPublicData("getMessages");
      setState((prev: AppState) => ({ ...prev, messages: msgs || [] }));
    } catch(err: any) {
      showToast(err.message || "Gagal memuat pesan.", true);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    }
  }, [activeTab]);

  const tabs = [
    { id: 'profil', label: 'Profil & Visi', icon: UserCog },
    { id: 'subjects', label: 'Mata Pelajaran', icon: BookOpen },
    { id: 'projects', label: 'Portofolio', icon: Briefcase },
    { id: 'galleries', label: 'Galeri Foto', icon: ImageIcon },
    { id: 'messages', label: 'Pesan Masuk', icon: Mail },
  ];

  const titles: Record<string, string> = {
    'profil': 'Profil & Visi Misi',
    'subjects': 'Kelola Mata Pelajaran',
    'projects': 'Kelola Portofolio Karya',
    'galleries': 'Kelola Galeri',
    'messages': 'Kotak Masuk Pesan'
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row relative w-full overflow-x-hidden transition-colors duration-300">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 dark:bg-slate-950 text-white px-5 py-4 flex justify-between items-center sticky top-0 z-[60] shadow-xl w-full">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-inner"><Settings className="w-5 h-5" /></div>
          <span className="font-extrabold text-lg tracking-wide">CMS Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleDarkMode} className="text-white hover:text-indigo-300 bg-slate-800 p-2 rounded-xl transition-colors">
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white hover:text-indigo-300 bg-slate-800 p-2 rounded-xl transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col bg-slate-900 dark:bg-slate-950 w-full md:w-72 flex-shrink-0 absolute md:sticky top-[68px] md:top-0 z-50 transition-all duration-300 shadow-2xl h-[calc(100vh-68px)] md:h-screen overflow-y-auto border-r border-slate-800 dark:border-slate-900`}>
        <div className="p-6 border-b border-slate-800 dark:border-slate-900 hidden md:flex items-center justify-between bg-slate-900 dark:bg-slate-950 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg"><Settings className="w-5 h-5 text-white" /></div>
            <h2 className="text-xl font-extrabold text-white tracking-wide">CMS Admin</h2>
          </div>
          <button onClick={toggleDarkMode} className="text-slate-400 hover:text-white transition-colors">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 w-full">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-4 px-5 py-4 text-left rounded-xl font-bold tracking-wide transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg border border-indigo-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent hover:border-slate-700'}`}
              >
                <Icon className="w-5 h-5" /> {tab.label}
              </button>
            );
          })}
        </nav>
        <div className="p-5 border-t border-slate-800 dark:border-slate-900 w-full mt-auto sticky bottom-0 bg-slate-900 dark:bg-slate-950">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl font-bold tracking-wide transition-all border border-red-500/20 hover:border-red-500">
            <LogOut className="w-5 h-5" /> Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 md:p-10 overflow-y-auto w-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-10 gap-6 w-full">
          <div className="w-full sm:w-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{titles[activeTab]}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Kelola data untuk ditampilkan di website publik.</p>
          </div>
          <button onClick={() => switchView('public')} className="w-full sm:w-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-200 dark:hover:border-slate-600 font-bold tracking-wide shadow-sm flex items-center justify-center gap-2 transition-all">
            <ExternalLink className="w-5 h-5" /> Lihat Website
          </button>
        </div>

        {/* Tab: Profil */}
        {activeTab === 'profil' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-10 w-full transition-colors duration-300">
            <form onSubmit={handleSaveProfile} className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 w-full">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Teks Logo (Navbar)</label>
                  <input type="text" required value={profileForm.logoText || ''} onChange={e => setProfileForm({...profileForm, logoText: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Nama Lengkap</label>
                  <input type="text" required value={profileForm.name || ''} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 w-full">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Profesi / Role</label>
                  <input type="text" required value={profileForm.role || ''} onChange={e => setProfileForm({...profileForm, role: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Teks Hero Singkat</label>
                  <input type="text" required value={profileForm.heroText || ''} onChange={e => setProfileForm({...profileForm, heroText: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white" />
                </div>
              </div>
              <div className="mb-6 w-full">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">URL Foto Profil</label>
                <input type="url" required value={profileForm.photoUrl || ''} onChange={e => setProfileForm({...profileForm, photoUrl: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white" placeholder="https://..." />
              </div>
              <div className="mb-6 w-full">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Tentang Saya (Bio Lengkap)</label>
                <textarea rows={4} required value={profileForm.bio || ''} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white resize-none"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 w-full">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Visi</label>
                  <textarea rows={4} value={profileForm.visi || ''} onChange={e => setProfileForm({...profileForm, visi: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Misi</label>
                  <textarea rows={4} value={profileForm.misi || ''} onChange={e => setProfileForm({...profileForm, misi: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white resize-none"></textarea>
                </div>
              </div>
              <button type="submit" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold tracking-wide py-4 px-8 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all hover:-translate-y-0.5">
                Simpan Perubahan Profil
              </button>
            </form>
          </div>
        )}

        {/* Tab: Subjects */}
        {activeTab === 'subjects' && (
          <div className="w-full space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-10 w-full transition-colors duration-300">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-3"><PlusCircle className="text-indigo-600 dark:text-indigo-400" /> Tambah Mata Pelajaran</h3>
              <form onSubmit={handleAddSubject} className="w-full">
                <div className="mb-6 w-full">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Nama Mata Pelajaran</label>
                  <input type="text" name="name" required className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white" />
                </div>
                <div className="mb-6 w-full">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Deskripsi</label>
                  <textarea name="desc" rows={3} required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white resize-none"></textarea>
                </div>
                <button type="submit" className="w-full sm:w-auto bg-slate-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white font-bold tracking-wide py-4 px-8 rounded-xl transition-all shadow-lg hover:-translate-y-0.5">
                  Tambah Matpel
                </button>
              </form>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden w-full transition-colors duration-300">
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Daftar Mata Pelajaran</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 md:p-8 w-full">
                {state.subjects.length === 0 ? (
                  <p className="col-span-full text-center text-slate-500 dark:text-slate-400 font-medium py-8">Data kosong.</p>
                ) : (
                  state.subjects.map((sub: any) => (
                    <div key={sub.id} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow w-full">
                      <h4 className="font-extrabold text-slate-900 dark:text-white mb-2 text-lg">{sub.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 flex-1">{sub.desc}</p>
                      <button onClick={() => deleteSubject(sub.id)} className="text-red-600 dark:text-red-400 hover:text-white bg-red-50 dark:bg-red-900/20 hover:bg-red-600 dark:hover:bg-red-600 text-sm font-bold rounded-lg py-2.5 px-4 transition-colors border border-red-100 dark:border-red-900/30 hover:border-red-600 self-start flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Projects */}
        {activeTab === 'projects' && (
          <div className="w-full space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-10 w-full transition-colors duration-300">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-3"><PlusCircle className="text-indigo-600 dark:text-indigo-400" /> Tambah Portofolio Karya</h3>
              <form onSubmit={handleAddProject} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Judul Karya</label>
                    <input type="text" name="title" required className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">URL Gambar Banner</label>
                    <input type="url" name="image" required className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white" placeholder="https://..." />
                  </div>
                </div>
                <div className="mb-6 w-full">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Deskripsi Singkat</label>
                  <textarea name="desc" rows={3} required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white resize-none"></textarea>
                </div>
                <div className="mb-8 w-full">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">URL Link Demo (Opsional)</label>
                  <input type="url" name="link" className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white" placeholder="https://..." />
                </div>
                <button type="submit" className="w-full sm:w-auto bg-slate-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white font-bold tracking-wide py-4 px-8 rounded-xl transition-all shadow-lg hover:-translate-y-0.5">
                  Simpan Karya Baru
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden w-full transition-colors duration-300">
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Daftar Portofolio</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6 md:p-8 w-full">
                {state.projects.length === 0 ? (
                  <p className="col-span-full text-center text-slate-500 dark:text-slate-400 font-medium py-8">Data kosong.</p>
                ) : (
                  state.projects.map((proj: any) => (
                    <div key={proj.id} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden flex flex-col bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow w-full">
                      <img src={proj.image} className="w-full h-40 object-cover bg-slate-100 dark:bg-slate-900" />
                      <div className="p-6 flex-1 flex flex-col w-full">
                        <h4 className="font-extrabold text-slate-900 dark:text-white mb-2 text-lg">{proj.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-6 flex-1">{proj.desc}</p>
                        <button onClick={() => deleteProject(proj.id)} className="mt-auto w-full text-red-600 dark:text-red-400 hover:text-white bg-red-50 dark:bg-red-900/20 hover:bg-red-600 dark:hover:bg-red-600 text-sm font-bold rounded-xl py-3 transition-colors border border-red-100 dark:border-red-900/30 hover:border-red-600 flex justify-center items-center gap-2">
                          <Trash2 className="w-4 h-4" /> Hapus Portofolio
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Galleries */}
        {activeTab === 'galleries' && (
          <div className="w-full space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-10 w-full transition-colors duration-300">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-3"><PlusCircle className="text-indigo-600 dark:text-indigo-400" /> Tambah Foto Galeri</h3>
              <form onSubmit={handleAddGallery} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Judul Gambar</label>
                    <input type="text" name="title" required className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">URL Gambar</label>
                    <input type="url" name="image" required className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white" placeholder="https://..." />
                  </div>
                </div>
                <div className="mb-8 w-full">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Deskripsi Gambar</label>
                  <textarea name="desc" rows={3} required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white resize-none"></textarea>
                </div>
                <button type="submit" className="w-full sm:w-auto bg-slate-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white font-bold tracking-wide py-4 px-8 rounded-xl transition-all shadow-lg hover:-translate-y-0.5">
                  Unggah ke Galeri
                </button>
              </form>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden w-full transition-colors duration-300">
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Daftar Foto Galeri</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6 md:p-8 w-full">
                {state.galleries.length === 0 ? (
                  <p className="col-span-full text-center text-slate-500 dark:text-slate-400 font-medium py-8">Data kosong.</p>
                ) : (
                  state.galleries.map((gal: any) => (
                    <div key={gal.id} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden flex flex-col bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow w-full">
                      <img src={gal.image} className="w-full h-40 object-cover bg-slate-100 dark:bg-slate-900" />
                      <div className="p-6 flex-1 flex flex-col w-full">
                        <h4 className="font-extrabold text-slate-900 dark:text-white mb-2 text-lg">{gal.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 flex-1">{gal.desc}</p>
                        <button onClick={() => deleteGallery(gal.id)} className="mt-auto w-full text-red-600 dark:text-red-400 hover:text-white bg-red-50 dark:bg-red-900/20 hover:bg-red-600 dark:hover:bg-red-600 text-sm font-bold rounded-xl py-3 transition-colors border border-red-100 dark:border-red-900/30 hover:border-red-600 flex justify-center items-center gap-2">
                          <Trash2 className="w-4 h-4" /> Hapus Foto
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Messages */}
        {activeTab === 'messages' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden w-full transition-colors duration-300">
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Kotak Masuk</h3>
              <button onClick={fetchMessages} className="w-full sm:w-auto text-indigo-600 dark:text-indigo-400 hover:text-white bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-600 dark:hover:bg-indigo-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Segarkan Data
              </button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700 w-full">
              {state.messages.length === 0 ? (
                <div className="p-12 text-center w-full">
                  <Mail className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Belum ada pesan baru.</span>
                </div>
              ) : (
                [...state.messages].reverse().map((msg: any, i: number) => (
                  <div key={i} className="p-6 md:p-8 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 w-full">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-lg truncate mb-1">{msg.name}</h4>
                        <a href={`mailto:${msg.email}`} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors truncate flex items-center gap-2">
                          <Mail className="w-4 h-4" /> {msg.email}
                        </a>
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 whitespace-nowrap">{msg.date}</span>
                    </div>
                    <div className="mt-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed font-medium shadow-sm break-words w-full">
                      "{msg.message}"
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
