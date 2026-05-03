/**
 * AppShell — the persistent sidebar + topbar layout wrapping all pages.
 *
 * - Sidebar with persona-specific nav items
 * - Live ticker bar (investor persona)
 * - Dev persona switcher (dev mode only — hidden in production)
 * - Theme toggle (light / dark / high-contrast)
 * - "Last updated Xs ago" live indicator
 */
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.js";
import { DEV_PERSONAS, PERSONA_LABELS, PERSONA_ICONS, type DevPersona } from "../auth/personas.js";
import type { TickerQuote } from "../api/client.js";
import type { Persona } from "../auth/AuthContext.js";

const IS_DEV = import.meta.env["DEV"] === true;

type Theme = "light" | "dark" | "hc";
const THEME_CYCLE: Record<Theme, Theme> = { light: "dark", dark: "hc", hc: "light" };
const THEME_ICON: Record<Theme, string> = { light: "☀️", dark: "🌙", hc: "◐" };

interface NavSection {
  label?: string;
  items: NavItem[];
}
interface NavItem {
  to: string;
  icon: string;
  label: string;
}

function buildNav(persona: Persona | null): NavSection[] {
  const common: NavItem[] = [
    { to: "/compliance", icon: "🛡️", label: "Compliance Center" },
    { to: "/federation", icon: "🌐", label: "Federation Status" },
  ];

  if (persona === "investor") return [
    { items: [
      { to: "/", icon: "📊", label: "Dashboard" },
      { to: "/investor/portfolio", icon: "💼", label: "Portfolio" },
      { to: "/investor/performance", icon: "📈", label: "Performance" },
    ] },
    { label: "Platform", items: common },
  ];

  if (persona === "developer") return [
    { items: [
      { to: "/", icon: "⚡", label: "Portal" },
      { to: "/developer/models", icon: "🧠", label: "My Models" },
      { to: "/developer/ide", icon: "💻", label: "Cloud IDE" },
      { to: "/developer/backtest", icon: "📉", label: "Backtesting" },
      { to: "/developer/earnings", icon: "💰", label: "Earnings" },
    ] },
    { label: "Platform", items: common },
  ];

  if (persona === "regulator") return [
    { items: [
      { to: "/", icon: "⚖️", label: "Console" },
      { to: "/regulator/audit", icon: "📋", label: "Audit Log" },
      { to: "/regulator/proof", icon: "🔐", label: "Proof Viewer" },
      { to: "/regulator/standards", icon: "📚", label: "Standards" },
    ] },
    { label: "Platform", items: common },
  ];

  if (persona === "data_provider") return [
    { items: [
      { to: "/", icon: "🗄️", label: "Portal" },
      { to: "/data-provider/datasets", icon: "📦", label: "Datasets" },
      { to: "/data-provider/rounds", icon: "🔄", label: "Fed Rounds" },
      { to: "/data-provider/budget", icon: "🔒", label: "Privacy Budget" },
    ] },
    { label: "Platform", items: common },
  ];

  if (persona === "admin") return [
    { items: [
      { to: "/", icon: "🛡️", label: "Console" },
      { to: "/admin/users", icon: "👥", label: "Users" },
      { to: "/admin/models", icon: "✅", label: "Model Approval" },
      { to: "/admin/analytics", icon: "📊", label: "Analytics" },
      { to: "/admin/flags", icon: "🚩", label: "Feature Flags" },
    ] },
    { label: "Platform", items: common },
  ];

  return [{ items: [{ to: "/", icon: "🏠", label: "Home" }, ...common] }];
}

