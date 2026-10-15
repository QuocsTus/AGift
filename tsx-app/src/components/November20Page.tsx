const sections = [
  { image: "/section-1.png", eyebrow: "20 tháng 11", title: "Tri ân người gieo mầm", text: "Có những người không chỉ dạy ta một bài học, mà còn dạy ta cách lớn lên bằng yêu thương." },
  { image: "/section-2.png", eyebrow: "Lời mở đầu", title: "Gửi cô bằng tất cả lòng biết ơn", text: "Cảm ơn cô vì đã kiên nhẫn lắng nghe, dịu dàng dẫn lối và luôn tin vào chúng con." },
  { image: "/section-3.png", eyebrow: "Những bài học", title: "Điều cô để lại", text: "Mỗi lời giảng, mỗi ánh mắt động viên đều trở thành một phần đẹp đẽ trong hành trình trưởng thành." },
  { image: "/section-4.png", eyebrow: "Kỷ niệm", title: "Những mùa xanh đã qua", text: "Thời gian có thể đưa chúng con đi xa, nhưng những ký ức về cô vẫn luôn ở lại." },
  { image: "/section-5.png", eyebrow: "Lời kết", title: "Chúc cô một ngày 20/11 thật vui", text: "Mong cô luôn bình an, hạnh phúc và tiếp tục tỏa sáng trên hành trình gieo những hạt mầm xanh." },
];

export function November20Page() {
  return (
    <div className="november-page">
      {sections.map((section, index) => (
        <section className="november-section" key={section.image} style={{ backgroundImage: `url(/assets${section.image})` }}>
          <div className={`november-content ${index % 2 === 0 ? "november-content--left" : "november-content--center"}`}>
            <p className="eyebrow">{section.eyebrow}</p>
            <h1>{section.title}</h1>
            <p className="november-message">{section.text}</p>
            {index === sections.length - 1 && <span className="handwritten">Thương gửi cô ♡</span>}
          </div>
          {index < sections.length - 1 && <span className="section-scroll-hint">↓</span>}
        </section>
      ))}
    </div>
  );
}
