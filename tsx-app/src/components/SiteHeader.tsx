import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const links: Array<{ to: string; label: string; disabled?: boolean }> = [
  { to: "/", label: "Sinh nhật" },
  { to: "/20-10", label: "20/10" },
  { to: "/20-11", label: "20/11", disabled: true },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    const audio = new Audio("/assets/nguoithay.mp3");
    audio.loop = true;
    audio.volume = 0.34;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!musicPlaying) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    void audio.play().catch(() => {
      // Trình duyệt có thể chặn autoplay; trạng thái sẽ trở về đúng là đang tắt.
      setMusicPlaying(false);
    });
  }, [musicPlaying]);

  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <span>Người gieo mầm xanh ♡</span>
          <i aria-hidden="true" />
        </Link>

        <nav className="desktop-nav" aria-label="Các dịp kỷ niệm">
          {links.map((link) => link.disabled ? (
            <span className="occasion-link occasion-link--disabled" key={link.to} aria-disabled="true">
              <span>{link.label}</span>
              <small>Coming soon</small>
            </span>
          ) : (
            <Link className={location.pathname === link.to ? "occasion-link active" : "occasion-link"} key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className={musicPlaying ? "music-badge music-badge--playing" : "music-badge music-badge--muted"}
            type="button"
            aria-label={musicPlaying ? "Tắt nhạc" : "Bật nhạc"}
            aria-pressed={musicPlaying}
            title={musicPlaying ? "Tắt nhạc" : "Bật nhạc"}
            onClick={() => setMusicPlaying((playing) => !playing)}
          >
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
          {links.map((link) => link.disabled ? (
            <span className="mobile-link mobile-link--disabled" key={link.to} aria-disabled="true">
              <span>{link.label}</span>
              <small>Coming soon</small>
            </span>
          ) : (
            <Link className={location.pathname === link.to ? "mobile-link active" : "mobile-link"} key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
