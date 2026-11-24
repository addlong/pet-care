import { BookingButton, BookingProvider, HeroBookingActions } from './booking.jsx';
import StudioCarousel from './studio-carousel.jsx';
import { defaultBookingTimeZone } from '../lib/booking-fields.js';

export const dynamic = 'force-dynamic';

export default function Home() {
  const timeZone = process.env.BOOKING_TIME_ZONE?.trim() || defaultBookingTimeZone;
  return (
    <BookingProvider timeZone={timeZone}>
      <svg className="symbols" aria-hidden="true">
        <symbol id="paw" viewBox="0 0 24 24"><ellipse cx="5.3" cy="9.3" rx="2.3" ry="3" transform="rotate(-24 5.3 9.3)"/><ellipse cx="9.4" cy="5.6" rx="2.15" ry="3" transform="rotate(-12 9.4 5.6)"/><ellipse cx="14.6" cy="5.6" rx="2.15" ry="3" transform="rotate(12 14.6 5.6)"/><ellipse cx="18.7" cy="9.3" rx="2.3" ry="3" transform="rotate(24 18.7 9.3)"/><path d="M12 10.6c2.3 0 3.5 2.5 5.2 4 2.2 1.9 2.2 5.7-.9 6.3-1.8.3-3-1.1-4.3-1.1s-2.5 1.4-4.3 1.1c-3.1-.6-3.1-4.4-.9-6.3 1.7-1.5 2.9-4 5.2-4Z"/></symbol>
        <symbol id="spark" viewBox="0 0 24 24"><path d="M10 3l1.9 5.1L17 10l-5.1 1.9L10 17l-1.9-5.1L3 10l5.1-1.9L10 3ZM18 13l1.1 2.9L22 17l-2.9 1.1L18 21l-1.1-2.9L14 17l2.9-1.1L18 13Z"/></symbol>
        <symbol id="arrow" viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6"/></symbol>
        <symbol id="calendar" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 5h2m4 0h2"/></symbol>
        <symbol id="heart" viewBox="0 0 24 24"><path d="M20.8 8.4c0-4.4-5.4-5.7-8.8-1.9-3.4-3.8-8.8-2.5-8.8 1.9 0 4.3 5.3 7.8 8.8 11.1 3.5-3.3 8.8-6.8 8.8-11.1Z"/></symbol>
        <symbol id="drop" viewBox="0 0 24 24"><path d="M12 3c2.6 4.1 6.7 7.7 6.7 11.4a6.7 6.7 0 1 1-13.4 0C5.3 10.7 9.4 7.1 12 3Z"/><path d="M8.6 15.2c.2 1.4 1.1 2.4 2.5 2.8"/></symbol>
        <symbol id="scissors" viewBox="0 0 24 24"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="m8.1 8.2 12.4 12.3M8.1 15.8 20.5 3.5"/></symbol>
        <symbol id="leaf" viewBox="0 0 24 24"><path d="M5 19c3.1-5.2 6-7.4 11-10m4-5c-8.7 0-15 3.3-15 9 0 3.5 2.4 5.6 5.8 5.6C17.3 18.6 20 12 20 4Z"/></symbol>
        <symbol id="shield" viewBox="0 0 24 24"><path d="M12 22s7-3.5 7-10V5l-7-3-7 3v7c0 6.5 7 10 7 10Z"/><path d="m9 12 2 2 4-4"/></symbol>
      </svg>

      <a className="btn skip" href="#main">跳到正文</a>
      <header id="top">
        <div className="wrap header-row">
          <a className="brand" href="#top" aria-label="奥利奥之家首页">
            <span className="brand-mark"><svg className="icon" aria-hidden="true"><use href="#paw"/></svg></span>
            奥利奥之家
          </a>
          <nav aria-label="主导航">
            <a href="#services">洗护服务</a>
            <a href="#studio">店内环境</a>
            <a href="#visit">到店流程</a>
            <a href="#faq">常见问题</a>
          </nav>
          <BookingButton className="btn btn-small">
            <svg className="icon" aria-hidden="true"><use href="#calendar"/></svg> 预约洗护
          </BookingButton>
        </div>
      </header>

      <main id="main">
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><svg className="icon" aria-hidden="true"><use href="#spark"/></svg> 狗狗及猫咪洗护</div>
              <h1 id="hero-title">洗个舒服澡，<span>蓬松地回家。</span></h1>
              <p>从洗澡吹干到剪毛修爪，按毛孩子的性格和毛发状况安排护理。怕水、怕吹风，也可以慢慢来。</p>
              <HeroBookingActions />
            </div>
            <figure className="hero-photo">
              <img src="/images/hero.jpg" width="1152" height="1260" alt="一只头顶泡泡的杏色贵宾犬趴在粉色浴缸边" />
            </figure>
          </div>
          <ul className="benefits" aria-label="服务特点">
            <li><svg className="icon" aria-hidden="true"><use href="#heart"/></svg> 一对一护理</li>
            <li><svg className="icon" aria-hidden="true"><use href="#shield"/></svg> 工具一宠一消毒</li>
            <li><svg className="icon" aria-hidden="true"><use href="#leaf"/></svg> 犬猫分时预约</li>
          </ul>
        </section>

        <section className="section wrap" id="services" aria-labelledby="services-title">
          <div className="section-head">
            <h2 id="services-title">洗护服务</h2>
            <p>以下为示例价格，费用随体型、毛长与打结程度调整。</p>
          </div>
          <div className="cards">
            <article className="card">
              <span className="card-icon"><svg className="icon" aria-hidden="true"><use href="#drop"/></svg></span>
              <h3>基础洗护</h3>
              <p>温水清洁、吹干梳毛、清洁外耳、修剪指甲。</p>
              <div className="card-foot">
                <span className="price"><strong>¥68</strong> 起</span>
                <BookingButton className="text-link" service="基础洗护" aria-label="选择基础洗护">选这项 <svg className="icon" aria-hidden="true"><use href="#arrow"/></svg></BookingButton>
              </div>
            </article>
            <article className="card">
              <span className="card-icon"><svg className="icon" aria-hidden="true"><use href="#scissors"/></svg></span>
              <h3>全套美容</h3>
              <p>包含基础洗护，另有全身造型、面部和脚底修剪。</p>
              <div className="card-foot">
                <span className="price"><strong>¥138</strong> 起</span>
                <BookingButton className="text-link" service="全套美容" aria-label="选择全套美容">选这项 <svg className="icon" aria-hidden="true"><use href="#arrow"/></svg></BookingButton>
              </div>
            </article>
            <article className="card">
              <span className="card-icon"><svg className="icon" aria-hidden="true"><use href="#spark"/></svg></span>
              <h3>毛发护理</h3>
              <p>适合换毛季或长毛宠物，包含浮毛梳理、轻度解结与护毛。</p>
              <div className="card-foot">
                <span className="price"><strong>¥98</strong> 起</span>
                <BookingButton className="text-link" service="毛发护理" aria-label="选择毛发护理">选这项 <svg className="icon" aria-hidden="true"><use href="#arrow"/></svg></BookingButton>
              </div>
            </article>
          </div>
        </section>

        <StudioCarousel />

        <section className="section visit" id="visit" aria-labelledby="visit-title">
          <div className="wrap">
            <div className="section-head"><h2 id="visit-title">到店流程</h2></div>
            <ol className="cards steps">
              <li><span className="step-num">01</span><h3>选服务与到店时间</h3><p>预约时说明宠物种类，方便安排合适的时段。</p></li>
              <li><span className="step-num">02</span><h3>到店确认方案</h3><p>检查毛发和皮肤状况，确认护理项目与价格。</p></li>
              <li><span className="step-num">03</span><h3>洗护后接回家</h3><p>护理结束后查看修剪效果，了解在家怎么梳理。</p></li>
            </ol>
          </div>
        </section>

        <section className="section wrap faq" id="faq" aria-labelledby="faq-title">
          <div className="section-head"><h2 id="faq-title">常见问题</h2></div>
          <details>
            <summary>猫咪也可以来洗护吗？</summary>
            <p>可以。犬猫分时预约，到店后先观察猫咪的状态，再决定是否适合当天洗护。</p>
          </details>
          <details>
            <summary>一次洗护需要多久？</summary>
            <p>基础洗护通常约 45 至 90 分钟。体型较大、毛量较多或需要剪毛造型时，耗时可能更长。</p>
          </details>
          <details>
            <summary>洗澡前需要准备什么？</summary>
            <p>狗狗请佩戴牵引绳，猫咪请放在透气的外出包里。有皮肤敏感、怕吹风或曾在洗护中出现强烈应激，请提前告知。</p>
          </details>
        </section>

        <section className="wrap closing" aria-labelledby="closing-title">
          <div><h2 id="closing-title">预约下一次洗护</h2><p>选好服务，填写方便到店的日期和时间。</p></div>
          <BookingButton className="btn">预约洗护 <svg className="icon" aria-hidden="true"><use href="#arrow"/></svg></BookingButton>
        </section>
      </main>

      <footer>
        <div className="wrap footer-row">
          <span>奥利奥之家 Oreo's HOME · 宠物洗护</span>
          <span>示例门店 · 服务与价格仅供展示</span>
        </div>
      </footer>
    </BookingProvider>
  );
}
