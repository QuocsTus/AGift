import { useEffect, useRef } from "react";

export function LegacyBirthdayPage() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    return () => {
      frameRef.current?.contentWindow?.postMessage(
        { type: "agift:stop-birthday-music" },
        window.location.origin,
      );
    };
  }, []);

  return (
    <iframe
      ref={frameRef}
      className="legacy-frame"
      src="/legacy-birthday.html"
      title="Người gieo mầm xanh - trang sinh nhật"
    />
  );
}
