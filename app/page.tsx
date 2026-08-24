"use client";

import { FormEvent, useState } from "react";

const navItems = [
  { label: "홈", href: "#home" },
  { label: "웨딩홀", href: "#웨딩홀" },
  { label: "스드메", href: "#스드메" },
  { label: "박람회", href: "#박람회" },
  { label: "플래너", href: "#플래너" },
];

const services = [
  { icon: "V", title: "웨딩홀", copy: "지역·예산별 베뉴 찾기", href: "#웨딩홀" },
  { icon: "S", title: "스드메", copy: "무드별 스타일 큐레이션", href: "#스드메" },
  { icon: "P", title: "플래너", copy: "나와 맞는 전문가 매칭", href: "#플래너" },
  { icon: "F", title: "웨딩페어", copy: "이번 달 단독 혜택", href: "#박람회" },
];

const venues = [
  {
    name: "더 리버 챕터",
    area: "서울 · 한남",
    mood: "RIVER VIEW",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "가든 온",
    area: "경기 · 분당",
    mood: "GARDEN",
    image: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "메종 드 블랑",
    area: "서울 · 청담",
    mood: "CLASSIC",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85",
  },
];

const styles = [
  {
    tab: "내추럴",
    title: "빛과 결이 살아 있는\n내추럴 웨딩",
    copy: "꾸미지 않은 듯 섬세한 채광과 부드러운 실루엣",
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1100&q=88",
    tags: ["#소프트메이크업", "#실크드레스", "#필름무드"],
  },
  {
    tab: "클래식",
    title: "시간이 지나도 우아한\n클래식 웨딩",
    copy: "정교한 드레스 라인과 깊이 있는 스튜디오 무드",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1100&q=88",
    tags: ["#로열클래식", "#새틴드레스", "#시그니처베일"],
  },
  {
    tab: "모던",
    title: "선명하고 감각적인\n모던 웨딩",
    copy: "미니멀한 공간과 도시적인 스타일링의 조화",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1100&q=88",
    tags: ["#시티웨딩", "#미니멀드레스", "#글로우메이크업"],
  },
];

const reviews = [
  {
    initials: "SH",
    name: "서하은 신부",
    meta: "김다온 플래너 · 2026.05",
    text: "취향을 먼저 알아봐 주고 선택지는 명확하게 정리해 줘서 준비 과정이 즐거웠어요. 특히 드레스 투어 날의 세심한 동행이 오래 기억에 남을 것 같아요.",
  },
  {
    initials: "JM",
    name: "정민우 신랑",
    meta: "윤서진 플래너 · 2026.04",
    text: "예산이 막막했는데 항목별 우선순위를 함께 잡아주셔서 부담 없이 결정할 수 있었습니다. 둘의 의견이 다를 때도 자연스럽게 균형을 찾아주셨어요.",
  },
  {
    initials: "YR",
    name: "이유리 신부",
    meta: "한유진 플래너 · 2026.03",
    text: "원하던 차분한 무드를 정확히 이해하고 스튜디오와 드레스를 연결해 주셨어요. 예상보다 훨씬 우리다운 사진과 예식을 완성했습니다.",
  },
];

