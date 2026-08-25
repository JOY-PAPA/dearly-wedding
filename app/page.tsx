"use client";

import { FormEvent, useEffect, useState } from "react";

const navItems = [
  { label: "플래너 소개", href: "#about" },
  { label: "실제 진행 후기", href: "#reviews" },
  { label: "인스타그램", href: "#instagram" },
  { label: "상담 문의", href: "#consult" },
];

const facts = [
  { value: "286", unit: "건", label: "누적 웨딩 진행" },
  { value: "12", unit: "년", label: "웨딩 플래닝 경력" },
  { value: "4.9", unit: "/ 5", label: "평균 상담 만족도" },
  { value: "1:1", unit: "", label: "처음부터 끝까지 전담" },
];

const process = [
  { step: "01", title: "취향 발견", copy: "두 분의 이야기와 우선순위를 충분히 듣고 원하는 결혼의 방향을 함께 찾습니다." },
  { step: "02", title: "맞춤 큐레이션", copy: "예산 안에서 웨딩홀, 스드메, 본식 스타일링을 꼭 맞는 선택지로 정리합니다." },
  { step: "03", title: "일정 동행", copy: "계약부터 투어, 촬영, 본식까지 놓치기 쉬운 일정을 한 걸음 먼저 챙깁니다." },
  { step: "04", title: "본식 케어", copy: "마지막 순간까지 현장을 세심하게 확인해 두 분은 설렘에만 집중할 수 있게 합니다." },
];

const blogReviews = [
  {
    category: "REAL WEDDING",
    title: "한남 리버뷰 웨딩, 두 사람의 취향을 담은 하루",
    date: "2026.05",
    excerpt: "예산의 우선순위부터 드레스 투어와 본식 동행까지, 차분한 아이보리 무드로 완성한 결혼 준비 이야기를 소개합니다.",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=88",
  },
  {
    category: "GARDEN WEDDING",
    title: "초여름의 빛을 살린 분당 가든 웨딩",
    date: "2026.04",
    excerpt: "서로 다른 의견에서 공통의 취향을 찾아가는 과정과 야외 예식 일정, 비용을 안정적으로 정리한 실제 사례입니다.",
    image: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=88",
  },
  {
    category: "CLASSIC WEDDING",
    title: "스튜디오부터 드레스까지 이어진 클래식 웨딩",
    date: "2026.03",
    excerpt: "말로 설명하기 어려웠던 차분한 무드를 발견하고 스튜디오, 드레스, 본식 스타일링을 하나의 결로 연결한 기록입니다.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=88",
  },
];

const instagramPosts = [
  { image: "/instagram/daae-gi-01.jpg", href: "https://www.instagram.com/daae_gi/reel/DcLmbn0I7x_/", alt: "김다애 플래너 인스타그램 릴스 썸네일", tag: "REELS" },
  { image: "/instagram/daae-gi-02.jpg", href: "https://www.instagram.com/daae_gi/p/DcJUDGen-Sn/", alt: "김다애 플래너 인스타그램 게시물 썸네일", tag: "INSTAGRAM" },
  { image: "/instagram/daae-gi-03.jpg", href: "https://www.instagram.com/daae_gi/p/DcJS6YWH5CD/", alt: "김다애 플래너 인스타그램 게시물 썸네일", tag: "INSTAGRAM" },
  { image: "/instagram/daae-gi-04.jpg", href: "https://www.instagram.com/daae_gi/p/DcJSu10n34S/", alt: "김다애 플래너 인스타그램 게시물 썸네일", tag: "INSTAGRAM" },
  { image: "/instagram/daae-gi-05.jpg", href: "https://www.instagram.com/daae_gi/p/DcBnWHvn7OL/", alt: "김다애 플래너 인스타그램 게시물 썸네일", tag: "INSTAGRAM" },
  { image: "/instagram/daae-gi-06.jpg", href: "https://www.instagram.com/daae_gi/p/DcBmZ4Ho4hn/", alt: "김다애 플래너 인스타그램 게시물 썸네일", tag: "INSTAGRAM" },
];

const instagramUrl = "https://www.instagram.com/daae_gi?igsi=djN6ZDVycWMxeTh2";

