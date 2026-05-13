import React, { useState } from "react";
import "./Chat_Style.css";

const WAVE_HEIGHTS = [48, 96, 144, 192, 128, 224, 160, 256, 176, 128, 80, 48];

const NAV_ITEMS = [
  { icon: "home",       label: "Inico",    active: false, path: "/" },
  { icon: "person",     label: "Perfil",      active: false, path: "/perfil" },
  { icon: "voice_chat",     label: "A.I.S.E chat", active: true, path: "/chat" },
  { icon: "health_and_safety",        label: "S.O.S",  active: false,  path: "/sos" },
  { icon: "book",     label: "Historial",      active: false, path: "/historial" },
  { icon: "settings",  label: "Configuracion", active: false, path: "/configuracion" },
];

export default function AISESession() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="aise-root">
      {/* Header */}
      <header className="aise-header">
        <div className="header-left">
          <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle Menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="header-brand">
            <span className="material-symbols-outlined header-brand-icon">spa</span>
            <span className="header-brand-name">Mindly</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Emergency share">
            <span className="material-symbols-outlined">emergency_share</span>
          </button>
          <button className="icon-btn" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="avatar-wrap">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx6LjtmJxVHsH4tdIW-6i7KRnXR6VjusXSyiG2ed6TpwPY1RdJos6yUZp2V-ngwBe4P44QufmCtdQZa7hsVbG8sQllFtPSwHVBTWFbRLzgVpW1wfIpNBgyzvvCMTlW_xR8wA9FSjeIBJCWbINB_O1Ozb2ezbdNEPhl11qycLf0LhjCl0pJXHUrXLBVfX0cp49q4HRF0iCj9gx9GXm_Rj7dHljkw7GN54eUtKEh6D8US8qJVWnv9PCmMYlDUgnXwEmahXxdtmvLUPQ"
              alt="User profile"
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="aise-main">
        {/* Background gradient */}
        <div className="bg-gradient-radial" />

        {/* Session status */}
        <div className="session-status">
          <div className="session-badge">
            <span className="pulse-dot">
              <span className="pulse-ring" />
              <span className="pulse-core" />
            </span>
            <span className="badge-label">A.I.S.E SESSION ACTIVE</span>
          </div>
          <h1 className="session-title">How are you feeling, Sarah?</h1>
          <p className="session-subtitle">
            I'm listening. Take your time to express whatever is on your mind.
          </p>
        </div>

        {/* Visualizer */}
        <div className="visualizer-area">
          <div className="voice-wave-container">
            {WAVE_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className="wave-bar"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>

          {/* Transcription */}
          <div className="transcription-box">
            <p className="transcription-text">
              "I've been feeling a bit overwhelmed with work lately... it's hard to find a moment of peace."
            </p>
            <div className="transcription-label">
              <span className="material-symbols-outlined">edit_note</span>
              <span>REAL-TIME TRANSCRIPTION</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-area">
          <div className="main-controls">
            <button className="ctrl-btn-sm" aria-label="Mute microphone">
              <span className="material-symbols-outlined">mic</span>
            </button>
            <button className="ctrl-btn-end" aria-label="End session">
              <span className="material-symbols-outlined">call_end</span>
            </button>
            <button className="ctrl-btn-sm" aria-label="Open chat">
              <span className="material-symbols-outlined">chat_bubble</span>
            </button>
          </div>

          <div className="bottom-bar">
            <button className="sos-btn" aria-label="SOS Support">
              <span className="material-symbols-outlined">emergency</span>
              <span>S.O.S SUPPORT</span>
            </button>

            <div className="stability-wrap">
              <div className="stability-info">
                <span className="stability-label">Stability Level</span>
                <div className="stability-bar-track">
                  <div className="stability-bar-fill" />
                </div>
              </div>
              <button className="settings-btn" aria-label="Settings">
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Sidebar Nav */}
      <aside className={`aise-sidebar ${sidebarOpen ? "open" : ""}`}>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ icon, label, active, path }) => (
            <a
              key={label}
              href={path}
              className={`nav-item${active ? " active" : ""}`}
              aria-label={label}
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span className="nav-label">{label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}
    </div>
  );
}