import type { OccasionMeta } from "../types";

type OccasionPageProps = { occasion: OccasionMeta };

export function OccasionPage({ occasion }: OccasionPageProps) {
  const isOctober = occasion.label === "20/10";
  const gallery = isOctober
    ? ["/anh-khoanhkhac-2.png", "/anh-kiniem-1.jpg", "/anh-baihoc-2.png"]
    : ["/anh-hanhtrinh-1.png", "/anh-baihoc-1.png", "/anh-kiniem-2.jpg"];

  return (
    <>
      <section className="occasion-page occasion-page--detail">
        <div className="occasion-copy">
          <p className="eyebrow">{occasion.eyebrow}</p>
          <h1>{occasion.title}</h1>
          <p className="lead">{occasion.message}</p>
          <div className="occasion-actions">
            <a className="primary-button" href="#loi-nhan">Đọc lời nhắn</a>
            <span className="handwritten">Một lời cảm ơn thật lòng</span>
          </div>
        </div>
        <div className="hero-art" aria-label="Minh họa cây xanh" role="img">
          <div className="sun-glow" />
          <div className="tree-canopy">✦</div>
          <div className="tree-trunk" />
          <span className="leaf leaf-one">♡</span>
          <span className="leaf leaf-two">♡</span>
          <span className="leaf leaf-three">♡</span>
        </div>
      </section>

      <section className="occasion-note" id="loi-nhan">
        <div>
          <p className="eyebrow">Gửi tặng cô</p>
          <h2>{isOctober ? "Một ngày dịu dàng như nắng" : "Người đã gieo mầm xanh"}</h2>
        </div>
        <p>
          {isOctober
            ? "Mong cô luôn giữ được nụ cười ấm áp, sự dịu dàng và những ngày thật nhiều niềm vui. Cô xứng đáng với tất cả điều tốt đẹp nhất."
            : "Mỗi bài giảng, mỗi lời động viên của cô đều ở lại trong hành trình trưởng thành của chúng con. Cảm ơn cô vì đã luôn tin tưởng và đồng hành."
          }
        </p>
      </section>

      <section className="occasion-gallery">
        <div className="section-heading">
          <p className="eyebrow">Những điều còn ở lại</p>
          <h2>Kỷ niệm được nâng niu</h2>
        </div>
        <div className="occasion-gallery-grid">
          {gallery.map((image, index) => (
            <figure className={index === 1 ? "occasion-photo occasion-photo--featured" : "occasion-photo"} key={image}>
              <img src={image} alt={`${occasion.label} - kỷ niệm ${index + 1}`} loading="lazy" />
              <figcaption>{index === 0 ? "Một khoảng trời thân thương" : index === 1 ? "Cảm ơn vì đã luôn ở đây" : "Những mùa xanh đã qua"}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
