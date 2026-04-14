import { useState } from 'react';
import { callBackend, WA_NUMBER } from '../gas-api';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, User, BookOpen, Briefcase, FileText, Image as ImageIcon, 
  Menu, X, ArrowRight, Send, Eye, Target, BookOpenCheck 
} from 'lucide-react';

export default function PublicView({ state, switchView, showToast, showLoader, hideLoader }: any) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const p = state.profile;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    showLoader("Memproses pesan...");
    try {
      await callBackend({
        action: 'submitMessage',
        data: { name, email, message }
      });
      showToast("Pesan berhasil terkirim!");
      form.reset();

      if (WA_NUMBER && WA_NUMBER !== "6281234567890" && WA_NUMBER !== "") {
        const waText = `Halo, saya menghubungi Anda dari Website Portofolio.\n\n*Nama Lengkap:* ${name}\n*Email:* ${email}\n\n*Isi Pesan:*\n${message}`;
        const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;
        setTimeout(() => window.open(waUrl, '_blank'), 1000);
      }
    } catch (err: any) {
      showToast(err.message || "Gagal mengirim pesan.", true);
    } finally {
      hideLoader();
    }
  };

  const navLinks = [
    { href: '#home', icon: Home, label: 'Beranda' },
    { href: '#about', icon: User, label: 'Profil' },
    { href: '#subjects', icon: BookOpen, label: 'Matpel' },
    { href: '#projects', icon: Briefcase, label: 'Karya' },
    { href: '#gallery', icon: ImageIcon, label: 'Galeri' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 w-full">
      {/* Navbar */}
      <nav className="sticky top-0 z-[60] bg-white/90 backdrop-blur-xl border-b border-slate-200 w-full transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <span className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                {p.logoText || (p.name ? p.name.split(' ')[0] + '.' : 'Edukasi.')}
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link, i) => (
                <a key={i} href={link.href} className="group flex items-center justify-center bg-transparent hover:bg-indigo-50 rounded-full h-10 px-4 transition-all duration-300">
                  <link.icon className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                  <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 text-indigo-600 font-bold tracking-wide transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
                    {link.label}
                  </span>
                </a>
              ))}
              <div className="pl-4 ml-2 border-l border-slate-200 flex items-center gap-3">
                <a href="#contact" className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-full hover:bg-indigo-600 transition-colors inline-block text-sm">
                  Hubungi
                </a>
                <button onClick={() => switchView('login')} className="px-5 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-full hover:bg-indigo-100 transition-colors inline-block text-sm border border-indigo-100">
                  Admin CMS
                </button>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center lg:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-700 hover:text-indigo-600 p-2 bg-slate-100 rounded-xl transition-colors">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white absolute w-full shadow-2xl rounded-b-3xl border-t border-slate-100 overflow-hidden z-[60]"
            >
              <div className="px-4 py-6 flex flex-col space-y-2">
                {navLinks.map((link, i) => (
                  <a key={i} href={link.href} onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-bold transition-colors flex items-center gap-4">
                    <link.icon className="w-5 h-5 text-indigo-500" /> {link.label}
                  </a>
                ))}
                <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-2">
                  <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold text-center block hover:bg-indigo-700 transition-colors shadow-md">
                    Hubungi Saya
                  </a>
                  <button onClick={() => { setMobileMenuOpen(false); switchView('login'); }} className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-center block hover:bg-slate-200 transition-colors">
                    Panel Admin CMS
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow w-full">
        {/* Hero Section */}
        <section id="home" className="relative overflow-hidden bg-white py-20 lg:py-32 w-full">
          <div className="absolute top-0 left-[-5%] w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse pointer-events-none"></div>
          <div className="absolute top-0 right-[-5%] w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative inline-block mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-full blur-lg opacity-40"></div>
              <img src={p.photoUrl || 'https://via.placeholder.com/150'} alt="Profile" className="relative w-40 h-40 md:w-48 md:h-48 rounded-full mx-auto object-cover border-4 border-white shadow-xl ring-4 ring-indigo-50" />
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4"
            >
              {p.name || 'Nama Pendidik'}
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 font-extrabold mb-6"
            >
              {p.role || 'Profesi / Role'}
            </motion.p>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto text-lg text-slate-600 mb-10 leading-relaxed font-medium"
            >
              {p.heroText || 'Mendidik dengan hati, menginspirasi dengan karya.'}
            </motion.p>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <a href="#projects" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5 text-center">
                Lihat Portofolio
              </a>
              <a href="#about" className="bg-white text-slate-700 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 px-8 py-3.5 rounded-full font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 text-center">
                Kenali Saya
              </a>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-slate-50 border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-2 block">Profil Pendidik</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Tentang Saya</h2>
              <div className="w-16 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 mb-12">
              <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-line text-center font-medium">
                {p.bio || 'Deskripsi detail tentang diri saya.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Visi</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                  {p.visi || 'Belum ada data visi.'}
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Misi</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                  {p.misi || 'Belum ada data misi.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Subjects Section */}
        <section id="subjects" className="py-24 bg-white border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-2 block">Keahlian Mengajar</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Mata Pelajaran</h2>
              <div className="w-16 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {state.subjects.length === 0 ? (
                <p className="text-slate-500 text-center col-span-full font-medium py-10 border-2 border-dashed border-slate-200 rounded-2xl">Belum ada mata pelajaran.</p>
              ) : (
                state.subjects.map((sub: any) => (
                  <div key={sub.id} className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 flex items-start gap-5 hover:bg-white hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100">
                      <BookOpenCheck className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 mb-2">{sub.name}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium">{sub.desc}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-2 block">Hasil Dedikasi</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Portofolio Karya</h2>
              <div className="w-16 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {state.projects.length === 0 ? (
                <p className="text-slate-500 text-center col-span-full font-medium py-10 border-2 border-dashed border-slate-200 rounded-2xl">Belum ada portofolio.</p>
              ) : (
                state.projects.map((proj: any) => (
                  <div key={proj.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-xl transition-all flex flex-col">
                    <div className="relative overflow-hidden h-56">
                      <img src={proj.image} alt={proj.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                      <h3 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{proj.title}</h3>
                      <p className="text-slate-600 text-sm mb-6 leading-relaxed flex-1 font-medium">{proj.desc}</p>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 font-bold text-sm inline-flex items-center mt-auto bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors w-max">
                          Kunjungi Tautan <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-24 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-2 block">Dokumentasi</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Galeri Kegiatan</h2>
              <div className="w-16 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {state.galleries.length === 0 ? (
                <p className="text-slate-500 text-center col-span-full font-medium py-10 border-2 border-dashed border-slate-200 rounded-2xl">Belum ada foto.</p>
              ) : (
                state.galleries.map((gal: any) => (
                  <div key={gal.id} className="relative group rounded-3xl overflow-hidden break-inside-avoid border border-slate-200 bg-white">
                    <img src={gal.image} className="w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 text-white">
                      <h4 className="font-extrabold text-lg mb-1">{gal.title}</h4>
                      <p className="text-sm text-slate-200 font-medium">{gal.desc}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-indigo-600/20 filter blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-600/20 filter blur-3xl pointer-events-none"></div>
          
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Mari Berdiskusi</h2>
              <div className="w-16 h-1.5 bg-indigo-500 mx-auto rounded-full mb-6"></div>
              <p className="text-slate-400 text-lg font-medium">Tinggalkan pesan, saran, atau tawaran kerja sama.</p>
            </div>
            <form onSubmit={handleContactSubmit} className="bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Nama Lengkap</label>
                  <input type="text" name="name" required className="w-full px-5 py-3.5 bg-slate-900/50 text-white rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-medium placeholder-slate-500" placeholder="Nama Anda" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Email Anda</label>
                  <input type="email" name="email" required className="w-full px-5 py-3.5 bg-slate-900/50 text-white rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-medium placeholder-slate-500" placeholder="nama@email.com" />
                </div>
              </div>
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Pesan Anda</label>
                <textarea name="message" rows={4} required className="w-full px-5 py-4 bg-slate-900/50 text-white rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none font-medium placeholder-slate-500" placeholder="Tuliskan pesan..."></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-3 text-lg">
                <Send className="w-5 h-5" /> Kirim Pesan
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-black text-slate-400 py-10 text-center border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-6">
          <p className="font-medium text-sm">&copy; {new Date().getFullYear()} <span className="text-white font-bold">{p.name || 'Portofolio'}</span>. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
