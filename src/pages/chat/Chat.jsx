import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useVoiceLogic } from '../../backend/Voice_logic.js';
import './Chat_Style.css';


const VoiceInterface = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const {
    isSidebarOpen,
    toggleSidebar,
    currentPhrase,
    transcriptionOpacity,
    orbRef,
    glowRef
  } = useVoiceLogic();

  return (
    <div className="flex flex-col h-screen overflow-hidden text-on-surface bg-[#fff8f9] font-['Montserrat']">
      {/* Capa de fondo Aurora */}
      <div className="aurora-bg"></div>

      {/* Overlay y Sidebar */}
      <div
        className={`sidebar-overlay fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-400 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      ></div>

      <aside className={`sidebar-transition fixed top-0 left-0 h-full w-72 bg-white/80 backdrop-blur-xl z-50 shadow-2xl border-r border-primary/10 px-8 py-12 flex flex-col transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-12">
          <h2 className="font-headline-md text-headline-md text-primary tracking-widest">A.I.S.E.</h2>
          <p className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-neutral-custom/60">Mindful Resonance</p>
        </div>
        <nav className="flex flex-col gap-6">
          <button className="flex items-center gap-4 text-on-surface hover:text-primary transition-colors group" onClick={() => { toggleSidebar(); navigate('/dashboard'); }}>
            <span className="material-symbols-outlined text-[24px]">dashboard</span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </button>
          <button className="flex items-center gap-4 text-on-surface hover:text-primary transition-colors group" onClick={() => { toggleSidebar(); navigate('/dashboard'); }}>
            <span className="material-symbols-outlined text-[24px]">mood</span>
            <span className="font-label-md text-label-md">Mood</span>
          </button>
          <button className="flex items-center gap-4 text-on-surface hover:text-primary transition-colors group" onClick={() => { toggleSidebar(); navigate('/sos'); }}>
            <span className="material-symbols-outlined text-[24px]">air</span>
            <span className="font-label-md text-label-md">Breath</span>
          </button>
          <button className="flex items-center gap-4 text-on-surface hover:text-primary transition-colors group" onClick={() => { toggleSidebar(); navigate('/historial'); }}>
            <span className="material-symbols-outlined text-[24px]">edit_note</span>
            <span className="font-label-md text-label-md">Journal</span>
          </button>
          <button className="flex items-center gap-4 text-on-surface hover:text-primary transition-colors group mt-4" onClick={() => { toggleSidebar(); navigate('/dashboard'); }}>
            <span className="material-symbols-outlined text-[24px]">person</span>
            <span className="font-label-md text-label-md">Me</span>
          </button>
        </nav>
        <div className="mt-auto">
          <button className="flex items-center gap-3 text-error/70 hover:text-error transition-colors" onClick={handleLogout}>
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-label-md text-label-md">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Capa de Interfaz Principal */}
      <div className="relative z-10 flex flex-col h-full px-container-padding-mobile md:px-container-padding-desktop py-10">
        <header className="flex justify-between items-start w-full mb-auto">
          <button
            className="glass-button w-12 h-12 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary active:scale-95"
            onClick={toggleSidebar}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="text-center md:absolute md:left-1/2 md:-translate-x-1/2">
            <h1 className="font-headline-md text-headline-md text-primary opacity-80 tracking-widest hidden md:block">A.I.S.E.</h1>
            <p className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-neutral-custom/60 hidden md:block">Mindful Resonance</p>
          </div>
          <button className="glass-button px-6 h-12 flex items-center gap-3 rounded-full border-primary/20 text-primary hover:bg-primary/5 transition-colors" onClick={() => navigate('/sos')}>
            <span className="material-symbols-outlined text-[20px] text-error" style={{ fontVariationSettings: "'FILL' 1" }}>emergency_home</span>
            <span className="font-label-md text-label-md">S.O.S.</span>
          </button>
        </header>

        {/* Sección del Orbe y Voz */}
        <main className="flex-1 flex flex-col items-center justify-center relative">
          <div className="orb-container">
            <div ref={glowRef} className="vibrating-orb"></div>
            <div className="orb-ring"></div>
            <div ref={orbRef} className="orb-inner flex items-center justify-center">
              <div className="w-3 h-3 bg-primary/20 rounded-full animate-ping"></div>
            </div>
          </div>

          <div className="mt-16 max-w-lg text-center px-4">
            <p
              className="font-body-lg text-body-lg-mobile md:text-body-lg text-neutral-custom/60 italic leading-relaxed transition-opacity duration-1000"
              style={{ opacity: transcriptionOpacity }}
            >
              "{currentPhrase}"
            </p>
          </div>
        </main>

        <footer className="mt-auto flex justify-center pb-8">
          <button className="glass-button flex items-center gap-3 px-8 py-4 rounded-full text-primary font-label-md text-label-md group hover:bg-primary/5">
            <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">keyboard</span>
            MODO TEXTO
          </button>
        </footer>
      </div>

      {/* Elementos Decorativos */}
      <div className="fixed top-0 right-0 p-8 pointer-events-none opacity-20">
        <div className="w-32 h-32 border-t border-r border-outline-variant rounded-tr-3xl"></div>
      </div>
      <div className="fixed bottom-0 left-0 p-8 pointer-events-none opacity-20">
        <div className="w-32 h-32 border-b border-l border-outline-variant rounded-bl-3xl"></div>
      </div>
    </div>
  );
};

export default VoiceInterface;