interface TickerBarProps { quotes: TickerQuote[] }
function TickerBar({ quotes }: TickerBarProps): React.ReactElement {
  return (
    <div className="ticker-bar" role="region" aria-label="Live market prices">
      <span className="gf-live" aria-live="off">Live</span>
      {quotes.map((q) => (
        <div key={q.symbol} className="ticker-item">
          <span className="ticker-item__symbol">{q.symbol}</span>
          <span className="ticker-item__price">
            {q.symbol === "EURUSD"
              ? q.price.toFixed(4)
              : q.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`ticker-item__change ${q.changePct >= 0 ? "up" : "dn"}`}>
            {q.changePct >= 0 ? "+" : ""}{q.changePct.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}

interface AppShellProps {
  children: React.ReactNode;
  ticker?: TickerQuote[];
}

export function AppShell({ children, ticker = [] }: AppShellProps): React.ReactElement {
  const { user, persona, setDevPersona, logout } = useAuth();
  const location = useLocation();
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("gefi-theme") as Theme | null;
    return stored ?? "light";
  });
  const [lastUpdated, setLastUpdated] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("gefi-theme", theme);
  }, [theme]);

  useEffect(() => {
    const id = setInterval(() => setLastUpdated((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const nav = buildNav(persona);

  const routeLabel = (path: string): string => {
    if (path === "/") return "Dashboard";
    return path.split("/").filter(Boolean).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" / ");
  };

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "?";

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to main content</a>

      {/* ── Sidebar ── */}
      <nav className="sidebar" aria-label="Main navigation">
        <a href="https://gefi.io" className="sidebar__logo" aria-label="GeFi home">
          <div className="sidebar__logo-mark" aria-hidden="true">G</div>
          <span className="sidebar__logo-text">GeFi</span>
        </a>

        <div className="sidebar__nav">
          {nav.map((section, si) => (
            <div key={si} className="sidebar__section">
              {section.label && (
                <div className="sidebar__section-label" aria-hidden="true">
                  {section.label}
                </div>
              )}
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    ["nav-item", isActive ? "is-active" : ""].filter(Boolean).join(" ")
                  }
                >
                  <span className="nav-item__icon" aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar__footer">
          {user && (
            <div className="user-chip" title={user.email}>
              <div className="user-chip__avatar" aria-hidden="true">{initials}</div>
              <div className="user-chip__info">
                <div className="user-chip__name">{user.name}</div>
                <div className="user-chip__role">
                  {PERSONA_LABELS[persona as DevPersona] ?? persona}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="nav-item"
            style={{ marginTop: "var(--space-2)", color: "var(--color-muted)" }}
          >
            <span className="nav-item__icon" aria-hidden="true">←</span>
            <span>Sign out</span>
          </button>
        </div>
      </nav>

      {/* ── Main area ── */}
      <div className="main-area">
        {/* Dev persona switcher */}
        {IS_DEV && (
          <div className="persona-switcher" role="navigation" aria-label="Dev persona switcher">
            <span className="persona-switcher__label">DEV:</span>
            {(Object.keys(DEV_PERSONAS) as DevPersona[]).map((p) => (
              <button
                key={p}
                className={["persona-switcher__btn", persona === p ? "is-active" : ""].filter(Boolean).join(" ")}
                onClick={() => setDevPersona(p)}
                aria-pressed={persona === p}
              >
                {PERSONA_ICONS[p]} {PERSONA_LABELS[p]}
              </button>
            ))}
          </div>
        )}

        {/* Topbar */}
        <header className="topbar">
          <div className="topbar__breadcrumb">
            GeFi / <strong>{routeLabel(location.pathname)}</strong>
          </div>
          <div className="topbar__actions">
            <span className="last-updated" aria-live="polite">
              Updated {lastUpdated}s ago
            </span>
            <button
              className="theme-toggle"
              onClick={() => setTheme((t) => THEME_CYCLE[t])}
              aria-label={`Switch theme (current: ${theme})`}
              title="Toggle theme"
            >
              {THEME_ICON[theme]}
            </button>
          </div>
        </header>

        {/* Ticker bar (investor) */}
        {persona === "investor" && ticker.length > 0 && (
          <TickerBar quotes={ticker} />
        )}

        {/* Page content */}
        <main id="main" className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
