import { useMemo, useState } from "react";

const messageLines = ["CHÚC MỪNG 20/10", "HỒNG LẠC"];
const wishes = [
  ["🌸", "Luôn xinh đẹp", "Rạng rỡ từ nụ cười đến trái tim."],
  ["💖", "Thật hạnh phúc", "Mỗi ngày đều có một niềm vui nhỏ."],
  ["✨", "Bình yên", "Nhẹ nhàng giữa mọi bộn bề."],
  ["🌹", "Được yêu thương", "Nhiều hơn bạn có thể đếm hết."],
];

const particles = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  char: "ABCDEFGHIKLMNOPQRSTUVXYĂÂÊÔƠƯ0123456789"[index % 38],
  left: `${8 + ((index * 29) % 84)}%`,
  top: `${10 + ((index * 47) % 76)}%`,
  x: `${-220 + ((index * 71) % 440)}px`,
  y: `${-160 + ((index * 53) % 320)}px`,
  rotate: `${-180 + ((index * 67) % 360)}deg`,
  delay: `${(index % 9) * 0.08}s`,
}));

const stars = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 61) % 100}%`,
  delay: `${(index % 6) * 0.35}s`,
}));

export function October20Interactive() {
  const [decoding, setDecoding] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [bursts, setBursts] = useState<number[]>([]);
  const visibleMessage = useMemo(() => messageLines, []);

  const decode = () => {
    if (decoding || revealed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }
    setDecoding(true);
  };

  const celebrate = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!revealed || (event.target as HTMLElement).closest("button")) return;
    setBursts((current) => [...current, Date.now()]);
  };

  return (
    <section className={`october-extra ${decoding ? "october-extra--decoding" : ""} ${revealed ? "october-extra--revealed" : ""}`} onClick={celebrate} aria-labelledby="october-extra-title">
      <div className="october-extra-glow october-extra-glow--one" />
      <div className="october-extra-glow october-extra-glow--two" />
      <div className="october-extra-stars" aria-hidden="true">
        {stars.map((star) => <i key={star.id} style={{ left: star.left, top: star.top, animationDelay: star.delay }} />)}
      </div>

      <div className="october-extra-stage">
        <div className="october-extra-heading" aria-hidden={revealed}>
          <div className="october-extra-line">{visibleMessage[0]}</div>
          <div className="october-extra-line october-extra-line--accent">{visibleMessage[1]}</div>
          <p>✦ Có một thông điệp đang bay lạc... ✦</p>
          <button type="button" onClick={decode} disabled={decoding}>{decoding ? "Đang giải mã..." : "Giải mã 💌"}</button>
        </div>

        {decoding && !revealed && (
          <div className="october-extra-particles" aria-hidden="true" onAnimationEnd={() => setRevealed(true)}>
            {particles.map((particle) => (
              <span key={particle.id} style={{ left: particle.left, top: particle.top, ["--tx" as string]: particle.x, ["--ty" as string]: particle.y, ["--rot" as string]: particle.rotate, animationDelay: particle.delay }}>{particle.char}</span>
            ))}
          </div>
        )}

        {revealed && (
          <article className="october-extra-card">
            <span className="october-extra-badge">20 · 10 &nbsp; Ngày Phụ nữ Việt Nam</span>
            <div className="october-extra-heart">💖</div>
            <p className="october-extra-kicker">Gửi riêng cho</p>
            <h2 id="october-extra-title">Hồng Lạc</h2>
            <div className="october-extra-ornament">❀ ❤ ❀</div>
            <p className="october-extra-intro">Nhân ngày 20/10, chúc Hồng Lạc luôn xinh đẹp, rạng rỡ như đóa hồng đầu mùa. Mong mỗi ngày đều ngập tràn tiếng cười và thật nhiều yêu thương. 🌸</p>
            <div className="october-extra-wishes">
              {wishes.map(([icon, title, text]) => <div className="october-extra-wish" key={title}><i>{icon}</i><b>{title}</b><span>{text}</span></div>)}
            </div>
            <p className="october-extra-quote">Cảm ơn bạn vì đã xuất hiện và làm thế giới này dịu dàng hơn rất nhiều.</p>
            <p className="october-extra-sign">— Một người luôn nghĩ đến bạn 🌹</p>
            <small className="october-extra-hint">Nhấn vào thẻ để thả thêm tim ♡</small>
          </article>
        )}
      </div>

      {bursts.map((burst) => <span className="october-extra-burst" key={burst}>💖</span>)}
    </section>
  );
}
