const reviews = [
  {
    id: 'dog-bath',
    author: '团团的家长',
    service: '基础洗护',
    rating: 5,
    comment: '团团一听到吹风机就想躲。店员先让它闻了闻，再从低档慢慢吹。接它的时候，连平时容易打结的耳朵后面都梳顺了。',
  },
  {
    id: 'dog-trim',
    author: '豆包的家长',
    service: '全套美容',
    rating: 5,
    comment: '剪之前先问了我想留多长。眼睛周围修得清爽，脸还是圆圆的。回家后豆包在木地板上跑，脚底也没那么容易打滑了。',
  },
  {
    id: 'cat-brushing',
    author: '糯米的家长',
    service: '毛发护理',
    rating: 4,
    comment: '糯米怕狗叫，特地约了猫咪时段。梳完浮毛少了很多，店员还示范了怎么梳腋下。当天等了十来分钟，希望下次能准时些。',
  },
];

export default function CustomerReviews() {
  return (
    <section className="section wrap reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="section-head">
        <h2 id="reviews-title">客户评价</h2>
        <p>以下为示例评价</p>
      </div>
      <div className="cards">
        {reviews.map(({ id, author, service, rating, comment }) => (
          <figure className="card review-card" key={id}>
            <div className="review-stars">
              <span aria-hidden="true">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
              <span className="review-score">{rating} / 5 分</span>
            </div>
            <blockquote><p>{comment}</p></blockquote>
            <figcaption className="card-foot">
              <strong>{author}</strong>
              <span>{service}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
