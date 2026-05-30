import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import MindlyDashboard from './dashboard';

// Mock de useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('MindlyDashboard - Sidebar Unit Test', () => {
  it('should render the sidebar links and toggle the sidebar visibility', () => {
    render(
      <BrowserRouter>
        <MindlyDashboard />
      </BrowserRouter>
    );

    // Verificar que los enlaces del Sidebar (SIDEBAR_LINKS) estén en el documento
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Mood')).toBeInTheDocument();
    expect(screen.getByText('Breath')).toBeInTheDocument();
    expect(screen.getByText('Journal')).toBeInTheDocument();

    // El drawer del sidebar tiene la clase '-translate-x-full' cuando está cerrado
    const sidebarDrawer = screen.getByLabelText('Menú principal');
    expect(sidebarDrawer.className).toContain('-translate-x-full');

    // Simular el clic en el botón de abrir menú
    const openMenuButton = screen.getByLabelText('Abrir menú');
    fireEvent.click(openMenuButton);

    // Ahora el sidebarDrawer debería tener la clase 'translate-x-0' indicando que está abierto
    expect(sidebarDrawer.className).toContain('translate-x-0');
    expect(sidebarDrawer.className).not.toContain('-translate-x-full');

    // Simular el clic en el overlay para cerrar el sidebar
    // El overlay no tiene aria-label en el código, pero es el elemento clickeable hermano con aria-hidden="true"
    // Podemos cerrarlo también apretando Escape
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    // El drawer vuelve a estar cerrado
    expect(sidebarDrawer.className).toContain('-translate-x-full');
  });
});
