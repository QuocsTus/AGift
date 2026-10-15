import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Sinh nhật" },
  { to: "/20-10", label: "20/10" },
  { to: "/20-11", label: "20/11" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const location = useLocation();

  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <span>Người gieo mầm xanh ♡</span>
          <i aria-hidden="true" />
        </Link>

        <nav className="desktop-nav" aria-label="Các dịp kỷ niệm">
          {links.map((link) => (
            <Link className={location.pathname === link.to ? "occasion-link active" : "occasion-link"} key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button className={musicPlaying ? "music-badge music-badge--playing" : "music-badge"} type="button" aria-label={musicPlaying ? "Tắt nhạc" : "Bật nhạc"} onClick={() => setMusicPlaying((playing) => !playing)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </button>
          <button className="menu-button" type="button" aria-label="Mở menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Các dịp kỷ niệm">
          {links.map((link) => (
            <Link className={location.pathname === link.to ? "mobile-link active" : "mobile-link"} key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
