import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import VoiceInterface from './Chat';
import * as VoiceLogic from '../../backend/Voice_logic.js';

// Mock de dependencias
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('firebase/auth', () => ({
  signOut: vi.fn(),
  getAuth: vi.fn(),
}));

vi.mock('../../firebaseConfig', () => ({
  auth: {},
}));

describe('Chat - Cambio de Modo Teclado/Voz', () => {
  it('should toggle between text and voice mode when the mode button is clicked', () => {
    // Espiar y mockear useVoiceLogic
    const toggleModeMock = vi.fn();
    vi.spyOn(VoiceLogic, 'useVoiceLogic').mockReturnValue({
      isSidebarOpen: false,
      toggleSidebar: vi.fn(),
      currentPhrase: 'Frase de prueba',
      transcriptionOpacity: 1,
      orbRef: { current: null },
      glowRef: { current: null },
      isTextMode: true, // Estado inicial mockeado
      toggleMode: toggleModeMock,
    });

    render(
      <BrowserRouter>
        <VoiceInterface />
      </BrowserRouter>
    );

    // Si isTextMode es true, el botón debería decir "MODO VOZ" (porque cambia hacia voz)
    // Según el componente: <span>{isTextMode ? 'MODO VOZ' : 'MODO TEXTO'}</span>
    const modeButton = screen.getByText('MODO VOZ');
    expect(modeButton).toBeInTheDocument();

    // Simular click en el botón de cambio de modo
    fireEvent.click(modeButton);

    // Verificar que la función toggleMode del hook se haya llamado
    expect(toggleModeMock).toHaveBeenCalledTimes(1);
  });

  it('should render "MODO TEXTO" when isTextMode is false', () => {
    vi.spyOn(VoiceLogic, 'useVoiceLogic').mockReturnValue({
      isSidebarOpen: false,
      toggleSidebar: vi.fn(),
      currentPhrase: 'Frase de prueba',
      transcriptionOpacity: 1,
      orbRef: { current: null },
      glowRef: { current: null },
      isTextMode: false, // Estado de voz
      toggleMode: vi.fn(),
    });

    render(
      <BrowserRouter>
        <VoiceInterface />
      </BrowserRouter>
    );

    // Verificar que muestre "MODO TEXTO"
    const modeButton = screen.getByText('MODO TEXTO');
    expect(modeButton).toBeInTheDocument();
  });
});
