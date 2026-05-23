/**
 * EmergencyMode.jsx — Mindly
 *
 * Conversión 1:1 del HTML original a React + Tailwind CSS.
 * Se expande la lógica JS original con:
 *   - Ciclo de respiración completo (Inhala → Mantén → Exhala → Pausa)
 *   - Timer de sesión de emergencia
 *   - Lógica de llamada simulada con confirmación modal
 *   - Gestión de contacto de confianza
 *   - Accesibilidad (aria-live para el texto de respiración)
 *
 * Props esperados (todos opcionales con defaults):
 *   userName          – nombre del usuario (string)
 *   trustedContact    – { name: string, phone: string }
 *   onCallEmergency   – callback al confirmar llamada a emergencias
 *   onCallContact     – callback al confirmar llamada al contacto
 *   onNavigate        – callback(route: string) para la navegación
 */

import { useState, useEffect, useRef, useCallback } from "react";
import "./crisisSoS.css";

// ─── Constantes ──────────────────────────────────────────────────────────────

/** Fases del ciclo de respiración (duraciones en ms) */
const BREATH_PHASES = [
  { label: "Inhala", duration: 4000, color: "text-white" },
  { label: "Mantén", duration: 4000, color: "text-white/80" },
  { label: "Exhala", duration: 6000, color: "text-white" },
  { label: "Pausa", duration: 2000, color: "text-white/60" },
];

/** Recursos de apoyo (extensible fácilmente) */
const RESOURCES = [
  { icon: "forum", label: "Chat de Crisis", href: "#chat-crisis" },
  { icon: "map", label: "Centros Cercanos", href: "#centros" },
  { icon: "menu_book", label: "Protocolo Clínico Mindly v4.2", href: "#protocolo" },
];

/** Rutas del sidebar */
const SIDEBAR_LINKS = [
  { icon: "dashboard", label: "Dashboard", route: "dashboard", active: false },
  { icon: "mood", label: "Mood", route: "mood", active: false },
  { icon: "air", label: "Breath", route: "breath", active: true, filled: true },
  { icon: "edit_note", label: "Journal", route: "journal", active: false },
  { icon: "person", label: "Me", route: "me", active: false },
];

