'use client';

import { useEffect, useRef, useState } from 'react';

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
  {
    id: 'puppy-wash',
    author: '栗子的家长',
    service: '基础洗护',
    rating: 5,
    comment: '栗子第一次来洗澡，进门还一直往我身后躲。洗护师留了点时间让它熟悉环境，接它时已经肯自己走出去了。回家摸它的背，毛也吹得很干爽。',
  },
  {
    id: 'dog-deshedding',
    author: '布丁的家长',
    service: '毛发护理',
    rating: 5,
    comment: '布丁正好在换毛，梳下来一大团浮毛。店员给我看了背上容易漏梳的地方，还教我顺着毛分层梳，回家自己打理方便多了。',
  },
  {
    id: 'dog-shaping',
    author: '可乐的家长',
    service: '全套美容',
    rating: 4,
    comment: '可乐嘴边的毛平时喝水容易弄湿，这次修短后好擦多了。修剪前有确认我想要的造型，接它的时间比预计晚了一点。',
  },
].toSorted((first, second) => second.rating - first.rating);

export default function CustomerReviews() {
  const frame = useRef(null);
  const playback = useRef(null);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = (event) => {
      if (event.matches) setPlaying(false);
    };
    const onVisibilityChange = () => setPageVisible(!document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.25);
    }, { threshold: 0.25 });

    setPlaying(!reducedMotion.matches);
    onVisibilityChange();
    observer.observe(frame.current);
    reducedMotion.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', onVisibilityChange);
    setReady(true);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!playing || !visible || hovered || !pageVisible) return;
    const timer = window.setTimeout(() => setActive((active + 1) % reviews.length), 8000);
    return () => window.clearTimeout(timer);
  }, [active, playing, visible, hovered, pageVisible]);

  function selectReview(index) {
    setPlaying(false);
    setActive((index + reviews.length) % reviews.length);
  }

  return (
    <section className="section wrap reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="section-head">
        <h2 id="reviews-title">客户评价</h2>
        <p>以下为示例评价</p>
      </div>
      <div
        ref={frame}
        className="review-carousel"
        role="group"
        aria-roledescription="轮播"
        aria-label="按评分排序的客户评价"
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            selectReview(active + (event.key === 'ArrowLeft' ? -1 : 1));
          }
        }}
        onFocus={(event) => {
          if (event.target !== playback.current) setPlaying(false);
        }}
        onPointerEnter={(event) => {
          if (event.pointerType !== 'touch') setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
      >
        <div className="review-slides" aria-live={ready && !playing ? 'polite' : 'off'}>
          {reviews.map(({ id, author, service, rating, comment }, index) => (
            <figure className="card review-card" key={id} aria-hidden={index !== active}>
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
        <div className="studio-controls review-controls" hidden={!ready}>
          <button
            ref={playback}
            className="studio-play"
            type="button"
            aria-label={playing ? '暂停评价自动轮播' : '开始评价自动轮播'}
            onClick={() => setPlaying(!playing)}
          >
            {playing ? 'Ⅱ' : '▶'}
          </button>
          <div className="studio-dots" role="group" aria-label="选择评价">
            {reviews.map(({ id, author }, index) => (
              <button
                key={id}
                className="studio-dot"
                type="button"
                aria-label={`查看${author}的评价`}
                aria-current={index === active ? 'true' : undefined}
                onClick={() => selectReview(index)}
              />
            ))}
          </div>
          <div className="studio-arrows">
            <button className="studio-arrow studio-prev" type="button" aria-label="上一条评价" onClick={() => selectReview(active - 1)}>
              <svg className="icon" aria-hidden="true"><use href="#arrow" /></svg>
            </button>
            <button className="studio-arrow" type="button" aria-label="下一条评价" onClick={() => selectReview(active + 1)}>
              <svg className="icon" aria-hidden="true"><use href="#arrow" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
