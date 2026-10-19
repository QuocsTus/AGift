import { useEffect, useRef, useState } from "react";

export function October20OriginalEffect() {
  const sectionRef = useRef<HTMLElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setEnabled(true);
        observer.disconnect();
      },
      { rootMargin: "160px 0px", threshold: 0.05 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="october-original-effect" aria-label="Hiệu ứng lời chúc 20/10">
      {enabled ? (
        <iframe
          className="october-original-effect__frame"
          src="/20-10-effect.html?v=focus-box-center-1"
          title="Hiệu ứng lời chúc 20/10"
          loading="lazy"
        />
      ) : (
        <div className="october-original-effect__placeholder" aria-hidden="true">
          <span>Cuộn xuống để mở món quà 20/10 ✦</span>
        </div>
      )}
    </section>
  );
}
