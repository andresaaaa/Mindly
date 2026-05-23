import { useState, useEffect, useRef } from "react";
import './settings_style.css';


// ─── Toggle Switch ──────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
    return (
        <div
            className={"toggle-wrapper" + (checked ? " checked" : "")}
            onClick={() => onChange(!checked)}
            role="switch"
            aria-checked={checked}
            tabIndex={0}
            onKeyDown={(e) => e.key === " " && onChange(!checked)}
        >
            <div className="toggle-track" />
            <div className="toggle-thumb" />
        </div>
    );
}

// ─── Voice Persona Card ─────────────────────────────────────────────────────
function VoiceCard({ name, description, selected, onClick }) {
    return (
        <div className={"voice-card" + (selected ? " selected" : "")} onClick={onClick}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 18, color: selected ? "var(--color-primary)" : "var(--color-outline-variant)" }}
                >
                    {selected ? "radio_button_checked" : "radio_button_unchecked"}
                </span>
                <p style={{ fontWeight: 700, color: selected ? "var(--color-on-surface)" : "rgba(31,26,29,0.6)" }}>
                    {name}
                </p>
            </div>
            <p style={{ fontSize: 10, lineHeight: 1.4, color: "var(--color-neutral-text)" }}>{description}</p>
        </div>
    );
}

// ─── Contact Item ───────────────────────────────────────────────────────────
function ContactItem({ initials, name, relation, phone, onDelete, color }) {
    const bgMap = { primary: "rgba(232,165,205,0.3)", secondary: "rgba(139,239,247,0.5)" };
    const colorMap = { primary: "var(--color-primary)", secondary: "var(--color-secondary)" };
    return (
        <div className="contact-item">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: bgMap[color] || bgMap.primary,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: colorMap[color] || colorMap.primary,
                    fontWeight: 700, fontSize: 12, flexShrink: 0,
                }}>
                    {initials}
                </div>
                <div>
                    <p style={{ fontWeight: 700, color: "var(--color-on-surface)", fontSize: 14 }}>{name}</p>
                    <p style={{ color: "var(--color-neutral-text)", fontSize: 12 }}>{relation} • {phone}</p>
                </div>
            </div>
            <button className="btn-delete" onClick={onDelete} aria-label={"Eliminar " + name}>
                <span className="material-symbols-outlined">delete</span>
            </button>
        </div>
    );
}

// ─── Toast ──────────────────────────────────────────────────────────────────
function Toast({ message, visible }) {
    return <div className={"toast" + (visible ? " show" : "")}>{message}</div>;
}

