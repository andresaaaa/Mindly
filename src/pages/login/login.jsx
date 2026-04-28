import React, { useState } from "react";
import "./login_style.css";
import { auth, googleProvider } from "../../firebaseConfig"; // Asegúrate de que esta ruta sea correcta


import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sesión iniciada:", userCredential.user);
      alert("¡Bienvenido!");
      navigate('/voiceChat');
      
    } catch (error) {
      // Aquí validas qué salió mal
      if (error.code === 'auth/invalid-credential') {
        alert("Credenciales incorrectas. Revisa tu correo o contraseña.");
      } else {
        alert("Error al iniciar sesión: " + error.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Sesión iniciada con Google:", result.user);
      alert("¡Bienvenido!");
      navigate('/voiceChat');
    } catch (error) {
      alert("Error al iniciar sesión con Google: " + error.message);
    }
  };

  return (
    <div className="mindly-root">
      {/* Header */}
      <header className="mindly-header">
        <div className="header-brand">
          <span className="material-symbols-outlined header-brand-icon">spa</span>
          <span className="header-brand-name">Mindly</span>
        </div>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Emergency share">
            <span className="material-symbols-outlined">emergency_share</span>
          </button>
          <button className="icon-btn" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mindly-main">
        <div className="main-grid">

          {/* Branding column */}
          <div className="branding-col">
            <h1 className="branding-heading">Return to your center.</h1>
            <p className="branding-sub">
              Join a community of 50,000+ individuals cultivating peace of mind
              through mindful journaling and breathwork.
            </p>
            <div className="trust-list">
              <div className="trust-item">
                <div className="trust-icon-wrap teal">
                  <span className="material-symbols-outlined">encrypted</span>
                </div>
                <span className="trust-label">End-to-end encrypted journals</span>
              </div>
              <div className="trust-item">
                <div className="trust-icon-wrap cyan">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <span className="trust-label">HIPAA compliant sanctuary</span>
              </div>
            </div>
            <div className="hero-image-wrap">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZjRYjRQIB7OJrunLmDq8lf8Izovjf9P_JtTbDcD7D7HRF4hmwB01bHSQji3zs1ldmXmOykQUCMlvibRT7p_LMy6H68IEsPfOjJHh7AfR-Vuc_p3dQu1rPEPrLt1wvylGmizU_S3kjoqh57Dn5AuMHreabfBGWE6qMz3XskrYlKlIcasJKX3ySMCkIChgOggspm1ONmii4UK5BbcTlrfxOF0w1nyR87SeSmI0C6oMzyMzh8JSSSclR_jD9z3s68Af9JdfgDUYJxXo"
                alt="Dreamy abstract landscape with soft pink and lavender clouds reflecting in a calm mountain lake at dawn"
              />
            </div>
          </div>

          {/* Auth Card */}
          <div className="auth-card">
            <div className="auth-card-header">
              <h2 className="auth-card-title">Welcome back</h2>
              <p className="auth-card-sub">Enter your details to continue your journey.</p>
            </div>

            <form className="auth-form" onSubmit={handleLogin}>
              <div className="field-group">
                <label className="field-label" htmlFor="email">Email Address</label>
                <input
                  className="text-input"
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="field-group">
                <div className="field-label-row">
                  <label className="field-label" htmlFor="password">Password</label>
                  <a className="forgot-link" href="#">Forgot?</a>
                </div>
                <input
                  className="text-input"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}

                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button className="submit-btn" type="submit">
                Continue
              </button>
            </form>

            <div className="divider-wrap">
              <div className="divider-line"><div /></div>
              <div className="divider-text">
                <span>Or continue with</span>
              </div>
            </div>

            <div className="social-grid">
              <button className="social-btn" type="button" onClick={handleGoogleLogin}>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMTthp3fJReo1Xr7YjId8h9rSPF952lZfEWewOf755rGgPuxWA0SnzuXUqibqysoMuO4rRlIFhn_2U2xb3ItC0uyfB2wWxuasNMObxMVkR8PLqPWNoS5qJNBtQEkHiqSbuFV7FuznQEjC8xpdSko8YpHn5vUe1HRLqohYyotgnxuiT8cysfLuUHDxZ1zEjnbyofr76a4tw4RfexAswkVecPQ_WsXWLRJhXcO8nEmJ7cYtl0HMFznxPxhVk_-qB8ggkuOq4zD7JeqM"
                  alt="Google"
                />
                <span>Google</span>
              </button>
              <button className="social-btn" type="button">
                <span className="material-symbols-outlined">ios</span>
                <span>Apple</span>
              </button>
            </div>

            <p className="signup-prompt">
              New to Mindly?{" "}
              <a className="signup-link" href="#">Create a sanctuary account</a>
            </p>

            <div className="privacy-note">
              <span className="material-symbols-outlined">shield_with_heart</span>
              <p className="privacy-text">
                Your privacy is our priority. We never sell your emotional data. Every entry is yours alone.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="mindly-footer">
        <div className="footer-inner">
          <div>
            <p className="footer-brand-name">Mindly</p>
            <p className="footer-copy">© 2024 Mindly Therapeutic. A sanctuary for your mind.</p>
          </div>
          <div className="footer-links">
            {["Philosophy", "Privacy Sanctuary", "Crisis Resources", "Contact Support"].map((l) => (
              <a key={l} className="footer-link" href="#">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LoginForm;
