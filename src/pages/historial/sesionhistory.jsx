import { useState } from "react";
import "./sessionhistory.css";

// ─── Datos ────────────────────────────────────────────────────────────────────

// Emotional Flow chart
const FLOW_BARS = [
  { day: "Mon", heightPct: 40, variant: "secondary",  title: "Calm"       },
  { day: "Tue", heightPct: 65, variant: "primary-c",  title: "Joyful"     },
  { day: "Wed", heightPct: 30, variant: "tertiary-c", title: "Anxious"    },
  { day: "Thu", heightPct: 85, variant: "primary",    title: "Inspired"   },
  { day: "Fri", heightPct: 55, variant: "secondary",  title: "Calm"       },
  { day: "Sat", heightPct: 75, variant: "primary-c",  title: "Joyful"     },
  { day: "Sun", heightPct: 45, variant: "tertiary-c", title: "Thoughtful" },
];

const STATS = [
  { variant: "primary",   icon: "auto_graph",   value: "18",   label: "Total Sessions"    },
  { variant: "secondary", icon: "electric_bolt", value: "124",  label: "Minutes Recorded"  },
  { variant: "tertiary",  icon: "psychology",   value: "Calm", label: "Dominant Mood"     },
];

const SESSIONS = [
  {
    id: 1,
    iconVariant: "secondary",
    title: "Midnight Reflection",
    date: "Oct 24, 2024",
    duration: "14 min",
    tags: [
      { label: "Calm",         color: "fuchsia" },
      { label: "Introspective", color: "cyan"    },
    ],
  },
  {
    id: 2,
    iconVariant: "primary",
    title: "Morning Intentions",
    date: "Oct 23, 2024",
    duration: "08 min",
    tags: [
      { label: "Grateful", color: "green"  },
      { label: "Joyful",   color: "yellow" },
    ],
  },
  {
    id: 3,
    iconVariant: "tertiary",
    title: "Work Anxiety Release",
    date: "Oct 22, 2024",
    duration: "22 min",
    tags: [
      { label: "Anxious", color: "orange" },
      { label: "Venting", color: "slate"  },
    ],
  },
];

const FILTERS = ["All", "This Week", "Calm", "Anxious", "Grateful"];

const NAV_ITEMS = [
  { icon: "home",         label: "Home",    active: false },
  { icon: "bubble_chart", label: "Mood",    active: false },
  { icon: "air",          label: "Breath",  active: false },
  { icon: "edit_note",    label: "Journal", active: false },
  { icon: "person",       label: "Me",      active: true  },
];

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function MindlySessionHistory() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery]   = useState("");

  return (
    <div className="mindly-root">
      <TopBar />

      <main className="main-content">
        {/* Page Header */}
        <header className="page-header">
          <h1 className="page-header__title">Memory Lane</h1>
          <p className="page-header__subtitle">
            Reflect on your emotional journey. Every voice session is a step toward clarity.
          </p>
        </header>

        {/* Search & Filters */}
        <div className="search-cluster">
          <div className="search-wrapper">
            <span className="material-symbols-outlined search-wrapper__icon">search</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search sessions by keyword or insight..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group hide-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-btn${activeFilter === f ? " filter-btn--active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f === "All" && (
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                    filter_list
                  </span>
                )}
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <StatsSection />

        {/* Emotional Flow */}
        <EmotionalFlowSection />

        {/* Sessions */}
        <section className="sessions-section">
          <div className="sessions-header">
            <h2 className="sessions-header__title">Recent Sessions</h2>
            <button className="sessions-header__view-all">View All</button>
          </div>

          <div className="sessions-list">
            {SESSIONS.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />

      <SiteFooter />
    </div>
  );
}

// ─── TopBar ───────────────────────────────────────────────────────────────────
function TopBar() {
  return (
    <nav className="topbar">
      <div className="topbar__brand">
        <span className="material-symbols-outlined topbar__icon">spa</span>
        <span className="topbar__name">Mindly</span>
      </div>

      <div className="topbar__actions">
        <button className="topbar__btn" aria-label="Emergency share">
          <span className="material-symbols-outlined">emergency_share</span>
        </button>
        <button className="topbar__btn" aria-label="Notifications">
          <span className="material-symbols-outlined">notifications</span>
          <span className="topbar__notif-dot" />
        </button>
        <div className="topbar__avatar">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6aoLPY1ZncpkDKfJv0fF9JGT_NsQwgpvGSP_GrJ26DDKlu1tmSeMOrp4Ko4rfjIzuMWpuOwG4z8EUOWdLHx5H7Mt_N6US3Ab52kBH93kjZiua06fYeam5fTDowN0aEOkJgyhGRac9F9sOWK3eBdntM7uQ8zCi5WzIVofFjwlj0slkrcGYpag-1OZmnkZNEtXQoh_avDmdegZZJka_0lPo1XApjrNLiBRDKg1MYDmtKHLjJU9i3dSG4WZy7LkPc7kThHfbFuA8Yg8"
            alt="User profile"
          />
        </div>
      </div>
    </nav>
  );
}

