import { memories } from "../data";

export function BirthdaySections() {
  return (
    <>
      <section className="section-block" id="ky-niem">
        <div className="section-heading">
          <p className="eyebrow">Một hành trình đáng nhớ</p>
          <h2>Những mùa xanh đã qua</h2>
        </div>
        <div className="memory-grid">
          {memories.map((memory) => (
            <article className="memory-card" key={memory.title}>
              <img src={memory.image} alt={memory.title} loading="lazy" />
              <div><h3>{memory.title}</h3><p>{memory.text}</p></div>
            </article>
          ))}
        </div>
      </section>
      <section className="letter-section" id="loi-nhan">
        <div><p className="eyebrow">Lời con muốn nói</p><h2>Cảm ơn cô vì tất cả</h2></div>
        <p>Mai này khi bước trên những con đường rộng hơn, con vẫn sẽ nhớ những bài học, ánh mắt và sự tận tâm mà cô đã trao.</p>
      </section>
    </>
  );
}
