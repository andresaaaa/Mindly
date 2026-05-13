import React, { useState, useEffect, useCallback } from 'react';
import "./global.css";
import "./tailwind.config.js";

const CrisisScreen = () => {
  const [breathingState, setBreathingState] = useState('inhale');
  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(0.6);

  // Animación de respiración
  const animateBreathing = useCallback(() => {
    if (breathingState === 'inhale') {
      setScale(1.5);
      setOpacity(1);
      setBreathingState('exhale');
    } else {
      setScale(1);
      setOpacity(0.6);
      setBreathingState('inhale');
    }
  }, [breathingState]);

  useEffect(() => {
    const interval = setInterval(animateBreathing, 4000);
    return () => clearInterval(interval);
  }, [animateBreathing]);

  // Handlers para botones de emergencia
  const handleEmergencyCall = () => {
    // Aquí iría la lógica para llamar a emergencias
    console.log('Llamando a emergencias...');
    // En una app real: window.location.href = 'tel:911';
  };

  const handleTrustedContactCall = () => {
    // Aquí iría la lógica para llamar a contacto de confianza
    console.log('Llamando a contacto de confianza...');
    // En una app real: window.location.href = 'tel:+1234567890';
  };

  const handleGoBack = () => {
    // Lógica para navegar hacia atrás
    console.log('Navegando hacia atrás...');
    // En React Router: navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-bright text-on-surface font-body-md">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-[0_8px_32px_0_rgba(232,165,205,0.1)] flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleGoBack}
            className="text-slate-500 hover:opacity-80 transition-opacity duration-300"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-2xl font-light tracking-widest text-pink-400 uppercase font-['Inter']">
            Mindly
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-pink-300">emergency_home</span>
          <span className="font-['Inter'] tracking-tight text-pink-300 font-medium">SOS</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-gutter pt-xl pb-md gap-lg">
        {/* Main Crisis Content */}
        <div className="w-full max-w-lg space-y-md text-center">
          <h2 className="font-h2 text-h2 text-on-surface-variant mb-base">
            ¿Cómo podemos ayudarte?
          </h2>
          <p className="font-body-lg text-body-lg text-outline mb-lg">
            Estamos aquí contigo. Elige una opción o respira con nosotros.
          </p>
        </div>

        {/* Emergency Buttons Group */}
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-md px-base">
          <button 
            onClick={handleEmergencyCall}
            className="flex flex-col items-center justify-center p-xl rounded-xl bg-error-container text-on-error-container shadow-[0_10px_40px_rgba(186,26,26,0.1)] hover:opacity-90 transition-all duration-300 ease-out active:scale-95 group border border-error/10"
          >
            <div className="bg-white/40 p-md rounded-full mb-md group-hover:scale-110 transition-transform">
              <span 
                className="material-symbols-outlined text-[48px]" 
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                emergency
              </span>
            </div>
            <span className="font-h3 text-h3 tracking-tight">Llamar a Emergencias</span>
            <span className="font-label-sm text-label-sm mt-base opacity-80 uppercase tracking-widest">
              Atención inmediata
            </span>
          </button>

          <button 
            onClick={handleTrustedContactCall}
            className="flex flex-col items-center justify-center p-xl rounded-xl bg-primary-container text-on-primary-container shadow-[0_10px_40px_rgba(232,165,205,0.15)] hover:opacity-90 transition-all duration-300 ease-out active:scale-95 group border border-white/20"
          >
            <div className="bg-white/40 p-md rounded-full mb-md group-hover:scale-110 transition-transform">
              <span 
                className="material-symbols-outlined text-[48px]" 
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                contact_emergency
              </span>
            </div>
            <span className="font-h3 text-h3 tracking-tight">Llamar a Contacto de Confianza</span>
            <span className="font-label-sm text-label-sm mt-base opacity-80 uppercase tracking-widest">
              Red de apoyo
            </span>
          </button>
        </div>

        {/* Breathing Exercise Section */}
        <div className="mt-xl flex flex-col items-center justify-center space-y-lg w-full max-w-lg">
          <div className="relative flex items-center justify-center">
            {/* Outer Ring */}
            <div className="absolute w-48 h-48 rounded-full border-2 border-primary-container/30"></div>
            {/* Middle Ring */}
            <div className="absolute w-64 h-64 rounded-full border border-secondary-container/20"></div>
            {/* Animated Circle */}
            <div 
              className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary-container to-secondary-container shadow-[0_0_50px_rgba(232,165,205,0.4)] flex items-center justify-center transition-all duration-[4000ms] ease-in-out"
              style={{ 
                transform: `scale(${scale})`,
                opacity: opacity
              }}
            >
              <span 
                className="material-symbols-outlined text-white text-4xl" 
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                air
              </span>
            </div>
          </div>
          <div className="text-center space-y-xs">
            <p className="font-label-sm text-label-sm text-primary uppercase tracking-[0.2em] font-bold">
              {breathingState === 'inhale' ? 'Inhala' : 'Exhala'} • {breathingState === 'inhale' ? 'Inhala' : 'Exhala'}
            </p>
            <p className="font-body-md text-body-md text-outline italic">
              Enfoca tu atención en el círculo
            </p>
          </div>
        </div>
      </main>

      {/* Support Footer */}
      <footer className="w-full py-lg px-gutter bg-surface-container-low/50 backdrop-blur-sm mt-auto">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-tertiary">verified_user</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Mindly Clinical Protocol v4.2
            </span>
          </div>
          <div className="flex gap-lg">
            <a 
              href="#" 
              className="text-primary font-label-sm hover:underline"
              onClick={(e) => {
                e.preventDefault();
                console.log('Abrir chat de crisis...');
              }}
            >
              Chat de Crisis
            </a>
            <a 
              href="#" 
              className="text-primary font-label-sm hover:underline"
              onClick={(e) => {
                e.preventDefault();
                console.log('Buscar centros cercanos...');
              }}
            >
              Centros Cercanos
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Si necesitas exportar también los estilos globales
export const GlobalStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
    
    body {
      font-family: 'Inter', sans-serif;
    }
  `}</style>
);

export default CrisisScreen;