// ─── Add Contact Modal ──────────────────────────────────────────────────────
function AddContactModal({ onClose, onAdd }) {
    const [form, setForm] = useState({ name: "", relation: "", phone: "" });
    const submit = () => {
        if (!form.name.trim()) return;
        const initials = form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
        onAdd({ ...form, initials, color: "primary" });
        onClose();
    };
    return (
        <div
            style={{
                position: "fixed", inset: 0, background: "rgba(53,47,49,0.5)",
                backdropFilter: "blur(4px)", zIndex: 200,
                display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "var(--color-surface-container-lowest)", borderRadius: 16,
                    padding: 32, width: "100%", maxWidth: 420,
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)",
                }}
                onClick={e => e.stopPropagation()}
            >
                <h3 style={{ fontWeight: 700, fontSize: 20, color: "var(--color-on-surface)", marginBottom: 24 }}>
                    Add Trusted Contact
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                        { label: "Full Name", key: "name", placeholder: "e.g. Jane Doe" },
                        { label: "Relation", key: "relation", placeholder: "e.g. Spouse, Therapist" },
                        { label: "Phone", key: "phone", placeholder: "(555) 000-0000" },
                    ].map(({ label, key, placeholder }) => (
                        <div key={key} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 14, fontWeight: 600, color: "var(--color-neutral-text)", letterSpacing: "0.05em" }}>
                                {label}
                            </label>
                            <input
                                className="mindly-input"
                                placeholder={placeholder}
                                value={form[key]}
                                onChange={e => setForm({ ...form, [key]: e.target.value })}
                            />
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, marginTop: 24 }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: "var(--color-neutral-text)", fontFamily: "Montserrat, sans-serif",
                            fontWeight: 600, fontSize: 14,
                        }}
                    >
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={submit}>Add Contact</button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function ProfileSettings() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [voicePersona, setVoicePersona] = useState("Calm");
    const [frequency, setFrequency] = useState(3);
    const [contacts, setContacts] = useState([
        { initials: "MW", name: "Marcus Wells", relation: "Spouse", phone: "(555) 012-3456", color: "secondary" },
        { initials: "DP", name: "Dr. Elena Park", relation: "Therapist", phone: "(555) 987-6543", color: "primary" },
    ]);
    const [notifications, setNotifications] = useState({ push: true, weekly: true, quiet: false });
    const [formData, setFormData] = useState({
        legalName: "Seraphina Wells", preferredName: "Sera", email: "sera.wells@mindly.io",
    });
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState({ message: "", visible: false });
    const toastTimer = useRef(null);

    // Lock scroll when sidebar open
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : "";
    }, [sidebarOpen]);

    const showToast = (msg) => {
        if (toastTimer.current) clearTimeout(toastTimer.current);
        setToast({ message: msg, visible: true });
        toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
    };

    const handleSave = () => {
        if (!formData.email.includes("@")) { showToast("⚠️ Enter a valid email address."); return; }
        showToast("✓ Preferences saved successfully!");
    };

    const handleDiscard = () => {
        setFormData({ legalName: "Seraphina Wells", preferredName: "Sera", email: "sera.wells@mindly.io" });
        setVoicePersona("Calm");
        setFrequency(3);
        setNotifications({ push: true, weekly: true, quiet: false });
        showToast("Changes discarded.");
    };

    const frequencyLabel = `${frequency} ${frequency === 1 ? "time" : "times"} / day`;

    const navItems = [
        { icon: "dashboard", label: "Dashboard" },
        { icon: "mood", label: "Mood" },
        { icon: "air", label: "Breath" },
        { icon: "edit_note", label: "Journal" },
        { icon: "person", label: "Me", active: true },
    ];

    return (
        <div
            className="aurora-gradient"
            style={{ minHeight: "100vh", fontFamily: "Montserrat, sans-serif", background: "var(--color-background)" }}
        >
            {/* Sidebar Overlay */}
            <div className={"sidebar-overlay" + (sidebarOpen ? " open" : "")} onClick={() => setSidebarOpen(false)} />

            {/* Sidebar */}
            <aside className={"sidebar" + (sidebarOpen ? " open" : "")}>
                <div style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(211,194,201,0.2)" }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-primary)", fontFamily: "Montserrat, sans-serif" }}>Mindly</div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        style={{ padding: 8, background: "none", border: "none", cursor: "pointer", borderRadius: "50%", display: "flex", alignItems: "center" }}
                    >
                        <span className="material-symbols-outlined" style={{ color: "var(--color-on-surface)" }}>close</span>
                    </button>
                </div>
                <nav style={{ flex: 1, padding: "32px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                    {navItems.map(({ icon, label, active }) => (
                        <a key={label} href="#" className={"nav-link" + (active ? " active" : "")} onClick={e => e.preventDefault()}>
                            <span className="material-symbols-outlined">{icon}</span>
                            {label}
                        </a>
                    ))}
                </nav>
                <div style={{ padding: 24, borderTop: "1px solid rgba(211,194,201,0.2)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-primary-container)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-on-primary-container)", fontWeight: 700, flexShrink: 0 }}>ER</div>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--color-on-surface)" }}>Elena R.</p>
                            <p style={{ fontSize: 12, color: "var(--color-on-surface-variant)" }}>Premium User</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Top Nav */}
            <header style={{ background: "rgba(255,248,249,0.8)", backdropFilter: "blur(12px)", position: "fixed", top: 0, width: "100%", zIndex: 50 }}>
                <div style={{ display: "flex", alignItems: "center", padding: "16px 24px", maxWidth: 1280, margin: "0 auto" }}>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        style={{ padding: 8, marginLeft: -8, marginRight: 16, background: "none", border: "none", cursor: "pointer", borderRadius: "50%", display: "flex", alignItems: "center" }}
                    >
                        <span className="material-symbols-outlined" style={{ color: "var(--color-on-surface-variant)" }}>menu</span>
                    </button>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-primary)", fontFamily: "Montserrat, sans-serif" }}>Mindly</div>
                </div>
            </header>

            {/* Main */}
            <main style={{ paddingTop: 96, paddingBottom: 48, paddingLeft: 20, paddingRight: 20, maxWidth: 768, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>

                {/* 1. Personal Information */}
                <section className="section-card card-shadow">
                    <div style={{ position: "absolute", top: 32, right: 32 }}>
                        <div style={{ position: "relative", cursor: "pointer" }}>
                            <img
                                alt="Profile"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5TsFpo6ZQ5j61LR7cQm_dv7nm0iUEoirefi6OAbKFWUsorV7jE3kyNJeDdMZl21Xk_4-56Fpg7x4alUQ_CwM1GcQSsr5YcDSXFWweIsfRq3ejrXrfZIaCvaV_sgan4HTRJ9TBO2_sS4vPWYyQKkjiNOz8lioZAS4Bi83RnVc9Z739SFJAjfTx24ldgMFJiXLyf56BKjB6rJNmUcVBv0zjVTfiFTL1BJTFY66AqCuKDwLwNWn26xVv9z3CRjcOAuwdpUhkgfHpVrA"
                                style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--color-primary-container)", boxShadow: "0 1px 3px rgba(0,0,0,0.12)", display: "block" }}
                            />
                            <div style={{ position: "absolute", bottom: -4, right: -4, background: "var(--color-primary)", padding: 6, borderRadius: "50%", border: "2px solid var(--color-surface-container-lowest)", display: "flex" }}>
                                <span className="material-symbols-outlined" style={{ color: "white", fontSize: 12, lineHeight: 1 }}>edit</span>
                            </div>
                        </div>
                    </div>
                    <header style={{ marginBottom: 32 }}>
                        <h2 style={{ fontSize: 32, fontWeight: 600, color: "var(--color-on-surface)", marginBottom: 4, lineHeight: 1.3 }}>Personal Information</h2>
                        <p style={{ color: "var(--color-neutral-text)", fontSize: 14 }}>Update your basic details used for therapeutic sessions.</p>
                    </header>
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                            {[
                                { label: "Legal Name", key: "legalName" },
                                { label: "Preferred Name", key: "preferredName" },
                            ].map(({ label, key }) => (
                                <div key={key} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <label style={{ fontSize: 14, fontWeight: 600, color: "var(--color-neutral-text)", letterSpacing: "0.05em", paddingLeft: 4 }}>{label}</label>
                                    <input className="mindly-input" type="text" value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 14, fontWeight: 600, color: "var(--color-neutral-text)", letterSpacing: "0.05em", paddingLeft: 4 }}>Email Address</label>
                            <input className="mindly-input" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                    </div>
                </section>

                {/* 2. A.I.S.E Intelligence Settings */}
                <section className="section-card card-shadow">
                    <header style={{ marginBottom: 32 }}>
                        <h2 style={{ fontSize: 32, fontWeight: 600, color: "var(--color-on-surface)", marginBottom: 4, lineHeight: 1.3 }}>A.I.S.E Intelligence Settings</h2>
                        <p style={{ color: "var(--color-neutral-text)", fontSize: 14 }}>Customize your AI companion's vocal presence and responsiveness.</p>
                    </header>
                    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                        <div>
                            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--color-neutral-text)", letterSpacing: "0.05em", marginBottom: 16 }}>Voice Persona</label>
                            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                                {[
                                    { name: "Calm", description: "Soft, nurturing, and melodic tone." },
                                    { name: "Steady", description: "Direct, grounding, and rhythmic." },
                                    { name: "Bright", description: "Energetic, encouraging, and clear." },
                                ].map(({ name, description }) => (
                                    <VoiceCard key={name} name={name} description={description} selected={voicePersona === name} onClick={() => setVoicePersona(name)} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
                                <label style={{ fontSize: 14, fontWeight: 600, color: "var(--color-neutral-text)", letterSpacing: "0.05em" }}>Check-in Frequency</label>
                                <span style={{ color: "var(--color-primary)", fontWeight: 700, fontSize: 14 }}>{frequencyLabel}</span>
                            </div>
                            <input
                                type="range" min="1" max="10" value={frequency}
                                onChange={e => setFrequency(Number(e.target.value))}
                                style={{ width: "100%", height: 6, background: "var(--color-surface-container)", borderRadius: 9999, appearance: "none", cursor: "pointer" }}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                                {["Low Presence", "High Presence"].map(l => (
                                    <span key={l} style={{ fontSize: 10, fontWeight: 700, color: "var(--color-outline-variant)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{l}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Trusted Contacts */}
                <section className="section-card card-shadow">
                    <header style={{ marginBottom: 32 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                            <h2 style={{ fontSize: 32, fontWeight: 600, color: "var(--color-on-surface)", lineHeight: 1.3 }}>Trusted Contacts</h2>
                            <span style={{ background: "var(--color-error-container)", color: "var(--color-on-error-container)", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 9999, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                                Emergency SOS
                            </span>
                        </div>
                        <p style={{ color: "var(--color-neutral-text)", fontSize: 14 }}>Individuals Mindly will reach out to if AI indicators detect a crisis level.</p>
                    </header>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                        {contacts.length === 0 && (
                            <p style={{ textAlign: "center", color: "var(--color-neutral-text)", fontSize: 14, padding: "24px 0" }}>No trusted contacts yet.</p>
                        )}
                        {contacts.map((c, i) => (
                            <ContactItem key={i} {...c} onDelete={() => { setContacts(prev => prev.filter((_, idx) => idx !== i)); showToast("Contact removed."); }} />
                        ))}
                    </div>
                    <button className="btn-dashed" onClick={() => setShowModal(true)}>
                        <span className="material-symbols-outlined">add_circle</span>
                        Add Trusted Contact
                    </button>
                </section>

                {/* 4. Notification Hub */}
                <section className="section-card card-shadow">
                    <header style={{ marginBottom: 32 }}>
                        <h2 style={{ fontSize: 32, fontWeight: 600, color: "var(--color-on-surface)", marginBottom: 4, lineHeight: 1.3 }}>Notification Hub</h2>
                        <p style={{ color: "var(--color-neutral-text)", fontSize: 14 }}>Choose how you want to be reminded to breathe.</p>
                    </header>
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        {[
                            { key: "push", icon: "notifications", iconBg: "rgba(232,165,205,0.2)", iconColor: "var(--color-primary)", title: "Push Notifications", subtitle: "Real-time therapeutic nudges." },
                            { key: "weekly", icon: "mail", iconBg: "rgba(139,239,247,0.2)", iconColor: "var(--color-secondary)", title: "Weekly Reflections", subtitle: "Detailed email summary of your mood trends." },
                            { key: "quiet", icon: "do_not_disturb_on", iconBg: "var(--color-surface-container)", iconColor: "var(--color-neutral-text)", title: "Quiet Hours", subtitle: "Mute all non-SOS alerts after 10:00 PM." },
                        ].map(({ key, icon, iconBg, iconColor, title, subtitle }) => (
                            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <div style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, background: iconBg, color: iconColor, flexShrink: 0 }}>
                                        <span className="material-symbols-outlined">{icon}</span>
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 700, color: "var(--color-on-surface)", fontSize: 14 }}>{title}</p>
                                        <p style={{ color: "var(--color-neutral-text)", fontSize: 12 }}>{subtitle}</p>
                                    </div>
                                </div>
                                <Toggle checked={notifications[key]} onChange={val => setNotifications({ ...notifications, [key]: val })} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Footer Actions */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 32, paddingTop: 16 }}>
                    <button
                        onClick={handleDiscard}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-neutral-text)", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: "0.05em" }}
                    >
                        Discard Changes
                    </button>
                    <button className="btn-primary" onClick={handleSave}>Save Preferences</button>
                </div>
            </main>

            {/* Footer */}
            <footer style={{ background: "var(--color-surface-container-lowest)", width: "100%", borderRadius: "12px 12px 0 0", marginTop: 48 }}>
                <div className="footer-inner" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "48px 24px", maxWidth: 1280, margin: "0 auto", gap: 32 }}>
                    <div className="footer-brand" style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                        <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-primary)", fontFamily: "Montserrat, sans-serif" }}>Mindly</div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-on-surface-variant)", letterSpacing: "0.05em" }}>© 2024 Mindly. A sanctuary for your mind.</p>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
                        {["Privacy Policy", "Terms of Service", "SOS Resources", "Contact Support"].map(label => (
                            <a key={label} href="#" className="footer-link" onClick={e => e.preventDefault()}>{label}</a>
                        ))}
                    </div>
                </div>
            </footer>

            {/* Modal */}
            {showModal && <AddContactModal onClose={() => setShowModal(false)} onAdd={(c) => { setContacts(prev => [...prev, c]); showToast("✓ Contact added!"); }} />}

            {/* Toast */}
            <Toast message={toast.message} visible={toast.visible} />
        </div>
    );
}