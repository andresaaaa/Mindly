import { useState, useEffect, useRef } from 'react';

const phrases = [
    "Te escucho... tómate el tiempo que necesites.",
    "Esa sensación es válida, vamos a procesarla juntos.",
    "Imagina una luz suave que recorre tu cuerpo ahora.",
    "¿Qué palabra describe mejor tu estado actual?"
];

export const useVoiceLogic = () => {
    // Lógica del Sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Lógica de la transcripción
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [transcriptionOpacity, setTranscriptionOpacity] = useState(0.6);

    useEffect(() => {
        const interval = setInterval(() => {
            setTranscriptionOpacity(0);

            setTimeout(() => {
                setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
                setTranscriptionOpacity(0.6);
            }, 1000);

        }, 6000);

        return () => clearInterval(interval);
    }, []);

    // Lógica del efecto Parallax (Orbe)
    const orbRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!orbRef.current || !glowRef.current) return;

            const x = (window.innerWidth / 2 - e.pageX) / 100;
            const y = (window.innerHeight / 2 - e.pageY) / 100;

            // Actualizamos los estilos directamente vía ref para no re-renderizar todo el componente
            orbRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            glowRef.current.style.transform = `scale(1.05) translate3d(${x * 1.5}px, ${y * 1.5}px, 0) rotate(${Date.now() / 100}deg)`;
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return {
        isSidebarOpen,
        toggleSidebar,
        currentPhrase: phrases[phraseIndex],
        transcriptionOpacity,
        orbRef,
        glowRef
    };
};