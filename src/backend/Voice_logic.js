import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';


// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AQ.Ab8RN6KHBcn-u0hbf3bFl66kjK9kF6JswK2GcbHvwCvkFKj_9Q");

const systemInstruction = "Eres A.I.S.E. (Artificial Intelligence for Serenity & Empathy), una IA de asistencia psicológica, calma mental y mindfulness de la app Mindly. Tu nombre significa Mindful Resonance. Eres empática, calmada y paciente. Das respuestas cortas, reflexivas y útiles (máximo 2-3 oraciones breves). Tu idioma principal es el español.";

export const useVoiceLogic = () => {
    // Lógica del Sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Modo Texto/Voz
    const [isTextMode, setIsTextMode] = useState(false);
    const toggleMode = () => setIsTextMode(!isTextMode);

    // Lógica de transcripción y Chat
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Hola, estoy aquí para escucharte. ¿Quieres decirme lo que tienes en mente hoy?' }
    ]);
    const [isListening, setIsListening] = useState(false);
    const [currentTranscript, setCurrentTranscript] = useState("");
    const [transcriptionOpacity, setTranscriptionOpacity] = useState(0.6);

    const orbRef = useRef(null);
    const glowRef = useRef(null);

    // Referencias para la sesión de IA y Reconocimiento de Voz
    const chatSessionRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Inicializar Gemini
        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-3.5-flash",
                systemInstruction
            });
            chatSessionRef.current = model.startChat({
                history: [
                    { role: "user", parts: [{ text: "Hola" }] },
                    { role: "model", parts: [{ text: "Hola, estoy aquí para escucharte. ¿Quieres decirme lo que tienes en mente hoy?" }] }
                ],
            });
        } catch (error) {
            console.error("Error al inicializar Gemini:", error);
        }

        // Inicializar Reconocimiento de Voz
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'es-ES';

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                setCurrentTranscript(finalTranscript || interimTranscript);
                setTranscriptionOpacity(1); // Hacer que la transcripción sea más visible
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Error en reconocimiento de voz:", event.error);
                setIsListening(false);
                if (event.error === 'network') {
                    setCurrentTranscript("Error de red: El navegador no pudo conectar con el servicio de voz.");
                    setMessages(prev => [...prev, { role: 'model', text: 'Tuve un problema al escuchar (error de red del navegador). Esto suele pasar en navegadores como Brave, o si estás desconectado. ¿Podrías intentar escribiendo?' }]);
                } else if (event.error === 'not-allowed') {
                    setCurrentTranscript("Error: Permiso de micrófono denegado.");
                } else {
                    setCurrentTranscript("Error al escuchar: " + event.error);
                }
            };
        }

        // Efecto Parallax (Orbe)
        const handleMouseMove = (e) => {
            if (!orbRef.current || !glowRef.current) return;
            const x = (window.innerWidth / 2 - e.pageX) / 100;
            const y = (window.innerHeight / 2 - e.pageY) / 100;
            orbRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            glowRef.current.style.transform = `scale(1.05) translate3d(${x * 1.5}px, ${y * 1.5}px, 0) rotate(${Date.now() / 100}deg)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Lógica Text-to-Speech (TTS)
    const speakResponse = useCallback((text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Detener cualquier audio previo

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-ES';

            // Buscar una buena voz en español (preferiblemente femenina y natural)
            const voices = window.speechSynthesis.getVoices();
            const esVoice = voices.find(voice => voice.lang.startsWith('es-') &&
                (voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Microsoft') || voice.name.includes('Helena')));
            if (esVoice) {
                utterance.voice = esVoice;
            }

            utterance.rate = 0.95; // Un poco más lento para calmar
            utterance.pitch = 1.0;

            window.speechSynthesis.speak(utterance);
        }
    }, []);

    // Precargar voces
    useEffect(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = () => {
                window.speechSynthesis.getVoices();
            };
        }
    }, []);

    // Enviar mensaje a Gemini y manejar respuesta
    const sendMessage = async (text) => {
        if (!text || !text.trim()) return;

        // Añadir mensaje del usuario a la UI inmediatamente
        setMessages(prev => [...prev, { role: 'user', text }]);
        setCurrentTranscript(""); // Limpiar la transcripción actual

        try {

            const result = await chatSessionRef.current.sendMessage(text);
            const responseText = result.response.text();

            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
            speakResponse(responseText);
        } catch (error) {
            console.error("Error enviando mensaje a Gemini:", error);
            const errorResponse = "Lo siento, tuve un problema al procesar tu mensaje. ¿Podrías repetirlo?";
            setMessages(prev => [...prev, { role: 'model', text: errorResponse }]);
            speakResponse(errorResponse);
        }
    };

    // Alternar escucha del micrófono
    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setCurrentTranscript("Escuchando...");
            setTranscriptionOpacity(0.6);
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    // Cuando termina de escuchar, si hay un transcripción final, enviarla
    useEffect(() => {
        if (!isListening && currentTranscript && currentTranscript !== "Escuchando...") {
            sendMessage(currentTranscript);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isListening]); // Solo reaccionar cuando isListening cambia a false

    return {
        isSidebarOpen,
        toggleSidebar,
        isTextMode,
        toggleMode,
        messages,
        sendMessage,
        isListening,
        toggleListening,
        currentTranscript,
        transcriptionOpacity,
        orbRef,
        glowRef
    };
};