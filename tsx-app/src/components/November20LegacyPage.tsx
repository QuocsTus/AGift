import { useEffect, useRef } from "react";

export function November20LegacyPage() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    return () => {
      frameRef.current?.contentWindow?.postMessage(
        { type: "agift:stop-november-music" },
        window.location.origin,
      );
    };
  }, []);

  return (
    <iframe
      ref={frameRef}
      className="legacy-frame legacy-frame--november"
      src="/nguoi-lai-do-20-11/index.html"
      title="Người Lái Đò Giữa Ngàn Ánh Sao - Tri ân ngày 20/11"
    />
  );
}
