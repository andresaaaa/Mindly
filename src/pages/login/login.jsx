import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
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
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif", background: "#f9f9f9", color: "#1a1c1c" }}>
      
      {/* Header - exactamente igual */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-16" style={{ background: "rgba(255, 255, 255, 0.82)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(253, 231, 244, 0.5)", boxShadow: "0 1px 8px rgba(132, 76, 112, 0.06)" }}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ color: "#c97ab0", fontSize: "24px" }}>spa</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "24px", color: "#844c70", letterSpacing: "-0.01em" }}>Mindly</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full transition-all" style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }} aria-label="Emergency share">
            <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>emergency_share</span>
          </button>
          <button className="p-2 rounded-full transition-all" style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }} aria-label="Notifications">
            <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>notifications</span>
          </button>
        </div>
      </header>

      {/* Main - con el radial gradient exacto */}
      <main className="flex-1 flex items-center justify-center py-16 px-4" style={{ background: "radial-gradient(circle at top left, #ffd8ec 0%, #f9f9f9 40%, #b9eedb 100%)" }}>
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Branding Column - exactamente igual */}
          <div className="hidden md:flex flex-col gap-6 pr-8">
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "40px", lineHeight: "1.15", color: "#844c70", letterSpacing: "-0.02em", margin: 0 }}>
              Return to your center.
            </h1>
            <p style={{ fontSize: "17.6px", lineHeight: "1.7", color: "#50434a", maxWidth: "416px", margin: 0 }}>
              Join a community of 50,000+ individuals cultivating peace of mind
              through mindful journaling and breathwork.
            </p>
            <div className="flex flex-col gap-4 pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full" style={{ background: "rgba(144, 196, 178, 0.22)" }}>
                  <span className="material-symbols-outlined" style={{ color: "#366758", fontSize: "24px" }}>encrypted</span>
                </div>
                <span style={{ fontSize: "13.6px", fontWeight: 500, letterSpacing: "0.04em", color: "#50434a" }}>End-to-end encrypted journals</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full" style={{ background: "rgba(139, 239, 247, 0.22)" }}>
                  <span className="material-symbols-outlined" style={{ color: "#00696f", fontSize: "24px" }}>verified_user</span>
                </div>
                <span style={{ fontSize: "13.6px", fontWeight: 500, letterSpacing: "0.04em", color: "#50434a" }}>HIPAA compliant sanctuary</span>
              </div>
            </div>
            <div className="mt-8 rounded-2xl overflow-hidden shadow-2xl" style={{ transform: "rotate(1deg)" }}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZjRYjRQIB7OJrunLmDq8lf8Izovjf9P_JtTbDcD7D7HRF4hmwB01bHSQji3zs1ldmXmOykQUCMlvibRT7p_LMy6H68IEsPfOjJHh7AfR-Vuc_p3dQu1rPEPrLt1wvylGmizU_S3kjoqh57Dn5AuMHreabfBGWE6qMz3XskrYlKlIcasJKX3ySMCkIChgOggspm1ONmii4UK5BbcTlrfxOF0w1nyR87SeSmI0C6oMzyMzh8JSSSclR_jD9z3s68Af9JdfgDUYJxXo"
                alt="Dreamy abstract landscape"
                className="w-full h-48 object-cover block"
              />
            </div>
          </div>

          {/* Auth Card - exactamente igual */}
          <div style={{ background: "#ffffff", borderRadius: "24px", padding: "48px 40px", boxShadow: "0 8px 40px rgba(132, 76, 112, 0.08)", border: "1px solid rgba(211, 194, 201, 0.4)" }}>
            <div className="mb-8 text-center md:text-left">
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "32px", lineHeight: "1.2", color: "#1a1c1c", margin: "0 0 6.4px 0" }}>Welcome back</h2>
              <p style={{ fontSize: "16px", color: "#50434a", margin: 0 }}>Enter your details to continue your journey.</p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleLogin}>
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: "13.6px", fontWeight: 500, letterSpacing: "0.04em", color: "#50434a", paddingLeft: "4px" }} htmlFor="email">
                  Email Address
                </label>
                <input
                  style={{ width: "100%", height: "56px", padding: "0 16px", borderRadius: "16px", background: "#f8fafc", border: "1.5px solid transparent", outline: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "16px", color: "#1a1c1c", transition: "all 0.2s" }}
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) => { e.target.style.borderColor = "#844c70"; e.target.style.boxShadow = "0 0 0 4px rgba(232, 165, 205, 0.25)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center pl-1">
                  <label style={{ fontSize: "13.6px", fontWeight: 500, letterSpacing: "0.04em", color: "#50434a" }} htmlFor="password">
                    Password
                  </label>
                  <a style={{ fontSize: "13.6px", fontWeight: 600, color: "#844c70", textDecoration: "none" }} href="#">
                    Forgot?
                  </a>
                </div>
                <input
                  style={{ width: "100%", height: "56px", padding: "0 16px", borderRadius: "16px", background: "#f8fafc", border: "1.5px solid transparent", outline: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "16px", color: "#1a1c1c", transition: "all 0.2s" }}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => { e.target.style.borderColor = "#844c70"; e.target.style.boxShadow = "0 0 0 4px rgba(232, 165, 205, 0.25)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <button
                style={{ height: "56px", background: "#844c70", color: "white", fontFamily: "'DM Serif Display', serif", fontSize: "20px", letterSpacing: "0.01em", border: "none", borderRadius: "16px", cursor: "pointer", boxShadow: "0 6px 20px rgba(132, 76, 112, 0.25)", transition: "all 0.25s" }}
                type="submit"
                onMouseEnter={(e) => { e.target.style.transform = "scale(1.015)"; e.target.style.boxShadow = "0 10px 28px rgba(132, 76, 112, 0.3)"; }}
                onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 6px 20px rgba(132, 76, 112, 0.25)"; }}
                onMouseDown={(e) => { e.target.style.transform = "scale(0.96)"; }}
                onMouseUp={(e) => { e.target.style.transform = "scale(1.015)"; }}
              >
                Continue
              </button>
            </form>

            {/* Divider - exactamente igual */}
            <div style={{ position: "relative", margin: "32px 0" }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
                <div style={{ width: "100%", borderTop: "1px solid #e2e2e2" }}></div>
              </div>
              <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                <span style={{ background: "#ffffff", padding: "0 16px", fontSize: "13.6px", letterSpacing: "0.04em", color: "#50434a" }}>Or continue with</span>
              </div>
            </div>

            {/* Social Buttons - exactamente igual */}
            <div className="grid grid-cols-2 gap-4">
              <button
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", height: "56px", border: "1.5px solid #d3c2c9", borderRadius: "16px", background: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "13.6px", fontWeight: 500, color: "#1a1c1c", transition: "all 0.15s", letterSpacing: "0.03em" }}
                type="button"
                onClick={handleGoogleLogin}
                onMouseEnter={(e) => { e.target.style.background = "#f8f0f5"; }}
                onMouseLeave={(e) => { e.target.style.background = "none"; }}
                onMouseDown={(e) => { e.target.style.transform = "scale(0.96)"; }}
                onMouseUp={(e) => { e.target.style.transform = "scale(1)"; }}
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMTthp3fJReo1Xr7YjId8h9rSPF952lZfEWewOf755rGgPuxWA0SnzuXUqibqysoMuO4rRlIFhn_2U2xb3ItC0uyfB2wWxuasNMObxMVkR8PLqPWNoS5qJNBtQEkHiqSbuFV7FuznQEjC8xpdSko8YpHn5vUe1HRLqohYyotgnxuiT8cysfLuUHDxZ1zEjnbyofr76a4tw4RfexAswkVecPQ_WsXWLRJhXcO8nEmJ7cYtl0HMFznxPxhVk_-qB8ggkuOq4zD7JeqM"
                  alt="Google"
                  style={{ width: "20px", height: "20px" }}
                />
                <span>Google</span>
              </button>
              <button
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", height: "56px", border: "1.5px solid #d3c2c9", borderRadius: "16px", background: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "13.6px", fontWeight: 500, color: "#1a1c1c", transition: "all 0.15s", letterSpacing: "0.03em" }}
                type="button"
                onMouseEnter={(e) => { e.target.style.background = "#f8f0f5"; }}
                onMouseLeave={(e) => { e.target.style.background = "none"; }}
                onMouseDown={(e) => { e.target.style.transform = "scale(0.96)"; }}
                onMouseUp={(e) => { e.target.style.transform = "scale(1)"; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>ios</span>
                <span>Apple</span>
              </button>
            </div>

            <p style={{ marginTop: "40px", textAlign: "center", fontSize: "13.6px", color: "#50434a", letterSpacing: "0.03em" }}>
              New to Mindly?{" "}
              <a style={{ color: "#844c70", fontWeight: 700, textDecoration: "none" }} href="#">Create a sanctuary account</a>
            </p>

            <div style={{ marginTop: "32px", paddingTop: "32px", borderTop: "1px solid rgba(211, 194, 201, 0.25)", display: "flex", gap: "12px" }}>
              <span className="material-symbols-outlined" style={{ color: "#366758", fontSize: "17.6px", flexShrink: 0, marginTop: "0.8px" }}>shield_with_heart</span>
              <p style={{ fontSize: "12px", lineHeight: "1.6", color: "rgba(80, 67, 74, 0.65)", fontStyle: "italic", margin: 0 }}>
                Your privacy is our priority. We never sell your emotional data. Every entry is yours alone.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - exactamente igual */}
      <footer style={{ background: "#f8fafc", borderTop: "1px solid #fce7f6", padding: "48px 32px", width: "100%" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:justify-between gap-6">
          <div>
            <p style={{ fontFamily: "'DM Serif Display', serif", color: "#d0a0bf", fontSize: "17.6px", margin: "0 0 4px 0" }}>Mindly</p>
            <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>© 2024 Mindly Therapeutic. A sanctuary for your mind.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {["Philosophy", "Privacy Sanctuary", "Crisis Resources", "Contact Support"].map((l) => (
              <a key={l} style={{ fontSize: "12px", color: "#94a3b8", textDecoration: "none", transition: "color 0.15s" }} href="#">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Estilos para hover de los links del footer */}
      <style>{`
        footer a:hover { color: #c97ab0 !important; }
        .forgot-link:hover { text-decoration: underline !important; }
        .signup-link:hover { text-decoration: underline !important; }
      `}</style>
    </div>
  );
};

export default LoginForm;