/** Rutas del bottom nav (móvil) */
const BOTTOM_NAV = [
  { icon: "dashboard", label: "Dashboard", route: "dashboard" },
  { icon: "bubble_chart", label: "Mindly AI", route: "ai" },
  { icon: "history", label: "History", route: "history" },
  { icon: "emergency_home", label: "SOS", route: "sos", active: true, filled: true },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Formatea segundos como mm:ss */
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

/** Modal de confirmación para llamadas */
function ConfirmModal({ isOpen, onConfirm, onCancel, title, description, confirmLabel, cancelLabel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] flex items-center justify-center px-container-padding-mobile">
      <div className="shadow-mindly bg-surface rounded-xl p-8 max-w-sm w-full text-center">
        <span
          className="material-symbols-outlined text-[48px] text-error mb-4 block filled"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          emergency
        </span>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">{title}</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8">{description}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="pulse-soft w-full bg-error text-on-error font-label-md text-label-md rounded-full py-4 uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-surface-container text-on-surface-variant font-label-md text-label-md rounded-full py-4 uppercase tracking-wider hover:bg-surface-container-high transition-colors"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function EmergencyMode({
  userName = "Usuario",
  trustedContact = { name: "Contacto de Confianza", phone: "tel:+1234567890" },
  onCallEmergency,
  onCallContact,
  onNavigate,
}) {
  // ── Estado del sidebar ──────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Estado del modal de confirmación ───────────────────────────────────
  const [modal, setModal] = useState(null); // null | "emergency" | "contact"

  // ── Estado del ciclo de respiración ────────────────────────────────────
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [breathVisible, setBreathVisible] = useState(true);
  const phaseRef = useRef(phaseIndex);
  phaseRef.current = phaseIndex;

  // ── Timer de sesión de emergencia ──────────────────────────────────────
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // ── Ciclo de respiración completo ──────────────────────────────────────
  useEffect(() => {
    let timeout;

    function advancePhase() {
      // Fade out
      setBreathVisible(false);
      setTimeout(() => {
        const next = (phaseRef.current + 1) % BREATH_PHASES.length;
        setPhaseIndex(next);
        setBreathVisible(true);
        // Siguiente fase tras su duración
        timeout = setTimeout(advancePhase, BREATH_PHASES[next].duration);
      }, 800); // duración del fade
    }

    // Primera fase comienza tras su propia duración
    timeout = setTimeout(advancePhase, BREATH_PHASES[0].duration);
    return () => clearTimeout(timeout);
  }, []); // se ejecuta sólo al montar

  // ── Timer de sesión ────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Lógica del sidebar ─────────────────────────────────────────────────
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  // Cerrar sidebar con Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") closeSidebar(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [closeSidebar]);

  // Bloquear scroll del body cuando el sidebar está abierto
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  // ── Lógica de llamadas ─────────────────────────────────────────────────
  const handleConfirmCall = () => {
    if (modal === "emergency") {
      onCallEmergency ? onCallEmergency() : (window.location.href = "tel:106");
    } else if (modal === "contact") {
      onCallContact ? onCallContact() : (window.location.href = trustedContact.phone);
    }
    setModal(null);
  };

  const modalConfig = {
    emergency: {
      title: "¿Llamar a Emergencias?",
      description: "Se marcará la línea 106. Úsalo sólo si tú o alguien está en peligro inmediato.",
      confirmLabel: "Sí, llamar ahora",
      cancelLabel: "Cancelar",
    },
    contact: {
      title: `¿Llamar a ${trustedContact.name}?`,
      description: "Se iniciará una llamada a tu contacto de confianza.",
      confirmLabel: "Sí, llamar",
      cancelLabel: "Cancelar",
    },
  };

  const currentPhase = BREATH_PHASES[phaseIndex];

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="mindly-bg font-body-md text-on-surface overflow-x-hidden">

      {/* ── Modal de confirmación ── */}
      <ConfirmModal
        isOpen={!!modal}
        onConfirm={handleConfirmCall}
        onCancel={() => setModal(null)}
        {...(modal ? modalConfig[modal] : {})}
      />

      {/* ── Sidebar Overlay ── */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* ── Sidebar Drawer ── */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 h-full w-72 bg-surface z-[70] shadow-2xl border-r border-outline-variant/30 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        aria-label="Menú principal"
      >
        {/* Logo */}
        <div className="p-8 flex items-center space-x-3 border-b border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
          <span className="font-headline-sm text-primary font-bold">Mindly</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-8 px-4 space-y-2">
          {SIDEBAR_LINKS.map((link) => (
            <button
              key={link.route}
              onClick={() => { onNavigate?.(link.route); closeSidebar(); }}
              className={`w-full flex items-center space-x-4 p-4 rounded-full transition-colors group text-left ${link.active
                ? "bg-primary-container/20 text-primary"
                : "text-on-surface-variant hover:bg-primary-container/10"
                }`}
            >
              <span
                className="material-symbols-outlined group-hover:text-primary"
                style={link.filled ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {link.icon}
              </span>
              <span className={`font-label-md ${link.active ? "font-bold" : ""}`}>{link.label}</span>
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="p-8 border-t border-outline-variant/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border border-outline-variant">
              <span className="material-symbols-outlined text-on-surface-variant">person</span>
            </div>
            <div>
              <p className="font-label-md text-on-surface">{userName}</p>
              <p className="text-[10px] text-outline uppercase tracking-wider">Plan Premium</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── TopNavBar ── */}
      <header className="sticky top-0 w-full z-50 bg-surface/80 backdrop-blur-lg border-b border-outline-variant/20">
        <nav className="flex justify-between items-center w-full px-container-padding-mobile md:px-container-padding-desktop max-w-7xl mx-auto h-16">
          {/* Left: menu + logo */}
          <div className="flex items-center space-x-4">
            <button
              aria-label="Abrir menú"
              className="p-2 hover:bg-surface-container rounded-full transition-colors"
              onClick={openSidebar}
            >
              <span className="material-symbols-outlined text-on-surface-variant">menu</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
              <span className="font-headline-sm text-headline-sm font-bold text-primary">Mindly</span>
            </div>
          </div>

          {/* Right: session timer + icons + avatar */}
          <div className="flex items-center space-x-4">
            {/* Timer de sesión */}
            <span
              className="hidden sm:inline font-label-sm text-label-sm text-outline tabular-nums"
              title="Tiempo en modo emergencia"
            >
              {formatTime(sessionSeconds)}
            </span>

            <button
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Sensores"
            >
              <span className="material-symbols-outlined">sensors</span>
            </button>
            <button
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Notificaciones"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant overflow-hidden">
              <div className="w-full h-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container text-sm">person</span>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 pt-6 pb-20">

        {/* Emergency Label */}
        <div className="flex justify-center mb-6">
          <div className="pulse-soft bg-error/10 text-error px-4 py-2 rounded-full flex items-center space-x-2">
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              emergency
            </span>
            <span className="font-label-md text-xs font-bold tracking-widest uppercase">
              MODO DE EMERGENCIA
            </span>
          </div>
        </div>

        {/* ── Primary Action Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Llamar a Emergencias */}
          <button
            onClick={() => setModal("emergency")}
            className="shadow-mindly bg-[#fbe0e0] p-6 rounded-xl flex flex-col items-center text-center group hover:scale-[1.02] transition-all duration-300 press-scale card-enter"
          >
            <div className="w-14 h-14 bg-white/40 rounded-full flex items-center justify-center mb-4">
              <span
                className="material-symbols-outlined text-[32px] text-[#93000a]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                emergency
              </span>
            </div>
            <h2 className="font-label-md text-[15px] font-semibold text-[#93000a] mb-1">
              Llamar a Emergencias (Línea 106)
            </h2>
            <span className="text-[11px] text-[#93000a] font-bold tracking-wider uppercase">
              ATENCIÓN INMEDIATA
            </span>
          </button>

          {/* Llamar a Contacto de Confianza */}
          <button
            onClick={() => setModal("contact")}
            className="shadow-mindly bg-[#e9a9d2] p-6 rounded-xl flex flex-col items-center text-center group hover:scale-[1.02] transition-all duration-300 press-scale card-enter"
          >
            <div className="w-14 h-14 bg-white/40 rounded-full flex items-center justify-center mb-4">
              <span
                className="material-symbols-outlined text-[32px] text-[#36092a]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                assignment_ind
              </span>
            </div>
            <h2 className="font-label-md text-[15px] font-semibold text-[#36092a] mb-1">
              Llamar a {trustedContact.name}
            </h2>
            <span className="text-[11px] text-[#36092a]/70 font-bold tracking-wider uppercase">
              RED DE APOYO
            </span>
          </button>
        </div>

        {/* ── Breathing Feature ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative flex items-center justify-center w-44 h-44 md:w-56 md:h-56">

            {/* Outer glow */}
            <div className="absolute inset-0 bg-primary-container/20 rounded-full blur-3xl aurora-pulse" />

            {/* Breathing circle */}
            <div className="breathing-circle w-32 h-32 md:w-40 md:h-40 rounded-full btn-gradient-primary flex items-center justify-center shadow-lg relative z-10">
              <div className="w-[90%] h-[90%] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <span
                  id="breath-text"
                  className={`font-label-md text-sm text-white font-bold breath-text-transition ${breathVisible ? "opacity-100" : "opacity-0"
                    }`}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {currentPhase.label}
                </span>
              </div>
            </div>
          </div>

          {/* Indicador de fase (barra de progreso) */}
          <div className="flex space-x-2 mt-4">
            {BREATH_PHASES.map((phase, i) => (
              <div
                key={phase.label}
                className={`h-1.5 rounded-full transition-all duration-500 breath-phase-indicator ${i === phaseIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-outline-variant"
                  }`}
                title={phase.label}
              />
            ))}
          </div>

          <p className="mt-4 text-sm text-on-surface-variant max-w-sm text-center">
            Sigue el ritmo del círculo para calmar tu respiración.
          </p>
        </div>

        {/* ── Crisis Resources ── */}
        <div className="shadow-mindly bg-surface-container-low rounded-lg p-5">
          <h3 className="font-label-md text-xs text-primary mb-4 uppercase tracking-widest">
            Recursos de Apoyo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {RESOURCES.map((res) => (
              <a
                key={res.href}
                href={res.href}
                className="flex items-center space-x-3 p-3 rounded-xl bg-white hover:bg-primary-container/10 transition-colors group border border-outline-variant/30 press-scale"
                onClick={(e) => { e.preventDefault(); onNavigate?.(res.href.replace("#", "")); }}
              >
                <span className="material-symbols-outlined text-primary">{res.icon}</span>
                <span className="font-label-md text-label-md text-left">{res.label}</span>
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full bg-surface-container-low py-section-gap border-t border-outline-variant/30 px-container-padding-mobile md:px-container-padding-desktop">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="font-headline-sm text-headline-sm text-primary">Mindly</div>
          <div className="flex space-x-6">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacidad</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Términos</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Contacto</a>
          </div>
          <div className="font-label-sm text-label-sm text-outline">
            © 2024 Mindly. Digital Sanctuary for your mind.
          </div>
        </div>
      </footer>

      {/* ── Bottom Nav (móvil) ── */}
      <nav
        className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-surface/90 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.04)] rounded-t-xl"
        aria-label="Navegación principal"
      >
        {BOTTOM_NAV.map((item) => (
          <button
            key={item.route}
            onClick={() => onNavigate?.(item.route)}
            className={`flex flex-col items-center justify-center px-5 py-1.5 cursor-pointer transition-colors ${item.active
              ? "bg-primary-container text-on-primary-container rounded-full"
              : "text-on-surface-variant"
              }`}
          >
            <span
              className="material-symbols-outlined"
              style={item.filled ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="font-label-sm text-[10px]">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

