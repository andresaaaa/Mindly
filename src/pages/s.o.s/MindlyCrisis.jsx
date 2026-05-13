import React, { useState } from "react";
import { Link } from "react-router-dom";  
import "./CrisisSOS.css";

const EMERGENCY_ACTIONS = [
  {
    variant: "danger",
    icon: "emergency",
    title: "Llamar a Emergencias",
    tag: "Atención inmediata",
  },
  {
    variant: "primary",
    icon: "contact_emergency",
    title: "Llamar a Contacto de Confianza",
    tag: "Red de apoyo",
  },
];

const FOOTER_LINKS = ["Chat de Crisis", "Centros Cercanos"];

const NAV_ITEMS = [
  { icon: "home",       label: "Inico",    active: false, path: "/" },
  { icon: "person",     label: "Perfil",      active: false, path: "/perfil" },
  { icon: "voice_chat",     label: "A.I.S.E chat", active: false, path: "/chat" },
  { icon: "health_and_safety",        label: "S.O.S",  active: true,  path: "/sos" },
  { icon: "book",     label: "Historial",      active: false, path: "/historial" },
  { icon: "settings",  label: "Configuracion", active: false, path: "/configuracion" },
];



export default function CrisisSOS() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className="crisis-root">
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
      <main className="crisis-main">

        {/* Heading */}
        <div className="crisis-heading">
          <h2 className="crisis-title">¿Cómo podemos ayudarte?</h2>
          <p className="crisis-subtitle">
            Estamos aquí contigo. Elige una opción o respira con nosotros.
          </p>
        </div>

        {/* Emergency Buttons */}
        <div className="emergency-grid">
          {EMERGENCY_ACTIONS.map(({ variant, icon, title, tag }) => (
            <button key={title} className={`emergency-btn ${variant}`}>
              <div className="emergency-btn-icon-wrap">
                <span className="material-symbols-outlined icon-filled">{icon}</span>
              </div>
              <p className="emergency-btn-title">{title}</p>
              <p className="emergency-btn-tag">{tag}</p>
            </button>
          ))}
        </div>

        {/* Breathing Exercise */}
        <div className="breathing-section">
          <div className="breathing-visual">
            <div className="ring-outer" />
            <div className="ring-middle" />
            <div className="breathing-circle">
              <span className="material-symbols-outlined icon-filled">air</span>
            </div>
          </div>
          <div className="breathing-text">
            <p className="breathing-cue">Inhala • Exhala</p>
            <p className="breathing-hint">Enfoca tu atención en el círculo</p>
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

      {/* Footer */}
      <footer className="crisis-footer">
        <div className="footer-inner">
          <div className="footer-protocol">
            <span className="material-symbols-outlined">verified_user</span>
            <span className="footer-protocol-label">Mindly Clinical Protocol v4.2</span>
          </div>
          <div className="footer-links">
            {FOOTER_LINKS.map((label) => (
              <a key={label} className="footer-link" href="#">
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
