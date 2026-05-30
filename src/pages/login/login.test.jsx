import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from './login';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Mock react-router-dom
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Mock firebase
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  getAuth: vi.fn(),
}));

vi.mock('../../firebaseConfig', () => ({
  auth: {},
}));

describe('Login Form - Integration Test', () => {
  it('should call signInWithEmailAndPassword and navigate on successful login', async () => {
    // Preparar el mock para que sea exitoso
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { email: 'test@example.com' }
    });

    // Mock de alert para evitar interrupciones en el test
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Correo institucional/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: /Acceder/i });

    // Simular escritura del usuario
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    // Enviar el formulario
    await userEvent.click(submitButton);

    // Verificar que el botón cambia de estado durante la carga (aunque sea muy rápido, waitFor ayuda a asertar el resultado final)
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, 'test@example.com', 'password123');
    });

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('¡Bienvenido!');
    });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/chat');
    });

    alertMock.mockRestore();
  });
});
