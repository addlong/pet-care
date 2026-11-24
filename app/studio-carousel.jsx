'use client';

import { useEffect, useRef, useState } from 'react';

const slides = [
  {
    image: 'reception.jpg',
    alt: '浅色石材接待台、弧形木饰面和粉色长椅组成的接待空间',
    title: '接待休息区',
    description: '在沙发区等候，也可以和洗护师聊聊毛孩子平时的习惯。',
  },
  {
    image: 'wash.jpg',
    alt: '暖粉色瓷砖、专用宠物浴槽和整齐叠放的浅色毛巾',
    title: '精洗护理区',
    description: '独立洗浴台配有专用喷头，毛巾与清洁用品分区收纳。',
  },
  {
    image: 'grooming.jpg',
    alt: '拱形镜前的专业美容台，旁边是浅橡木柜和整齐摆放的梳剪工具',
    title: '美容造型区',
    description: '在光线充足的美容台梳毛、修剪，完成整体造型。',
  },
];

export default function StudioCarousel() {
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
    const timer = window.setTimeout(() => setActive((active + 1) % slides.length), 6500);
    return () => window.clearTimeout(timer);
  }, [active, playing, visible, hovered, pageVisible]);

  function selectSlide(index) {
    setPlaying(false);
    setActive((index + slides.length) % slides.length);
  }

  return (
    <section className="section wrap studio" id="studio" aria-labelledby="studio-title">
      <div className="section-head">
        <h2 id="studio-title">店内环境</h2>
        <p>接待、精洗与造型空间 · AI 生成的设计示意</p>
      </div>
      <div
        ref={frame}
        className="studio-frame"
        role="group"
        aria-roledescription="轮播"
        aria-label="三个洗护空间"
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            selectSlide(active + (event.key === 'ArrowLeft' ? -1 : 1));
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
        <div className="studio-slides" aria-live={ready && !playing ? 'polite' : 'off'}>
          {slides.map(({ image, alt, title, description }, index) => (
            <figure
              key={image}
              className="studio-slide"
              role="group"
              aria-label={`第 ${index + 1} 张，共 ${slides.length} 张`}
              hidden={index !== active}
            >
              <img src={`/images/${image}`} alt={alt} loading="lazy" />
              <figcaption><h3>{title}</h3><p>{description}</p></figcaption>
            </figure>
          ))}
        </div>
        <div className="studio-controls" hidden={!ready}>
          <button
            ref={playback}
            className="studio-play"
            type="button"
            aria-label={playing ? '暂停自动轮播' : '开始自动轮播'}
            onClick={() => setPlaying(!playing)}
          >
            {playing ? 'Ⅱ' : '▶'}
          </button>
          <div className="studio-dots" role="group" aria-label="选择区域">
            {slides.map(({ title }, index) => (
              <button
                key={title}
                className="studio-dot"
                type="button"
                aria-label={`查看${title}`}
                aria-current={index === active ? 'true' : undefined}
                onClick={() => selectSlide(index)}
              />
            ))}
          </div>
          <div className="studio-arrows">
            <button className="studio-arrow studio-prev" type="button" aria-label="上一个区域" onClick={() => selectSlide(active - 1)}>
              <svg className="icon" aria-hidden="true"><use href="#arrow" /></svg>
            </button>
            <button className="studio-arrow studio-next" type="button" aria-label="下一个区域" onClick={() => selectSlide(active + 1)}>
              <svg className="icon" aria-hidden="true"><use href="#arrow" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
