import { SecretLetterSection } from "./SecretLetterSection";

type SectionPageKind = "october20" | "november20";

const content: Record<
  SectionPageKind,
  Array<{
    eyebrow: string;
    title: string;
    text: string;
    text2?: string;
    text3?: string;
  }>
> = {
  october20: [
    {
      eyebrow: "20 tháng 10",
      title: "Chúc mừng ngày của cô",
      text: "Chúc cô luôn rạng rỡ, dịu dàng và nhận thật nhiều yêu thương trong ngày đặc biệt này.",
    },
    {
      eyebrow: "Lời mở đầu",
      title: "Gửi cô bằng tất cả yêu thương",
      text: "Có những người phụ nữ làm cho thế giới quanh mình trở nên dịu dàng và ấm áp hơn. Và với con, cô là một người như thế.",
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
      eyebrow: "Kỷ niệm",
      title: "Những khoảnh khắc dịu dàng",
      text: "Mong những ngày phía trước sẽ luôn mang đến cho cô thật nhiều nụ cười và bình an.",
    },
    {
      eyebrow: "Lời kết",
      title: "Chúc cô một ngày 20/10 thật vui",
      text: "Chúc cô luôn hạnh phúc, khỏe mạnh và được yêu thương theo cách cô xứng đáng nhận.",
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
  return (
    <div className="november-page">
      {content[kind].map((section, index) => (
        /* Legacy section 3 background/text is preserved below for the fallback page. */
        kind === "october20" && index === 2 ? <SecretLetterSection key="secret-letter-section" /> : <section
          className={`november-section ${index === 1 ? "november-section--fixed-background" : ""}`}
          key={section.eyebrow}
          style={{ backgroundImage: `url(/assets/section-${index + 1}.png)` }}
        >
          <div
            className={`november-content ${index === 1 ? "november-content--section-two" : index === 2 ? "november-content--tilted" : index % 2 === 0 ? "november-content--left" : "november-content--center"}`}
          >
            <p className="eyebrow">{section.eyebrow}</p>
            <h1>{section.title}</h1>
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
            {index === content[kind].length - 1 && (
              <span className="handwritten">Thương gửi cô ♡</span>
            )}
          </div>
          {index < content[kind].length - 1 && (
            <span className="section-scroll-hint">↓</span>
          )}
        </section>
      ))}
    </div>
  );
}

