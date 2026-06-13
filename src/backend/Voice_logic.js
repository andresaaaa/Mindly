import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { saveSession } from './SessionService';
import { getUserSettings } from './SettingsService';
import { auth } from '../firebaseConfig';


// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AQ.Ab8RN6Jeopa-6kF1u685ZQwj90hL615apFRgeVca7xTcdBKJuQ");

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
    
    // Inactivity timeout reference
    const inactivityTimeoutRef = useRef(null);
    const [isProcessingSummary, setIsProcessingSummary] = useState(false);
    const sessionStartTimeRef = useRef(Date.now());

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

            // Buscar una voz menos robótica (Google, Online, Natural)
            const voices = window.speechSynthesis.getVoices();
            let esVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Google') || v.name.includes('Online') || v.name.includes('Natural')));
            if (!esVoice) esVoice = voices.find(v => v.lang.startsWith('es') && v.name.includes('Microsoft'));
            if (!esVoice) esVoice = voices.find(v => v.lang.startsWith('es'));
            
            if (esVoice) {
                utterance.voice = esVoice;
            }

            utterance.rate = 1.0; // Velocidad normal para fluidez
            utterance.pitch = 1.1; // Tono más alto para sonar menos robótico

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

        resetInactivityTimer();

        // Añadir mensaje del usuario a la UI inmediatamente
        setMessages(prev => [...prev, { role: 'user', text }]);
        setCurrentTranscript(""); // Limpiar la transcripción actual

        // Chequear palabras clave de emergencia
        const textLower = text.toLowerCase();
        const emergencyKeywords = ["suicidar", "suicidio", "matar", "quitarme la vida", "no quiero vivir", "morir"];
        if (emergencyKeywords.some(keyword => textLower.includes(keyword))) {
            // Paso 1: Guiar la respiración para calmar
            const breathingResponse = "Detecto que estás pasando por un momento muy difícil. Antes de todo, necesito que respires conmigo. Inhala profundamente... mantén el aire... y exhala lentamente.";
            setMessages(prev => [...prev, { role: 'model', text: breathingResponse }]);
            speakResponse(breathingResponse);

            // Paso 2: Repetir respiración después de unos segundos
            setTimeout(() => {
                const breathingRepeat = "Muy bien. Una vez más: Inhala... mantén... exhala despacio. Tu seguridad es lo más importante. Voy a contactar ayuda de inmediato.";
                setMessages(prev => [...prev, { role: 'model', text: breathingRepeat }]);
                speakResponse(breathingRepeat);
            }, 8000);

            // Paso 3: Llamar a emergencias después de la guía de respiración
            const user = auth.currentUser;
            let emergencyNumber = "106";
            if (user) {
                try {
                    const identifier = user.email || user.uid;
                    const settings = await getUserSettings(identifier);
                    if (settings && settings.emergencyLine) {
                        emergencyNumber = settings.emergencyLine;
                    }
                } catch (e) { console.error("Error obteniendo número de emergencia:", e); }
            }
            
            setTimeout(() => {
                window.location.href = `tel:${emergencyNumber}`;
            }, 16000); // 16 segundos para que complete las dos respiraciones
            return;
        }

        try {

            const result = await chatSessionRef.current.sendMessage(text);
            const responseText = result.response.text();

            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
            speakResponse(responseText);
        } catch (error) {
            console.warn("Error enviando mensaje a Gemini, usando OpenRouter (Llama 3) como respaldo:", error);
            try {
                // Fallback to OpenRouter
                const llamaSystemInstruction = systemInstruction + " ESTÁ ESTRICTAMENTE PROHIBIDO HACER PREGUNTAS AL USUARIO. Bajo ninguna circunstancia uses signos de interrogación ni fomentes que el usuario siga hablando. Limítate a dar un consejo de apoyo o una sugerencia pasiva. Céntrate en dar apoyo psicológico.";
                const openRouterMessages = [
                    { role: 'system', content: llamaSystemInstruction },
                    ...messages.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.text })),
                    { role: 'user', content: text }
                ];
                
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer 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",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "model": "meta-llama/llama-3-8b-instruct",
                        "temperature": 0.4,
                        "messages": openRouterMessages
                    })
                });
                
                const data = await response.json();
                const responseText = data.choices[0].message.content;
                
                setMessages(prev => [...prev, { role: 'model', text: responseText }]);
                speakResponse(responseText);
            } catch (fallbackError) {
                console.error("Error en OpenRouter fallback:", fallbackError);
                const errorResponse = "Lo siento, tuve un problema al procesar tu mensaje. ¿Podrías repetirlo?";
                setMessages(prev => [...prev, { role: 'model', text: errorResponse }]);
                speakResponse(errorResponse);
            }
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
        resetInactivityTimer();
    };

    // --- End Session & Summarize Logic ---
    const endSession = async () => {
        if (isProcessingSummary) return; // Prevent multiple calls
        setIsProcessingSummary(true);

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        }

        try {
            // Generar el prompt con el historial
            const chatHistoryText = messages.map(m => `${m.role === 'user' ? 'Usuario' : 'AISE'}: ${m.text}`).join("\n");
            const prompt = `Analiza la siguiente transcripción de una sesión de apoyo psicológico.
Por favor, proporciona un breve resumen (2-3 líneas) de la sesión y determina la emoción principal sentida por el usuario.
Las opciones de emoción son exactamente: "Tranquilo", "Ansioso", "Feliz", "Introspectivo", "Agradecido", "Desahogo", "Neutral".
Devuelve la respuesta en formato JSON con la siguiente estructura: { "summary": "...", "emotion": "..." }

Transcripción:
${chatHistoryText}`;

            // Create a temporary model instance just for the summary to enforce JSON output
            const summaryModel = genAI.getGenerativeModel({
                model: "gemini-3.5-flash",
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "object",
                        properties: {
                            summary: { type: "string" },
                            emotion: { type: "string" }
                        },
                        required: ["summary", "emotion"]
                    }
                }
            });

            let responseText = "";
            try {
                const result = await summaryModel.generateContent(prompt);
                responseText = result.response.text();
            } catch (geminiError) {
                console.warn("Fallo resumen con Gemini, usando OpenRouter Llama 3:", geminiError);
                // Fallback para el resumen
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer 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",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "model": "meta-llama/llama-3-8b-instruct",
                        "temperature": 0.1,
                        "messages": [
                            { role: "system", content: "Devuelve solo un JSON válido con las claves 'summary' y 'emotion'. No escribas texto extra." },
                            { role: "user", content: prompt }
                        ]
                    })
                });
                const data = await response.json();
                responseText = data.choices[0].message.content;
            }
            
            // Try parsing JSON
            let summaryData = { summary: "Sesión completada.", emotion: "Neutral" };
            try {
                 const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
                 summaryData = JSON.parse(cleanedText);
            } catch (e) {
                 console.error("Failed to parse summary JSON", e);
            }

            // Determine duration
            const durationMs = Date.now() - sessionStartTimeRef.current;
            const minutes = Math.max(1, Math.round(durationMs / 60000));

            // Map emotion to colors
            const getMoodConfig = (emotion) => {
                switch(emotion) {
                    case 'Tranquilo': return { bg: "bg-secondary/10", text: "text-secondary", iconColor: "bg-secondary/20 text-secondary" };
                    case 'Ansioso': return { bg: "bg-red-100", text: "text-red-700", iconColor: "bg-red-200 text-red-700" };
                    case 'Feliz': return { bg: "bg-yellow-100", text: "text-yellow-700", iconColor: "bg-yellow-200 text-yellow-700" };
                    case 'Introspectivo': return { bg: "bg-primary/10", text: "text-primary", iconColor: "bg-primary/20 text-primary" };
                    case 'Agradecido': return { bg: "bg-green-100", text: "text-green-700", iconColor: "bg-green-200 text-green-700" };
                    case 'Desahogo': return { bg: "bg-purple-100", text: "text-purple-700", iconColor: "bg-purple-200 text-purple-700" };
                    case 'Neutral': return { bg: "bg-gray-100", text: "text-gray-600", iconColor: "bg-gray-200 text-gray-600" };
                    default: return { bg: "bg-neutral/10", text: "text-neutral", iconColor: "bg-neutral/20 text-neutral" };
                }
            };
            
            const moodConfig = getMoodConfig(summaryData.emotion);

            const sessionData = {
                title: `Sesión de ${summaryData.emotion}`,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                minutes: minutes,
                moods: [{ label: summaryData.emotion, bg: moodConfig.bg, text: moodConfig.text }],
                iconColor: moodConfig.iconColor,
                summary: summaryData.summary
            };

            const user = auth.currentUser;
            if (user) {
                const identifier = user.email || user.uid;
                await saveSession(identifier, sessionData);
                console.log("Sesión guardada en Firebase para el usuario:", identifier);
            } else {
                console.warn("No hay usuario logueado, no se pudo guardar la sesión.");
            }

            // Clear chat or notify UI that session ended. (You can navigate or show a success message here)
            // For now, we will add a system message.
            setMessages(prev => [...prev, { role: 'model', text: 'Sesión guardada exitosamente. Puedes revisar el resumen en Memory Lane.' }]);
            
        } catch (error) {
            console.error("Error terminando la sesión:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Error al intentar guardar el resumen de la sesión.' }]);
        } finally {
            setIsProcessingSummary(false);
            // Optionally, reset session start time for a new session
            sessionStartTimeRef.current = Date.now();
        }
    };

    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
        // Set 60 seconds timeout
        inactivityTimeoutRef.current = setTimeout(() => {
            console.log("Inactivity timeout reached, ending session...");
            endSession();
        }, 60000);
    }, [messages]); // Note: endSession relies on messages

    useEffect(() => {
        // Init timer when component mounts
        resetInactivityTimer();
        return () => {
            if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
        };
    }, [resetInactivityTimer]);

    const messagesRef = useRef(messages);
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Si la conversación tiene más del saludo inicial, termina la sesión al cambiar de pestaña
                if (messagesRef.current.length > 1) {
                    endSession();
                }
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    // Update reset inactivity timer to use messages properly
    // It's already in the dependency array of useCallback


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
        glowRef,
        endSession,
        isProcessingSummary
    };
};