import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type LetterState = "closed" | "opening" | "open" | "closing";

const petals = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  left: `${5 + ((index * 41) % 90)}%`,
  delay: `${(index % 7) * -1.7}s`,
  duration: `${9 + (index % 6)}s`,
  size: `${10 + (index % 4) * 3}px`,
}));

function EnvelopeVisual({ opening = false }: { opening?: boolean }) {
  return (
    <span
      className={
        opening
          ? "secret-v2-envelope secret-v2-envelope--opening-visual"
          : "secret-v2-envelope"
      }
      aria-hidden="true"
    >
      <span className="secret-v2-envelope__back" />
      <span className="secret-v2-letter-peek">
        <b>Gửi cô Bình kính yêu,</b>
        <i />
        <i />
      </span>
      <span className="secret-v2-envelope__front" />
      <span className="secret-v2-envelope__flap" />
      <span className="secret-v2-wax-seal">♡</span>
    </span>
  );
}

export function SecretLetterSection() {
  const [state, setState] = useState<LetterState>("closed");
  const [openingOrigin, setOpeningOrigin] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const scrollYRef = useRef(0);
  const scrollLockedRef = useRef(false);
  const bodyStylesRef = useRef<{
    overflow: string;
    position: string;
    top: string;
    width: string;
    paddingRight: string;
  } | null>(null);

  const openLetter = () => {
    if (state !== "closed") return;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("open");
      return;
    }

    const bounds = openButtonRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setOpeningOrigin({
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
    });
    setState("opening");
  };

  const closeLetter = () => {
    if (state === "closed" || state === "closing") return;
    setState("closing");
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && (state === "open" || state === "opening")) {
        closeLetter();
        return;
      }

      if (event.key !== "Tab" || state !== "open" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state]);

  const overlayActive = state !== "closed";
  useEffect(() => {
    if (!overlayActive) {
      if (scrollLockedRef.current && bodyStylesRef.current) {
        const previous = bodyStylesRef.current;
        document.body.style.overflow = previous.overflow;
        document.body.style.position = previous.position;
        document.body.style.top = previous.top;
        document.body.style.width = previous.width;
        document.body.style.paddingRight = previous.paddingRight;
        window.scrollTo(0, scrollYRef.current);
        scrollLockedRef.current = false;
        bodyStylesRef.current = null;
      }
      return;
    }

    if (scrollLockedRef.current) return;
    scrollYRef.current = window.scrollY;
    bodyStylesRef.current = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      paddingRight: document.body.style.paddingRight,
    };
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = "100%";
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    scrollLockedRef.current = true;
  }, [overlayActive]);

  useEffect(
    () => () => {
      if (!scrollLockedRef.current || !bodyStylesRef.current) return;
      const previous = bodyStylesRef.current;
      document.body.style.overflow = previous.overflow;
      document.body.style.position = previous.position;
      document.body.style.top = previous.top;
      document.body.style.width = previous.width;
      document.body.style.paddingRight = previous.paddingRight;
      window.scrollTo(0, scrollYRef.current);
    },
    [],
  );

  useEffect(() => {
    if (state === "open")
      window.requestAnimationFrame(() => dialogRef.current?.focus());
  }, [state]);

  const handleOpeningAnimationEnd = (
    event: React.AnimationEvent<HTMLSpanElement>,
  ) => {
    if (
      state === "opening" &&
      event.animationName === "secretV2EnvelopeFlyToCenter"
    ) {
      setOpeningOrigin(null);
      setState("open");
    }
  };

  const handleOverlayTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>,
  ) => {
    if (
      event.target === event.currentTarget &&
      state === "closing" &&
      event.propertyName === "opacity"
    ) {
      setState("closed");
      window.requestAnimationFrame(() => {
        openButtonRef.current?.focus();
        previousFocusRef.current = null;
      });
    }
  };

  const isReading = state === "open" || state === "closing";
  const overlay = (
    <div
      className={`secret-v2-overlay secret-v2-overlay--${state}`}
      role="presentation"
      onTransitionEnd={handleOverlayTransitionEnd}
    >
      <div className="secret-v2-backdrop" aria-hidden="true" />
      <div className="secret-v2-center-stage">
        {state === "opening" && openingOrigin && (
          <span
            className="secret-v2-opening-envelope"
            style={{
              left: `${openingOrigin.left}px`,
              top: `${openingOrigin.top}px`,
              width: `${openingOrigin.width}px`,
            }}
            onAnimationEnd={handleOpeningAnimationEnd}
            aria-hidden="true"
          >
            <EnvelopeVisual opening />
          </span>
        )}
        <div className="secret-v2-ambient-petals" aria-hidden="true">
          ✦
        </div>
        <article
          ref={dialogRef}
          className="secret-v2-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="secret-v2-letter-title"
          aria-hidden={!isReading}
          tabIndex={isReading ? -1 : undefined}
        >
          <button
            className="secret-v2-close"
            type="button"
            onClick={closeLetter}
            aria-label="Đóng thư"
          >
            ×
          </button>
          <div className="secret-v2-paper-flower" aria-hidden="true">
            ✿
          </div>
          <p className="eyebrow">Lời con muốn gửi đến cô</p>
          <h3 id="secret-v2-letter-title" tabIndex={-1}></h3>
          <div className="secret-v2-letter-copy">
            <p>
              Nhân ngày 20/10, con chúc cô luôn mạnh khỏe, bình an, hạnh phúc và
              luôn rạng rỡ với nụ cười thật tươi. Con mong rằng người luôn dành
              nhiều yêu thương cho mọi người như cô cũng sẽ nhận lại thật nhiều
              yêu thương, luôn có những ngày nhẹ nhàng, những niềm vui bất ngờ
              và thật nhiều điều tốt đẹp trong cuộc sống.
            </p>

            <p>
              Hôm nay, con mong cô tạm gác lại những bộn bề công việc để tận
              hưởng một ngày thật đặc biệt - ngày mà cô được yêu thương, được
              quan tâm và được nhận những điều ngọt ngào nhất.
            </p>
            <p>Con chúc cô một ngày 20/10 thật đẹp!</p>
            <p className="secret-v2-signature">
              <span>Từ con Phan Thế Nam ♡ ♡ ♡</span>
            </p>
          </div>
          <button
            className="secret-v2-close-action"
            type="button"
            onClick={closeLetter}
          >
            Đóng thư
          </button>
        </article>
      </div>
    </div>
  );

  return (
    <section
      className={`secret-v2-section secret-v2-section--${state}`}
      aria-labelledby="secret-v2-title"
    >
      <div
        className="secret-v2-floral secret-v2-floral--top-left"
        aria-hidden="true"
      >
        <i />
        <i />
        <i />
      </div>
      <div
        className="secret-v2-floral secret-v2-floral--bottom-right"
        aria-hidden="true"
      >
        <i />
        <i />
        <i />
        <b />
      </div>
      <div className="secret-v2-petals" aria-hidden="true">
        {petals.map((petal) => (
          <span
            key={petal.id}
            style={{
              left: petal.left,
              animationDelay: petal.delay,
              animationDuration: petal.duration,
              width: petal.size,
              height: petal.size,
            }}
          />
        ))}
      </div>

      <div className="secret-v2-content">
        <header className="secret-v2-header">
          <h2 id="secret-v2-title">
            Có những điều con chưa từng nói thành lời...
          </h2>
          <small>Một lá thư đặc biệt dành riêng cho cô.</small>
        </header>

        <div className="secret-v2-envelope-stage">
          <button
            ref={openButtonRef}
            className="secret-v2-envelope-button"
            type="button"
            onClick={isReading ? closeLetter : openLetter}
            disabled={state === "opening"}
            aria-label={isReading ? "Đóng thư" : "Mở thư gửi cô"}
          >
            <span className="secret-v2-envelope-placeholder" aria-hidden="true">
              <EnvelopeVisual />
            </span>
          </button>
        </div>

        {state !== "open" && state !== "closing" && (
          <button
            className="secret-v2-action"
            type="button"
            onClick={openLetter}
            disabled={state === "opening"}
          >
            {state === "opening" ? "Đang mở thư..." : "💌 Mở thư gửi cô"}
          </button>
        )}
      </div>

      {overlayActive && createPortal(overlay, document.body)}
    </section>
  );
}
