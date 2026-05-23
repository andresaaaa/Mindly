import React from 'react';
import { useDashboardLogic } from '../../backend/dashboard_logic.js';
import './dashboard_style.css';

const Dashboard = () => {
    const {
        isSidebarOpen,
        toggleSidebar,
        activeNavItem,
        setActiveNavItem,
        setIsHoveringAise
    } = useDashboardLogic();

    return (
        <div className="font-body-md text-on-surface min-h-screen relative overflow-x-hidden">
            <div className="aurora-bg"></div>

            {/* Sidebar Overlay */}
            <div
                className={`fixed inset-0 bg-black/20 z-[60] backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
            ></div>

            {/* Vertical Sidebar (Drawer) */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white/95 backdrop-blur-xl z-[70] shadow-2xl flex flex-col p-8 border-r border-outline-variant/20 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center gap-3 mb-12">
                    <span className="material-symbols-outlined text-primary text-3xl">settings_heart</span>
                    <div className="font-headline-md text-headline-sm font-bold text-primary">Mindly</div>
                </div>

                <nav className="flex flex-col gap-2">
                    <button className="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary-container/30 text-primary font-label-md w-full text-left">
                        <span className="material-symbols-outlined">dashboard</span>
                        Dashboard
                    </button>
                    <button className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-label-md w-full text-left">
                        <span className="material-symbols-outlined">mood</span>
                        Mood
                    </button>
                    <button className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-label-md w-full text-left">
                        <span className="material-symbols-outlined">air</span>
                        Breath
                    </button>
                    <button className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-label-md w-full text-left">
                        <span className="material-symbols-outlined">edit_note</span>
                        Journal
                    </button>
                    <button className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-label-md w-full text-left">
                        <span className="material-symbols-outlined">person</span>
                        Me
                    </button>
                </nav>

                <div className="mt-auto pt-8 border-t border-outline-variant/20">
                    <button className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-error hover:bg-error-container/20 transition-colors font-label-md">
                        <span className="material-symbols-outlined">logout</span>
                        Salir
                    </button>
                </div>
            </aside>

            {/* Top Bar */}
            <header className="sticky top-0 w-full z-50" style={{ backgroundColor: '#FFFFFF' }}>
                <nav className="flex justify-between items-center w-full px-4 md:px-10 h-16">
                    <div className="flex items-center gap-6">
                        <button aria-label="Menu" className="p-2 -ml-2 rounded-full hover:bg-surface-container transition-colors" onClick={toggleSidebar}>
                            <span className="material-symbols-outlined text-on-surface-variant text-2xl">menu</span>
                        </button>
                        <div className="font-headline-md text-headline-sm font-bold text-primary">Mindly</div>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6">
                        <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors hidden sm:block">location_on</span>
                        <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">notifications</span>
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 cursor-pointer hover:border-primary transition-colors">
                            <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/a/ACg8ocL8Zz3W0W9h1L0J9L3l3v4X5Z0W=s96-c" />
                        </div>
                    </div>
                </nav>
            </header>

            <main className="mx-auto px-5 md:px-10 py-12 pb-32">
                {/* Hero Waveform Interaction */}
                <section className="flex flex-col items-center justify-center mb-12 relative">
                    <div className="absolute -z-10 w-full h-full flex items-center justify-center opacity-20 pointer-events-none">
                        <div className="w-[400px] h-[400px] rounded-full primary-gradient-btn blur-[100px] pulse-slow"></div>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="font-headline-lg text-[32px] md:text-[48px] mb-4 text-on-surface font-bold leading-tight">Hola, ¿cómo te sientes?</h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto">AISE está aquí para escucharte y guiarte hacia un estado de calma total.</p>
                    </div>

                    {/* Animated AISE Button */}
                    <button
                        className="group relative flex flex-col items-center justify-center active:scale-95 transition-all duration-500"
                        onMouseEnter={() => setIsHoveringAise(true)}
                        onMouseLeave={() => setIsHoveringAise(false)}
                    >
                        <div className="absolute inset-0 primary-gradient-btn blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full primary-gradient-btn flex flex-col items-center justify-center text-white p-8 shadow-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="material-symbols-outlined text-5xl mb-3 wave-animation" style={{ fontVariationSettings: "'FILL' 1" }}>bubble_chart</span>
                            <span className="font-label-md text-label-md text-center leading-tight tracking-wider">INICIAR CONVERSACIÓN<br />(A.I.S.E.)</span>

                            <div className="absolute bottom-0 left-0 w-full h-12 flex items-end justify-around px-4 opacity-40">
                                <div className="w-1 bg-white rounded-full animate-[bounce_1.2s_infinite]"></div>
                                <div className="w-1 bg-white rounded-full animate-[bounce_0.8s_infinite]"></div>
                                <div className="w-1 bg-white rounded-full animate-[bounce_1.5s_infinite]"></div>
                                <div className="w-1 bg-white rounded-full animate-[bounce_1s_infinite]"></div>
                                <div className="w-1 bg-white rounded-full animate-[bounce_1.3s_infinite]"></div>
                            </div>
                        </div>
                    </button>
                </section>

                {/* Bento Grid Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="glass-card rounded-xl p-8 transition-transform hover:scale-[1.02] duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-headline-md text-[24px] font-semibold">Estado de Ánimo Hoy</h2>
                                <span className="material-symbols-outlined text-primary">sentiment_satisfied</span>
                            </div>
                            <div className="flex items-center gap-6 mb-6">
                                <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-3xl">😌</div>
                                <div>
                                    <div className="font-label-md text-[14px] font-semibold text-on-secondary-container">Sereno</div>
                                    <div className="text-sm text-on-surface-variant">8:30 AM</div>
                                </div>
                            </div>
                            <p className="text-on-surface-variant font-body-md bg-surface-container-low p-4 rounded-lg">
                                "Pareces estar en un estado de calma receptiva. Es un gran momento para una meditación breve de enfoque."
                            </p>
                        </div>

                        <div className="glass-card rounded-xl p-8 transition-transform hover:scale-[1.02] duration-300 overflow-hidden">
                            <h2 className="font-headline-md text-[24px] font-semibold mb-6">Progreso Emocional</h2>
                            <div className="relative h-40 w-full flex items-end justify-between gap-2 px-2">
                                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                    <span className="material-symbols-outlined text-9xl text-primary">show_chart</span>
                                </div>
                                <div className="h-[40%] w-3 bg-primary-container rounded-full"></div>
                                <div className="h-[60%] w-3 bg-secondary-container rounded-full"></div>
                                <div className="h-[85%] w-3 bg-primary-container rounded-full"></div>
                                <div className="h-[70%] w-3 bg-secondary-container rounded-full"></div>
                                <div className="h-[95%] w-3 bg-primary-container rounded-full"></div>
                                <div className="h-[50%] w-3 bg-secondary-container rounded-full"></div>
                                <div className="h-[80%] w-3 bg-primary-container rounded-full"></div>
                            </div>
                            <div className="flex justify-between mt-4 text-[10px] font-label-md text-on-surface-variant uppercase tracking-widest">
                                <span>Lun</span><span>Mar</span><span>Mie</span><span>Jue</span><span>Vie</span><span>Sab</span><span>Dom</span>
                            </div>
                            <div className="mt-6 flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary-container"></div>
                                    <span className="text-xs font-label-md font-semibold">Calma</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-secondary-container"></div>
                                    <span className="text-xs font-label-md font-semibold">Energía</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Column */}
                    <div className="hidden lg:flex lg:col-span-4 h-full items-center justify-center">
                        <div className="relative w-full aspect-square rounded-full border-2 border-dashed border-outline-variant/30 flex items-center justify-center">
                            <img alt="Mindful abstract" className="w-4/5 h-4/5 object-cover rounded-full opacity-60 mix-blend-multiply grayscale hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLsPz930M9TknK_utFx8jy5PPjKIeYOitQ6EpktCfMI6JKy94zui9eoozOf3Cr3Hfj2il4359x05RYUyS4f_ZFNPKbN_ly6zQO6Qs14Lg_GWj80h7wB5IoPhgrD146zq1Da9zwVssmxr1phM9auo2ZFOUjDrXZG11Vzc1SrzkVLChw7-9lY-3_9KyBcFVsJzKo_piCsYpAkUc9w4t_G46Ih1O7evox7onoMZBWV1V-KM8XSU2Fc9SZbZYFU0ADGqGQfJCiPnJMhUg" />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="glass-card rounded-xl p-8 transition-transform hover:scale-[1.02] duration-300">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center">
                                    <span className="material-symbols-outlined text-on-tertiary-container">support_agent</span>
                                </div>
                                <h2 className="font-headline-md text-[24px] font-semibold">Tu Resumen Semanal</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                                    <span className="font-label-md text-on-surface-variant font-semibold">Sesiones con AISE</span>
                                    <span className="font-bold text-primary">12</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                                    <span className="font-label-md text-on-surface-variant font-semibold">Minutos de Calma</span>
                                    <span className="font-bold text-primary">145m</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="font-label-md text-on-surface-variant font-semibold">Nivel de Bienestar</span>
                                    <span className="font-bold text-on-tertiary-container">+15%</span>
                                </div>
                            </div>

                            <div className="mt-8 bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg relative overflow-hidden">
                                <div className="absolute -right-2 -bottom-2 opacity-5 scale-150">
                                    <span className="material-symbols-outlined text-6xl text-primary">auto_awesome</span>
                                </div>
                                <div className="text-[10px] font-label-md font-semibold uppercase tracking-widest text-primary mb-1">Mensaje de A.I.S.E.</div>
                                <p className="font-body-md text-body-md italic text-on-surface-variant">
                                    "Has sido muy constante esta semana. Recuerda que la paz no es el destino, sino el camino que ya estás recorriendo."
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex flex-col items-center justify-center p-6 glass-card rounded-xl hover:bg-primary-container/20 transition-colors group">
                                <span className="material-symbols-outlined text-primary mb-2 group-hover:scale-110 transition-transform">history</span>
                                <span className="font-label-md font-semibold text-xs uppercase tracking-wider">Historial</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-6 glass-card rounded-xl hover:bg-error-container/20 transition-colors group">
                                <span className="material-symbols-outlined text-error mb-2 group-hover:scale-110 transition-transform">emergency_home</span>
                                <span className="font-label-md font-semibold text-xs uppercase tracking-wider">SOS</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* BottomNavBar (Mobile Only) */}
            <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-surface/90 dark:bg-surface-container-highest/90 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(132,76,112,0.05)] rounded-t-xl">
                {[
                    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
                    { id: 'mindly', icon: 'bubble_chart', label: 'Mindly AI' },
                    { id: 'history', icon: 'history', label: 'History' },
                    { id: 'sos', icon: 'emergency_home', label: 'SOS' }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveNavItem(item.id)}
                        className={`flex flex-col items-center justify-center px-5 py-1.5 transition-all duration-200 ${activeNavItem === item.id
                            ? 'bg-primary-container text-on-primary-container rounded-full'
                            : 'text-on-surface-variant hover:bg-surface-variant/50'
                            }`}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="font-label-md text-[10px] font-semibold">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <footer className="w-full py-12 bg-surface-container-low border-t border-outline-variant/30 hidden md:block mt-auto relative z-10">
                <div className="max-w-[1440px] w-full mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="font-headline-md text-headline-sm font-bold text-primary">Mindly</div>
                    <p className="font-body-md text-body-md text-on-surface-variant">© 2024 Mindly. Digital Sanctuary for your mind.</p>
                    <div className="flex gap-8">
                        <a className="font-label-md font-semibold text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Privacidad</a>
                        <a className="font-label-md font-semibold text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Términos</a>
                        <a className="font-label-md font-semibold text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Contacto</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;