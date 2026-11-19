import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const links: Array<{ to: string; label: string }> = [
  { to: "/", label: "Sinh nhật" },
  { to: "/20-10", label: "20/10" },
  { to: "/20-11", label: "20/11" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  // Try to start music automatically. Browsers may still require a user gesture.
  const [musicPlaying, setMusicPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    const audio = new Audio("/assets/nguoithay.mp3");
    audio.loop = true;
    audio.autoplay = true;
    audio.preload = "auto";
    audio.volume = 0.34;
    audioRef.current = audio;

    const notifyIframes = (playing: boolean) => {
      const iframes = document.querySelectorAll("iframe");
      iframes.forEach((f) => {
        try {
          f.contentWindow?.postMessage({ type: "agift:music-state", playing }, window.location.origin);
        } catch (_) {}
      });
    };

    const unlockAudio = () => {
      const a = audioRef.current;
      if (!a) return;
      void a.play().then(() => {
        setMusicPlaying(true);
        notifyIframes(true);
        window.removeEventListener("pointerdown", unlockAudio);
        window.removeEventListener("keydown", unlockAudio);
        window.removeEventListener("touchstart", unlockAudio);
        window.removeEventListener("click", unlockAudio);
      }).catch(() => {
        // The browser may continue to block playback until a later gesture.
      });
    };

    // Attempt autoplay immediately, then retry after the first user interaction.
    unlockAudio();
    window.addEventListener("pointerdown", unlockAudio);
    window.addEventListener("keydown", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);
    window.addEventListener("click", unlockAudio);

    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "agift:unlock-music" || e.data?.type === "agift:user-gesture") {
        unlockAudio();
      } else if (e.data?.type === "agift:toggle-music") {
        setMusicPlaying((playing) => !playing);
      } else if (e.data?.type === "agift:request-music-state") {
        notifyIframes(Boolean(audioRef.current && !audioRef.current.paused));
      }
    };
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("message", handleMessage);
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let retryTimer: number | null = null;

    const notifyIframes = (playing: boolean) => {
      const iframes = document.querySelectorAll("iframe");
      iframes.forEach((f) => {
        try {
          f.contentWindow?.postMessage({ type: "agift:music-state", playing }, window.location.origin);
        } catch (_) {}
      });
    };

    if (!musicPlaying) {
      audio.pause();
      audio.currentTime = 0;
      notifyIframes(false);
      return;
    }

    const tryPlay = () => {
      void audio.play().then(() => {
        notifyIframes(true);
      }).catch(() => {
        // Một số trình duyệt chặn autoplay có tiếng. Giữ trạng thái bật và tự thử lại.
        // Nếu người dùng đã tắt nhạc trong lúc chờ, không khởi động lại nữa.
        if (musicPlaying && audioRef.current === audio) {
          retryTimer = window.setTimeout(tryPlay, 1200);
        }
      });
    };

    tryPlay();

    return () => {
      if (retryTimer !== null) window.clearTimeout(retryTimer);
    };
  }, [musicPlaying]);

  const isNovember = location.pathname === "/20-11";

  return (
    <>
      <header className={isNovember ? "site-header site-header--november" : "site-header"}>
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <span>Người thầy - dấu ấn không phai ...</span>
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