const faqs = [
  { question: "상담은 어떤 방식으로 진행되나요?", answer: "간단한 사전 질문지를 받은 뒤 40분 내외의 1:1 상담으로 진행합니다. 두 분의 예산, 일정, 취향을 듣고 준비 순서와 우선순위를 함께 정리해 드려요." },
  { question: "예식 날짜가 아직 없어도 괜찮나요?", answer: "네. 시기와 지역만 대략 정해져 있어도 충분합니다. 원하는 계절과 하객 규모를 바탕으로 웨딩홀 탐색부터 차근차근 도와드려요." },
  { question: "준비 중간부터 플래닝을 받을 수도 있나요?", answer: "가능합니다. 현재 계약과 진행 상황을 먼저 점검한 뒤 남은 항목에 맞춰 필요한 범위로 플래닝을 안내해 드립니다." },
];

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [availableDays, setAvailableDays] = useState<number | null>(null);

  useEffect(() => {
    const randomValue = crypto.getRandomValues(new Uint32Array(1))[0];
    setAvailableDays((randomValue % 12) + 1);
  }, []);

  function submitConsultation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="site-shell">
      <aside className="intro-rail" aria-label="디어리 웨딩 소개">
        <div className="intro-inner">
          <a className="brand-lockup" href="#reviews" aria-label="실제 진행 후기 보기">
            <span className="brand-mark">D</span>
            <span>한분 한분 정성 플래닝<br />실제 진행 후기</span>
          </a>
          <p className="eyebrow">WEDDING, MADE PERSONAL</p>
          <h1><span className="planner-company">베리굿 웨딩</span><em className="planner-name">김다애 플래너</em></h1>
          <p className="intro-copy">처음 만나는 날부터 예식이 끝나는 순간까지<br />김다애 플래너가 두 분 곁에서 함께합니다.</p>
          <a className="rail-cta" href="#consult">무료 상담 시작하기 <span>↗</span></a>
          <div className="rail-foot"><span>DEARLY WEDDING</span><span>SEOUL · KOREA</span></div>
        </div>
      </aside>

      <section className="app-frame">
        <header className="topbar">
          <a className="wordmark" href="#home" aria-label="디어리 웨딩 홈">DEARLY</a>
          <nav aria-label="주요 메뉴">
            {navItems.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}
          </nav>
        </header>

        <section className="hero" id="home">
          <div className="hero-photo" role="img" aria-label="넓은 초원에서 손을 잡고 걷는 신랑 신부의 항공 사진" />
          <div className="hero-shade" />
          <div className="hero-content">
            <p>YOUR PERSONAL WEDDING PLANNER</p>
            <h2>둘의 취향을 듣고<br />한 편의 결혼을 만듭니다</h2>
            <a href="#about">플래너 만나보기 <span>→</span></a>
          </div>
          <div className="hero-index"><b>DAON KIM</b><span /><small>WEDDING PLANNER</small></div>
        </section>

        <section className="fact-grid" aria-label="플래너 주요 경력">
          {facts.map((fact) => (
            <div key={fact.label}><p><b>{fact.value}</b><span>{fact.unit}</span></p><small>{fact.label}</small></div>
          ))}
        </section>

        <section className="about-section" id="about">
          <div className="about-photo-wrap">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=88" alt="김다애 웨딩플래너 프로필" />
            <span>12 YEARS<br />WITH COUPLES</span>
          </div>
          <div className="about-copy">
            <p className="section-kicker">ABOUT THE PLANNER</p>
            <h2>안녕하세요,<br />김다애 플래너입니다.</h2>
            <blockquote>“좋은 결혼 준비는 더 많은 선택이 아니라,<br />두 사람에게 꼭 맞는 선택을 남기는 일이라고 믿어요.”</blockquote>
            <p>정해진 패키지보다 두 분의 생활 방식과 취향을 먼저 듣습니다. 예산과 일정은 현실적으로, 중요한 장면은 두 분답게 지켜낼 수 있도록 처음부터 본식까지 한 사람이 책임지고 동행합니다.</p>
            <div className="about-tags"><span>#1:1전담</span><span>#예산설계</span><span>#취향큐레이션</span><span>#본식동행</span></div>
            <div className="availability-pill" aria-live="polite">
              <span>이번 달</span><strong>상담 가능일</strong><b>{availableDays === null ? "확인 중" : `${availableDays}일 남음`}</b>
            </div>
            <a className="line-link" href="#consult">김다애 플래너와 상담하기 <span>↗</span></a>
          </div>
        </section>

        <section className="process-section" id="process">
          <div className="section-title center">
            <p>HOW WE WORK TOGETHER</p>
            <h2>둘만의 기준을 찾는<br />네 번의 동행</h2>
          </div>
          <div className="process-list">
            {process.map((item) => (
              <article key={item.step}><span>{item.step}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div></article>
            ))}
          </div>
        </section>

        <section className="review-section" id="reviews">
          <div className="section-title split light">
            <div><p>NAVER BLOG STORIES</p><h2>한분 한분 정성 플래닝<br />실제 진행 후기</h2></div>
            <div className="naver-blog-lockup"><b>N</b><span>NAVER BLOG<small>실제 후기 사례 모음</small></span></div>
          </div>
          <div className="review-list">
            {blogReviews.map((review) => (
              <article key={review.title}>
                <img src={review.image} alt={review.title} />
                <div className="blog-card-copy">
                  <p className="blog-meta"><span>{review.category}</span>{review.date}</p>
                  <h3>{review.title}</h3>
                  <p>{review.excerpt}</p>
                  <div className="blog-card-footer"><b>베리굿 웨딩 김다애 플래너</b><span>블로그 링크 연결 예정</span></div>
                </div>
              </article>
            ))}
          </div>
          <nav className="review-pagination" aria-label="실제 진행 후기 페이지">
            <a href="#reviews" aria-current="page">1</a>
            {[2, 3, 4, 5].map((page) => <span className="page-number" key={page}>{page}</span>)}
            <span className="page-ellipsis" aria-hidden="true">…</span>
          </nav>
        </section>

        <section className="instagram-section" id="instagram">
          <div className="section-title split">
            <div><p>PLANNER&apos;S INSTAGRAM</p><h2>준비의 순간을<br />가장 가까이에서</h2></div>
            <a className="instagram-handle" href={instagramUrl} target="_blank" rel="noreferrer">@daae_gi <span>↗</span></a>
          </div>
          <div className="instagram-grid">
            {instagramPosts.map((post) => (
              <a href={post.href} target="_blank" rel="noreferrer" key={post.href} aria-label={`${post.alt} 인스타그램에서 보기`}>
                <img src={post.image} alt={post.alt} /><span>{post.tag}</span>
              </a>
            ))}
          </div>
          <p className="instagram-note">드레스 투어, 현장 셋업, 본식 케어까지 매주 새로운 이야기를 기록합니다.</p>
        </section>

        <section className="faq-section" id="faq">
          <div className="section-title"><p>BEFORE WE MEET</p><h2>상담 전 자주 묻는 질문</h2></div>
          <div className="faq-list">
            {faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>＋</span></summary><p>{faq.answer}</p></details>)}
          </div>
        </section>

        <section className="consult-section" id="consult">
          <div className="consult-intro">
            <p>BEGIN YOUR STORY</p><h2>두 분의 이야기를<br />들려주세요</h2><span>상담 신청 후 영업일 기준 1일 내 안내드립니다.</span>
          </div>
          {submitted ? (
            <div className="success-message" role="status"><span>✓</span><h3>상담 신청이 준비되었습니다</h3><p>이 데모에서는 정보가 외부로 전송되지 않습니다.<br />실제 운영 시 상담 시스템을 연결할 수 있어요.</p><button type="button" onClick={() => setSubmitted(false)}>다시 작성하기</button></div>
          ) : (
            <form onSubmit={submitConsultation}>
              <label>이름<input name="name" type="text" placeholder="성함을 입력해 주세요" required /></label>
              <label>연락처<input name="phone" type="tel" placeholder="010-0000-0000" required /></label>
              <label>예식 예정 시기<input name="date" type="month" /></label>
              <label>현재 준비 단계<select name="stage" defaultValue=""><option value="" disabled>선택해 주세요</option><option>이제 막 알아보는 중</option><option>웨딩홀 탐색 중</option><option>스드메 탐색 중</option><option>일부 계약 완료</option></select></label>
              <label className="message-label">남기실 말씀<textarea name="message" placeholder="원하는 예식 지역, 하객 수, 궁금한 점을 자유롭게 적어 주세요." /></label>
              <label className="consent"><input type="checkbox" required /> 개인정보 수집 및 상담 안내에 동의합니다.</label>
              <button className="submit-button" type="submit">무료 상담 신청 <span>→</span></button>
            </form>
          )}
        </section>

        <footer>
          <a className="footer-brand" href="#home">DEARLY</a><p>김다애 플래너와 시작하는 1:1 퍼스널 웨딩 플래닝</p>
          <div><a href="#about">플래너 소개</a><a href="#reviews">실제 진행 후기</a><a href="#instagram">인스타그램</a><a href="#consult">상담 문의</a></div>
          <small>© 2026 DEARLY WEDDING. ALL RIGHTS RESERVED.</small>
        </footer>

        <a className="chat-button" href="#consult" aria-label="빠른 상담 신청">♡<span>빠른상담</span></a>
        <nav className="bottom-nav" aria-label="모바일 하단 메뉴">
          {[{ label: "홈", href: "#home", icon: "⌂" }, { label: "소개", href: "#about", icon: "D" }, { label: "후기", href: "#reviews", icon: "♡" }, { label: "상담", href: "#consult", icon: "✦" }].map((item, index) => (
            <a key={item.label} href={item.href} className={index === 0 ? "active" : ""}><span>{item.icon}</span>{item.label}</a>
          ))}
        </nav>
      </section>
    </main>
  );
}
