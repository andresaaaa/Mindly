import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./login.css";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sesión iniciada:", userCredential.user);
      alert("¡Bienvenido!");
      navigate('/chat');
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        alert("Credenciales incorrectas. Revisa tu correo o contraseña.");
      } else {
        alert("Error al iniciar sesión: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Sesión iniciada con Google:", result.user);
      alert("¡Bienvenido!");
      navigate('/chat');
    } catch (error) {
      alert("Error al iniciar sesión con Google: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <main className="login-card" role="main">
        <h1 className="text-4xl font-bold mb-1 text-[#E8A5CD]">Mindly</h1>
        <p className="text-sm mb-10 text-[#A0989B]">Tu santuario digital</p>

        <form id="loginForm" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Correo institucional</label>
            <div className="input-wrapper">
              <span className="material-icons-outlined">email</span>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <span className="material-icons-outlined">lock</span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="material-icons-outlined visibility"
                aria-hidden="true"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Acceder'}
          </button>
        </form>

        <div className="divider"><span>O</span></div>

        <button
          type="button"
          className="btn-google"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <img
            src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png"
            alt="Google"
            width="20"
          />
          Continuar con Google
        </button>

        <div className="mt-6 text-sm">
          <a href="#" className="text-[#A0989B] hover:text-[#7D7578]">Recuperar contraseña</a>
        </div>

        <div className="footer-links">
          ¿No tienes una cuenta? <a href="#">Crear Cuenta</a>
        </div>
      </main>

      <nav className="bottom-nav" aria-label="Pie de página">
        <span>© 2024 Mindly. Digital Sanctuary for your mind.</span>
        <div className="links" style={{ display: 'flex', gap: '0.75rem' }}>
          <a href="#" className="hover:underline">Privacidad</a>
          <a href="#" className="hover:underline">Términos</a>
          <a href="#" className="hover:underline">Ayuda</a>
        </div>
      </nav>
    </div>
  );
};

export default LoginForm;