export default function Home() {
  const [activeStyle, setActiveStyle] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  function submitConsultation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="site-shell">
      <aside className="intro-rail" aria-label="디어리 웨딩 소개">
        <div className="intro-inner">
          <div className="brand-lockup">
            <span className="brand-mark">D</span>
            <span>조금 더 우리다운 결혼 준비<br />감각적인 웨딩 큐레이션</span>
          </div>
          <p className="eyebrow">WEDDING, MADE PERSONAL</p>
          <h1>결혼 준비가,<br /><em>우리답게.</em></h1>
          <p className="intro-copy">
            웨딩홀부터 스드메, 예산과 일정까지<br />
            취향을 이해하는 플래너와 시작하세요.
          </p>
          <a className="rail-cta" href="#consult">무료 상담 시작하기 <span>↗</span></a>
          <div className="rail-foot">
            <span>DEARLY WEDDING</span>
            <span>SEOUL · KOREA</span>
          </div>
        </div>
      </aside>

      <section className="app-frame">
        <header className="topbar">
          <a className="wordmark" href="#home" aria-label="디어리 웨딩 홈">DEARLY</a>
          <nav aria-label="주요 메뉴">
            {navItems.map((item, index) => (
              <a key={item.label} className={index === 0 ? "active" : ""} href={item.href}>{item.label}</a>
            ))}
          </nav>
        </header>

        <section className="hero" id="home">
          <div className="hero-photo" role="img" aria-label="햇살 아래 서로 마주 보는 신랑 신부" />
          <div className="hero-shade" />
          <div className="hero-content">
            <p>FOR THE DAY YOU&apos;LL ALWAYS REMEMBER</p>
            <h2>설레는 시작부터<br />완벽한 그날까지</h2>
            <a href="#consult">나의 웨딩 찾기 <span>→</span></a>
          </div>
          <div className="hero-index"><b>01</b><span /><small>04</small></div>
        </section>

        <section className="service-grid" aria-label="웨딩 서비스 바로가기">
          {services.map((service) => (
            <a href={service.href} key={service.title}>
              <span className="service-icon">{service.icon}</span>
              <b>{service.title}</b>
              <small>{service.copy}</small>
              <i>→</i>
            </a>
          ))}
        </section>

        <section className="fair-banner" id="박람회">
          <div className="fair-copy">
            <p>DEARLY SIGNATURE FAIR</p>
            <h2>둘의 취향이<br />하나의 장면이 되는 곳</h2>
            <span>9.12 SAT — 9.13 SUN · 서울 코엑스</span>
            <a href="#consult">초대권 신청 <b>→</b></a>
          </div>
          <div className="fair-photo" role="img" aria-label="우아하게 장식된 웨딩 테이블" />
        </section>

        <section className="section venue-section" id="웨딩홀">
          <div className="section-head">
            <div>
              <p>VENUE CURATION</p>
              <h2>마음에 오래 남을<br />단 하나의 공간</h2>
            </div>
            <a href="#consult">전체보기 <span>↗</span></a>
          </div>
          <div className="venue-list">
            {venues.map((venue, index) => (
              <article className="venue-card" key={venue.name}>
                <div className="venue-image" style={{ backgroundImage: `url(${venue.image})` }}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <button type="button" aria-label={`${venue.name} 찜하기`}>♡</button>
                </div>
                <div className="venue-info">
                  <p>{venue.mood}</p>
                  <h3>{venue.name}</h3>
                  <span>{venue.area}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="style-section" id="스드메">
          <div className="style-topline">
            <p>MY WEDDING STYLE</p>
            <div className="style-tabs" role="tablist" aria-label="웨딩 스타일 선택">
              {styles.map((style, index) => (
                <button
                  key={style.tab}
                  type="button"
                  role="tab"
                  aria-selected={activeStyle === index}
                  className={activeStyle === index ? "selected" : ""}
                  onClick={() => setActiveStyle(index)}
                >
                  {style.tab}
                </button>
              ))}
            </div>
          </div>
          <div className="style-visual" role="tabpanel">
            <img src={styles[activeStyle].image} alt={`${styles[activeStyle].tab} 웨딩 스타일`} />
            <span className="style-number">0{activeStyle + 1}</span>
          </div>
          <div className="style-copy">
            <h2>{styles[activeStyle].title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
            <p>{styles[activeStyle].copy}</p>
            <div className="tag-row">
              {styles[activeStyle].tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <a href="#consult">이 스타일로 상담받기 <b>→</b></a>
          </div>
        </section>

        <section className="planner-section" id="플래너">
          <p>PERSONAL WEDDING PARTNER</p>
          <span className="planner-monogram">D</span>
          <h2>잘 맞는 플래너가<br />준비의 온도를 바꿉니다</h2>
          <p className="planner-copy">
            7가지 취향 질문에 답하면 예산, 일정, 무드가 맞는<br />
            디어리 플래너를 추천해 드려요.
          </p>
          <a href="#consult">1분 취향 테스트 <span>↗</span></a>
          <div className="planner-stats">
            <div><b>12+</b><span>YEARS<br />EXPERIENCE</span></div>
            <div><b>4.9</b><span>AVERAGE<br />RATING</span></div>
            <div><b>8,420</b><span>HAPPY<br />COUPLES</span></div>
          </div>
        </section>

        <section className="section review-section">
          <div className="section-head">
            <div>
              <p>REAL STORIES</p>
              <h2>먼저 준비해 본<br />두 사람의 이야기</h2>
            </div>
            <span className="review-rating"><b>4.9</b> / 5.0</span>
          </div>
          <div className="review-list">
            {reviews.map((review) => (
              <article key={review.name}>
                <div className="reviewer">
                  <span>{review.initials}</span>
                  <div><b>{review.name}</b><small>{review.meta}</small></div>
                </div>
                <div className="stars" aria-label="별점 5점">★★★★★</div>
                <p>{review.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="consult-section" id="consult">
          <div className="consult-intro">
            <p>BEGIN YOUR STORY</p>
            <h2>두 분의 이야기를<br />들려주세요</h2>
            <span>상담 신청 후 영업일 기준 1일 내 안내드립니다.</span>
          </div>
          {submitted ? (
            <div className="success-message" role="status">
              <span>✓</span>
              <h3>상담 신청이 준비되었습니다</h3>
              <p>이 데모에서는 정보가 외부로 전송되지 않습니다.<br />실제 운영 시 상담 시스템을 연결할 수 있어요.</p>
              <button type="button" onClick={() => setSubmitted(false)}>다시 작성하기</button>
            </div>
          ) : (
            <form onSubmit={submitConsultation}>
              <label>이름<input name="name" type="text" placeholder="성함을 입력해 주세요" required /></label>
              <label>연락처<input name="phone" type="tel" placeholder="010-0000-0000" required /></label>
              <label>예식 예정일<input name="date" type="month" /></label>
              <label>관심 서비스
                <select name="service" defaultValue="">
                  <option value="" disabled>선택해 주세요</option>
                  <option>웨딩홀</option><option>스드메</option><option>플래너</option><option>웨딩페어</option>
                </select>
              </label>
              <label className="consent"><input type="checkbox" required /> 개인정보 수집 및 상담 안내에 동의합니다.</label>
              <button className="submit-button" type="submit">무료 상담 신청 <span>→</span></button>
            </form>
          )}
        </section>

        <footer>
          <a className="footer-brand" href="#home">DEARLY</a>
          <p>두 사람의 취향에서 시작하는 웨딩 큐레이션</p>
          <div><a href="#home">이용약관</a><a href="#home">개인정보처리방침</a><a href="#consult">고객센터</a></div>
          <small>© 2026 DEARLY WEDDING. ALL RIGHTS RESERVED.</small>
        </footer>

        <a className="chat-button" href="#consult" aria-label="빠른 상담 신청">♡<span>빠른상담</span></a>
        <nav className="bottom-nav" aria-label="모바일 하단 메뉴">
          {navItems.slice(0, 4).map((item, index) => (
            <a key={item.label} href={item.href} className={index === 0 ? "active" : ""}>
              <span>{["⌂", "◇", "D", "♧"][index]}</span>{item.label}
            </a>
          ))}
        </nav>
      </section>
    </main>
  );
}
