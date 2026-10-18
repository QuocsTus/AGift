import { useEffect, useRef, useState } from "react";
import { October20OriginalEffect } from "./October20OriginalEffect";
import { SecretLetterSection } from "./SecretLetterSection";

type SectionPageKind = "october20" | "november20";

const content: Record<
  SectionPageKind,
  Array<{
    eyebrow?: string;
    title: string;
    text: string;
    text2?: string;
    text3?: string;
    text4?: string;
    wish?: string;
  }>
> = {
  october20: [
    {
      eyebrow: "20 tháng 10",
      title: "Một ngày dành riêng cho cô.",
      text: "Có những người phụ nữ làm cho thế giới quanh mình trở nên dịu dàng hơn. Và với con, cô là một người như thế.",
    },
    {
      title: "Gửi cô bằng tất cả yêu thương",
      text: "Có lẽ cô đã quen với việc quan tâm đến mọi người, quen với việc luôn phải mạnh mẽ và chu toàn. Nhưng hôm nay, con muốn cô biết rằng: những điều cô làm, những yêu thương cô trao đi đều có người ghi nhớ. Và con thật lòng biết ơn vì trong hành trình trưởng thành của mình con có duyên được gặp cô.",
    },
    {
      eyebrow: "",
      title: "",
      text: "Nhân ngày 20/10, con chúc cô luôn mạnh khỏe, bình an, hạnh phúc và luôn rạng rỡ với nụ cười thật tươi. Mong rằng người luôn dành nhiều yêu thương cho mọi người nhu cô cũng sẽ nhận lại thật nhiều yêu thương, luôn có những ngày nhẹ nhàng, những niềm vui bất ngờ và thật nhiều điều tốt đẹp trong cuộc sống.",
      text2:
        "Hôm nay, con muong cô tạm gác lại những bộn bề công việc để tận hưởng một ngày thật đặc biệt - ngày mà cô được yêu thương, được quan tâm và được nhận những điều ngọt ngào nhất.",
      text3: "Chúc cô mộ ngày 20/10 thật đẹp!",
    },
    {
      title: "Những khoảnh khắc dịu dàng",
      text: "🌸 Con mong cô luôn có thời gian dành cho chính mình.",
      text2: "🌸 Con mong mỗi ngày của cô đều có những niềm vui nhỏ bé.",
      text3:
        "🌸 Con mong những vất vả cô âm thầm gánh vác được đáp lại bằng sự quan tâm và sẻ chia.",
      text4:
        "🌸 Con mong cô luôn được sống vui vẻ, bình yên và làm những điều khiến mình hạnh phúc.",
    },
    {
      title: "Con kính chúc cô một ngày 20/10 thật vui",
      text: "Con không mong cô lúc nào cũng phải mạnh mẽ, cũng chẳng mong cô luôn hoàn hảo trong mắt mọi người. Con chỉ mong cô có thật nhiều bình an, có người để sẻ chia những lúc mệt mỏi và luôn tìm thấy niềm vui trong những điều giản dị nhất.",
      wish: "Chúc mừng ngày 20/10, cô Bình của con!",
    },
  ],
  november20: [
    {
      eyebrow: "20 tháng 11",
      title: "Tri ân người gieo mầm",
      text: "Có những người không chỉ dạy ta một bài học, mà còn dạy ta cách lớn lên bằng yêu thương.",
    },
    {
      eyebrow: "Lời mở đầu",
      title: "Gửi cô bằng tất cả lòng biết ơn",
      text: "Cảm ơn cô vì đã kiên nhẫn lắng nghe, dịu dàng dẫn lối và luôn tin vào chúng con.",
    },
    {
      eyebrow: "Những bài học",
      title: "Điều cô để lại",
      text: "Mỗi lời giảng, mỗi ánh mắt động viên đều trở thành một phần đẹp đẽ trong hành trình trưởng thành.",
    },
    {
      eyebrow: "Kỷ niệm",
      title: "Những mùa xanh đã qua",
      text: "Thời gian có thể đưa chúng con đi xa, nhưng những ký ức về cô vẫn luôn ở lại.",
    },
    {
      eyebrow: "Lời kết",
      title: "Chúc cô một ngày 20/11 thật vui",
      text: "Mong cô luôn bình an, hạnh phúc và tiếp tục tỏa sáng trên hành trình gieo những hạt mầm xanh.",
    },
  ],
};

export function FiveSectionPage({ kind }: { kind: SectionPageKind }) {
  const renderOrder = [0, 2, 3, 1, 4];
  const sectionThreeRef = useRef<HTMLElement>(null);
  const [sectionThreeVisible, setSectionThreeVisible] = useState(false);

  useEffect(() => {
    const section = sectionThreeRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setSectionThreeVisible(true);
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [kind]);

  return (
    <div className="november-page">
      {renderOrder.map((originalIndex, renderIndex) => {
        const section = content[kind][originalIndex];
        const sectionTitle =
          kind === "october20" && originalIndex === 0
            ? "Một ngày dành riêng cho cô"
            : section.title;
        const isSectionTwo = originalIndex === 1;
        const isSectionThree = renderIndex === 2;
        const isSecretLetterSection =
          kind === "october20" && originalIndex === 2;
        const wish =
          section.wish ??
          (renderIndex === renderOrder.length - 1
            ? "Chúc cô luôn bình an, hạnh phúc và ngập tràn yêu thương!"
            : undefined);

        /* Legacy section 3 background/text is preserved below for the fallback page. */
        return isSecretLetterSection ? (
          <SecretLetterSection key="secret-letter-section" />
        ) : (
          <section
            className={`november-section ${isSectionTwo ? "november-section--fixed-background" : ""}`}
            key={`${kind}-${originalIndex}`}
            ref={isSectionThree ? sectionThreeRef : undefined}
            style={{
              backgroundImage: `url(/assets/section-${originalIndex + 1}.png)`,
            }}
          >
            <div
              className={`november-content ${kind === "october20" && originalIndex === 0 ? "november-content--first" : isSectionTwo ? "november-content--section-two" : isSectionThree ? `november-content--section-three${sectionThreeVisible ? " section-three-is-visible" : ""}` : originalIndex === 4 ? "november-content--section-five" : originalIndex % 2 === 0 ? "november-content--left" : "november-content--center"}`}
            >
              <p className="eyebrow">{section.eyebrow}</p>
              <h1>{sectionTitle}</h1>
              <p className="november-message">{section.text}</p>
              {section.text2 && (
                <p className="november-message november-message--additional">
                  {section.text2}
                </p>
              )}
              {section.text3 && (
                <p className="november-message november-message--additional">
                  {section.text3}
                </p>
              )}
              {section.text4 && (
                <p className="november-message november-message--additional">
                  {section.text4}
                </p>
              )}
              {wish && <p className="november-wish">{wish}</p>}
              {renderIndex === renderOrder.length - 1 && (
                <p>
                  <p className="handwritten">Thương gửi cô ♥</p>
                  <p className="handwritten">
                    Học trò Phan Thế Nam dành tặng cô Lê Thị Bình
                  </p>
                </p>
              )}
            </div>
          </section>
        );
      })}
      {kind === "october20" && <October20OriginalEffect />}
    </div>
  );
}