// ─── StatsSection ─────────────────────────────────────────────────────────────
function StatsSection() {
  return (
    <section style={{ marginBottom: "4rem" }}>
      <h2 className="sessions-header__title" style={{ marginBottom: "1.5rem" }}>
        Your Journey
      </h2>
      <div className="stats-grid">
        {STATS.map((stat) => (
          <div key={stat.label} className={`stat-card stat-card--${stat.variant}`}>
            <span className="material-symbols-outlined stat-card__icon">
              {stat.icon}
            </span>
            <div>
              <p className="stat-card__value">{stat.value}</p>
              <p className="stat-card__label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── SessionCard ──────────────────────────────────────────────────────────────
function SessionCard({ session }) {
  const { iconVariant, title, date, duration, tags } = session;
  return (
    <div className="session-card">
      <div className="session-card__left">
        <div className={`session-card__icon-wrap session-card__icon-wrap--${iconVariant}`}>
          <span className="material-symbols-outlined session-card__icon">mic</span>
        </div>
        <div>
          <h4 className="session-card__title">{title}</h4>
          <div className="session-card__meta">
            <span className="session-card__meta-item">
              <span className="material-symbols-outlined session-card__meta-icon">calendar_today</span>
              {date}
            </span>
            <span className="session-card__meta-dot" />
            <span className="session-card__meta-item">
              <span className="material-symbols-outlined session-card__meta-icon">schedule</span>
              {duration}
            </span>
          </div>
        </div>
      </div>

      <div className="tags">
        {tags.map((tag) => (
          <span key={tag.label} className={`tag tag--${tag.color}`}>
            {tag.label}
          </span>
        ))}
      </div>

      <button className="session-card__action" aria-label="View session">
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
}

// ─── BottomNav ────────────────────────────────────────────────────────────────
function BottomNav() {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <a
          key={item.label}
          href="#"
          className={`bottom-nav__item${item.active ? " bottom-nav__item--active" : ""}`}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings: item.active
                ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
            }}
          >
            {item.icon}
          </span>
          <span className="bottom-nav__label">{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

// ─── EmotionalFlowSection ─────────────────────────────────────────────────────
function EmotionalFlowSection() {
  return (
    <section className="emotional-flow-section">
      <div className="emotional-flow-grid">
        {/* Main chart card */}
        <div className="flow-chart-card">
          <div className="flow-chart-card__header">
            <div>
              <h3 className="flow-chart-card__title">Emotional Flow</h3>
              <p className="flow-chart-card__subtitle">Last 7 Sessions</p>
            </div>
            <span className="material-symbols-outlined flow-chart-card__icon">
              auto_graph
            </span>
          </div>

          {/* Bar chart */}
          <div className="bar-chart">
            {/* Grid guide lines */}
            <div className="bar-chart__grid" aria-hidden="true">
              <div className="bar-chart__grid-line" />
              <div className="bar-chart__grid-line" />
              <div className="bar-chart__grid-line" />
            </div>

            {/* Bars */}
            {FLOW_BARS.map((bar) => (
              <div
                key={bar.day}
                className={`bar bar--${bar.variant}`}
                style={{ height: `${bar.heightPct}%` }}
                title={bar.title}
              />
            ))}
          </div>

          {/* Day labels */}
          <div className="bar-chart__labels">
            {FLOW_BARS.map((bar) => (
              <span key={bar.day} className="bar-chart__label">
                {bar.day}
              </span>
            ))}
          </div>
        </div>

        {/* Side stat cards */}
        <div className="flow-stat-stack">
          <div className="flow-stat-card flow-stat-card--pink">
            <span className="material-symbols-outlined flow-stat-card__icon">
              electric_bolt
            </span>
            <div>
              <p className="flow-stat-card__value">124</p>
              <p className="flow-stat-card__label">Minutes Recorded</p>
            </div>
          </div>

          <div className="flow-stat-card flow-stat-card--green">
            <span className="material-symbols-outlined flow-stat-card__icon">
              psychology
            </span>
            <div>
              <p className="flow-stat-card__value">Calm</p>
              <p className="flow-stat-card__label">Dominant Mood</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SiteFooter ───────────────────────────────────────────────────────────────
function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <span className="site-footer__brand">Mindly</span>
          <p className="site-footer__copy">
            © 2024 Mindly Therapeutic. A sanctuary for your mind.
            All conversations are private and encrypted.
          </p>
        </div>
        <div className="site-footer__links">
          {["Philosophy", "Privacy Sanctuary", "Crisis Resources"].map((l) => (
            <a key={l} className="site-footer__link" href="#">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}