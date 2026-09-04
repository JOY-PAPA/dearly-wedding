"use client";

import { useEffect, useRef, useState } from "react";
import { blogReviews, type BlogReview } from "./blog-reviews.generated";
import { bouquetPosts, type BouquetPost } from "./bouquet-posts.generated";

const navItems = [
  { label: "실제 진행 후기", href: "#reviews" },
  { label: "다애플 부케", href: "#bouquet" },
  { label: "다애플 스케치", href: "#sketch" },
  { label: "플래너 소개", href: "#about" },
  { label: "인스타그램", href: "#instagram" },
  { label: "상담 문의", href: "#consult" },
];

const sketchPosts = Array.from({ length: 14 }, (_, index) => ({
  image: `/sketches/daaepl-sketch-${String(index + 1).padStart(2, "0")}.jpg`,
  alt: `다애플 스케치 드레스 투어 기록 ${index + 1}`,
}));

const facts = [
  { value: "2,300+", target: 2300, suffix: "+", unit: "건", label: "누적 웨딩 진행" },
  { value: "11", target: 11, suffix: "", unit: "년", label: "웨딩 플래닝 경력" },
  { value: "89", target: 89, suffix: "", unit: "%", label: "지인 소개율" },
  { value: "1:1", target: 1, suffix: "", format: "ratio", unit: "", label: "처음부터 끝까지 전담" },
];

const benefits = [
  { step: "01", title: "웨딩홀 섭외 서비스" },
  {
    step: "02",
    title: "풀동행 서비스 총 5회",
    details: ["드레스 투어", "촬영 드레스 일정", "웨딩 촬영장", "본식 드레스 일정", "본식 메이크업샵 아웃"],
  },
  { step: "03", title: "커스텀 생화 부케 서비스", details: ["촬영 부케, 본식부케"] },
  { step: "04", title: "아이폰 스냅, 영상 촬영 서비스" },
  { step: "05", title: "디렉팅비 22만원 무료 서비스" },
  { step: "06", title: "드레스 투어시 스케치 서비스" },
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
const kakaoChatUrl = "https://open.kakao.com/o/srQ6Fdah";

function getNaverEmbedUrl(href: string) {
  try {
    const url = new URL(href);
    const [blogId, logNo] = url.pathname.split("/").filter(Boolean);
    if (!blogId || !logNo) return href;
    return `https://m.blog.naver.com/PostView.naver?blogId=${encodeURIComponent(blogId)}&logNo=${encodeURIComponent(logNo)}`;
  } catch {
    return href;
  }
}

function getInstagramEmbedUrl(href: string) {
  try {
    const url = new URL(href);
    const pathname = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
    return `${url.origin}${pathname}embed/`;
  } catch {
    return href;
  }
}

export default function Home() {
  const [reviewPage, setReviewPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<BlogReview | null>(null);
  const [visibleBouquetCount, setVisibleBouquetCount] = useState(12);
  const [selectedBouquet, setSelectedBouquet] = useState<BouquetPost | null>(null);
  const bouquetDialogRef = useRef<HTMLElement | null>(null);
  const [selectedSketchIndex, setSelectedSketchIndex] = useState<number | null>(null);
  const sketchDialogRef = useRef<HTMLElement | null>(null);
  const lastSketchTriggerRef = useRef<HTMLButtonElement | null>(null);
  const bouquetModalOpen = selectedBouquet !== null;
  const sketchModalOpen = selectedSketchIndex !== null;
  const reviewsPerPage = 3;
  const totalReviewPages = Math.ceil(blogReviews.length / reviewsPerPage);
  const reviewPageStart = Math.min(Math.max(reviewPage - 2, 1), Math.max(totalReviewPages - 4, 1));
  const visibleReviewPages = Array.from({ length: Math.min(5, totalReviewPages) }, (_, index) => reviewPageStart + index);
  const visibleReviews = blogReviews.slice((reviewPage - 1) * reviewsPerPage, reviewPage * reviewsPerPage);

  useEffect(() => {
    if (!selectedReview) return;
    const previousOverflow = document.body.style.overflow;
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedReview(null);
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const offset = event.key === "ArrowLeft" ? -1 : 1;
        setSelectedReview((current) => {
          if (!current) return current;
          const currentIndex = blogReviews.findIndex((review) => review.href === current.href);
          const nextIndex = (currentIndex + offset + blogReviews.length) % blogReviews.length;
          return blogReviews[nextIndex];
        });
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeWithEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [selectedReview]);

  useEffect(() => {
    if (!bouquetModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeWithKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedBouquet(null);
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const offset = event.key === "ArrowLeft" ? -1 : 1;
        setSelectedBouquet((current) => {
          if (!current) return current;
          const currentIndex = bouquetPosts.findIndex((post) => post.href === current.href);
          const nextIndex = (currentIndex + offset + bouquetPosts.length) % bouquetPosts.length;
          return bouquetPosts[nextIndex];
        });
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeWithKeyboard);
    bouquetDialogRef.current?.querySelector<HTMLButtonElement>(".bouquet-modal-close")?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeWithKeyboard);
    };
  }, [bouquetModalOpen]);

  useEffect(() => {
    if (!sketchModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    const panel = sketchDialogRef.current;

    const closeSketch = () => setSelectedSketchIndex(null);
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSketch();
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const offset = event.key === "ArrowLeft" ? -1 : 1;
        setSelectedSketchIndex((current) => current === null ? current : (current + offset + sketchPosts.length) % sketchPosts.length);
      }
      if (event.key === "Tab" && panel) {
        const focusable = Array.from(panel.querySelectorAll<HTMLElement>("button, a[href], [tabindex]:not([tabindex='-1'])"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyboard);
    panel?.querySelector<HTMLButtonElement>(".sketch-modal-close")?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyboard);
      lastSketchTriggerRef.current?.focus();
    };
  }, [sketchModalOpen]);

  useEffect(() => {
    const factGrid = document.querySelector<HTMLElement>(".fact-grid");
    const counters = Array.from(document.querySelectorAll<HTMLElement>(".fact-counter[data-count-target]"));
    if (!factGrid || !counters.length) return;

    const numberFormatter = new Intl.NumberFormat("ko-KR");
    const formatCounter = (counter: HTMLElement, value: number) => {
      if (counter.dataset.countFormat === "ratio") return `${value}:${value}`;
      return `${numberFormatter.format(value)}${counter.dataset.countSuffix ?? ""}`;
    };
    const showFinalValues = () => {
      counters.forEach((counter) => {
        counter.textContent = formatCounter(counter, Number(counter.dataset.countTarget));
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      showFinalValues();
      return;
    }

    counters.forEach((counter) => {
      counter.textContent = formatCounter(counter, 0);
    });

    const timers: number[] = [];
    const animationFrames = new Map<HTMLElement, number>();
    let hasStarted = false;

    const startCounting = () => {
      if (hasStarted) return;
      hasStarted = true;

      counters.forEach((counter, index) => {
        const target = Number(counter.dataset.countTarget);
        const delay = index * 110;
        const timer = window.setTimeout(() => {
          const startedAt = performance.now();
          const duration = 1350;
          const update = (now: number) => {
            const progress = Math.min((now - startedAt) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = formatCounter(counter, Math.round(target * eased));
            if (progress < 1) {
              animationFrames.set(counter, window.requestAnimationFrame(update));
            } else {
              counter.textContent = formatCounter(counter, target);
              animationFrames.delete(counter);
            }
          };
          animationFrames.set(counter, window.requestAnimationFrame(update));
        }, delay);
        timers.push(timer);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        startCounting();
        observer.disconnect();
      }
    }, { threshold: 0.35 });

    observer.observe(factGrid);
    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      animationFrames.forEach((frame) => window.cancelAnimationFrame(frame));
    };
  }, []);

  function changeReviewPage(page: number) {
    setReviewPage(Math.min(Math.max(page, 1), totalReviewPages));
  }

  function moveSelectedReview(offset: number) {
    setSelectedReview((current) => {
      if (!current) return current;
      const currentIndex = blogReviews.findIndex((review) => review.href === current.href);
      const nextIndex = (currentIndex + offset + blogReviews.length) % blogReviews.length;
      return blogReviews[nextIndex];
    });
  }

  function moveSelectedBouquet(offset: number) {
    setSelectedBouquet((current) => {
      if (!current) return current;
      const currentIndex = bouquetPosts.findIndex((post) => post.href === current.href);
      const nextIndex = (currentIndex + offset + bouquetPosts.length) % bouquetPosts.length;
      return bouquetPosts[nextIndex];
    });
  }

  function moveSelectedSketch(offset: number) {
    setSelectedSketchIndex((current) => current === null ? current : (current + offset + sketchPosts.length) % sketchPosts.length);
  }

  const selectedReviewIndex = selectedReview ? blogReviews.findIndex((review) => review.href === selectedReview.href) : -1;
  const selectedBouquetIndex = selectedBouquet ? bouquetPosts.findIndex((post) => post.href === selectedBouquet.href) : -1;
  const selectedSketch = selectedSketchIndex === null ? null : sketchPosts[selectedSketchIndex];

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
          <a className="rail-cta" href={kakaoChatUrl} target="_blank" rel="noreferrer">무료 상담 시작하기 <span>↗</span></a>
          <div className="rail-foot"><span>DAAEPLAN</span><span>SEOUL · KOREA</span></div>
        </div>
      </aside>

      <section className="app-frame">
        <header className="topbar">
          <a className="wordmark" href="#home" aria-label="다애플랜 홈">D A A E P L A N</a>
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
            <p className="hero-planner-name">베리굿 김다애 플래너</p>
            <a href="#about">플래너 만나보기 <span>→</span></a>
          </div>
          <div className="hero-index"><b>DAAE KIM</b><span /><small>WEDDING PLANNER</small></div>
        </section>

        <section className="review-section" id="reviews">
          <div className="section-title split light">
            <div><p>NAVER BLOG STORIES</p><h2>한분 한분 정성 플래닝<br />실제 진행 후기</h2></div>
            <div className="naver-blog-lockup"><b>N</b><span>NAVER BLOG<small>실제 후기 사례 모음</small></span></div>
          </div>
          <div className="review-list">
            {visibleReviews.map((review) => (
              <button className="review-card" type="button" onClick={() => setSelectedReview(review)} aria-haspopup="dialog" key={review.href}>
                <img src={review.image} alt={review.title} />
                <div className="blog-card-copy">
                  <p className="blog-meta"><span>{review.category}</span>{review.date}</p>
                  <h3>{review.title}</h3>
                  <p>{review.excerpt}</p>
                  <div className="blog-card-footer"><b>베리굿 웨딩 김다애 플래너</b><span>후기 상세 보기 →</span></div>
                </div>
              </button>
            ))}
          </div>
          <nav className="review-pagination" aria-label="실제 진행 후기 페이지">
            <button className="page-arrow" type="button" onClick={() => changeReviewPage(reviewPage - 1)} disabled={reviewPage === 1} aria-label="이전 후기 페이지">‹</button>
            {reviewPageStart > 1 && (
              <>
                <button type="button" onClick={() => changeReviewPage(1)}>1</button>
                <span className="page-ellipsis" aria-hidden="true">…</span>
              </>
            )}
            {visibleReviewPages.map((page) => (
              <button type="button" className={reviewPage === page ? "active" : ""} onClick={() => changeReviewPage(page)} aria-current={reviewPage === page ? "page" : undefined} key={page}>{page}</button>
            ))}
            {reviewPageStart + visibleReviewPages.length - 1 < totalReviewPages && (
              <>
                <span className="page-ellipsis" aria-hidden="true">…</span>
                <button type="button" onClick={() => changeReviewPage(totalReviewPages)}>{totalReviewPages}</button>
              </>
            )}
            <button className="page-arrow" type="button" onClick={() => changeReviewPage(reviewPage + 1)} disabled={reviewPage === totalReviewPages} aria-label="다음 후기 페이지">›</button>
          </nav>
        </section>

        {selectedReview && (
          <div className="review-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelectedReview(null)}>
            <article className="review-modal-panel" role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
              <button className="review-modal-close" type="button" onClick={() => setSelectedReview(null)} aria-label="후기 상세 닫기">×</button>
              <header className="review-modal-header">
                <p className="blog-meta"><span>{selectedReview.category}</span>{selectedReview.date}</p>
                <h2 id="review-modal-title">{selectedReview.title}</h2>
              </header>
              <div className="review-modal-frame-wrap">
                <iframe className="review-modal-frame" src={getNaverEmbedUrl(selectedReview.href)} title={`${selectedReview.title} 후기 본문`} loading="lazy" />
              </div>
              <footer className="review-modal-footer">
                <nav className="review-modal-navigation" aria-label="후기 상세 이동">
                  <button type="button" onClick={() => moveSelectedReview(-1)}><span>←</span> 이전 후기</button>
                  <b>{selectedReviewIndex + 1} / {blogReviews.length}</b>
                  <button type="button" onClick={() => moveSelectedReview(1)}>다음 후기 <span>→</span></button>
                </nav>
                <div className="review-modal-source"><small>팝업 안에서 본문을 스크롤해 읽을 수 있습니다.</small><a className="review-original-link" href={selectedReview.href} target="_blank" rel="noreferrer">원문 확인 <span>↗</span></a></div>
              </footer>
            </article>
          </div>
        )}

        <section className="bouquet-section" id="bouquet">
          <div className="section-title split">
            <div><p>DAAEPL BOUQUET ARCHIVE</p><h2>인스타 부케 맛집,<br />부케보고 찾아오는 웨딩 플래너<br />#다애플부케</h2></div>
            <a className="bouquet-hashtag" href="https://www.instagram.com/explore/tags/%EB%8B%A4%EC%95%A0%ED%94%8C%EB%B6%80%EC%BC%80/" target="_blank" rel="noreferrer">#다애플부케 <span>↗</span></a>
          </div>
          <div className="bouquet-grid">
            {bouquetPosts.map((post, index) => (
              <button className="bouquet-card" type="button" onClick={() => setSelectedBouquet(post)} data-instagram-url={post.href} hidden={index >= visibleBouquetCount} key={post.href} aria-haspopup="dialog" aria-label={`${post.alt} 크게 보기`}>
                <img src={post.image} alt="" loading="lazy" decoding="async" />
                <span>{post.tag}</span>
              </button>
            ))}
          </div>
          {visibleBouquetCount < bouquetPosts.length && (
            <button className="bouquet-more" type="button" onClick={() => setVisibleBouquetCount((count) => Math.min(count + 12, bouquetPosts.length))}>
              더 많은 부케 보기 <span className="bouquet-count">{visibleBouquetCount} / {bouquetPosts.length}</span>
            </button>
          )}
        </section>

        {selectedBouquet && (
          <div className="bouquet-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelectedBouquet(null)}>
            <article ref={bouquetDialogRef} className="bouquet-modal-panel" role="dialog" aria-modal="true" aria-labelledby="bouquet-modal-title">
              <button className="bouquet-modal-close" type="button" onClick={() => setSelectedBouquet(null)} aria-label="부케 사진 닫기">×</button>
              <header className="bouquet-modal-header">
                <p>DAAEPL BOUQUET ARCHIVE</p>
                <div><h2 id="bouquet-modal-title">#다애플부케</h2><b aria-live="polite">{selectedBouquetIndex + 1} / {bouquetPosts.length}</b></div>
              </header>
              <div className="bouquet-modal-image-wrap">
                <iframe className="bouquet-modal-frame" src={getInstagramEmbedUrl(selectedBouquet.href)} title={`${selectedBouquet.alt} 원본 게시물`} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
              </div>
              <div className="bouquet-modal-footer">
                <nav className="bouquet-modal-navigation" aria-label="부케 사진 이동">
                  <button type="button" onClick={() => moveSelectedBouquet(-1)}><span>←</span> 이전 부케</button>
                  <b aria-live="polite">{selectedBouquetIndex + 1} / {bouquetPosts.length}</b>
                  <button type="button" onClick={() => moveSelectedBouquet(1)}>다음 부케 <span>→</span></button>
                </nav>
                <div className="bouquet-modal-source"><small>좌우 버튼이나 키보드 방향키로 다음 사진을 볼 수 있습니다.</small><a href={selectedBouquet.href} target="_blank" rel="noreferrer">인스타그램 원문 확인 <span>↗</span></a></div>
              </div>
            </article>
          </div>
        )}

        <section className="sketch-section" id="sketch">
          <div className="section-title split">
            <div><p>DAAEPLAN WEDDING SKETCH</p><h2>현장에서 직접 추억을<br />그려드리는 다애플 스케치</h2></div>
            <span>드레스 투어의 선택과 이유를<br />한눈에 볼 수 있는 기록입니다.</span>
          </div>
          <div className="sketch-grid">
            {sketchPosts.map((post, index) => (
              <button
                className="sketch-card"
                type="button"
                onClick={(event) => {
                  lastSketchTriggerRef.current = event.currentTarget;
                  setSelectedSketchIndex(index);
                }}
                data-sketch-alt={post.alt}
                key={post.image}
                aria-haspopup="dialog"
                aria-label={`${post.alt} 크게 보기`}
              >
                <img src={post.image} alt="" loading="lazy" decoding="async" />
                <span>DRESS TOUR SKETCH</span>
              </button>
            ))}
          </div>
        </section>

        {selectedSketch && selectedSketchIndex !== null && (
          <div className="sketch-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelectedSketchIndex(null)}>
            <article ref={sketchDialogRef} className="sketch-modal-panel" role="dialog" aria-modal="true" aria-labelledby="sketch-modal-title" aria-describedby="sketch-modal-help">
              <button className="sketch-modal-close" type="button" onClick={() => setSelectedSketchIndex(null)} aria-label="다애플 스케치 닫기">×</button>
              <header className="sketch-modal-header">
                <p>DAAEPLAN WEDDING SKETCH</p>
                <div><h2 id="sketch-modal-title">다애플 스케치</h2><b aria-live="polite">{selectedSketchIndex + 1} / {sketchPosts.length}</b></div>
              </header>
              <div className="sketch-modal-image-wrap">
                <img className="sketch-modal-image" src={selectedSketch.image} alt={selectedSketch.alt} />
              </div>
              <div className="sketch-modal-footer">
                <nav className="sketch-modal-navigation" aria-label="다애플 스케치 이동">
                  <button type="button" onClick={() => moveSelectedSketch(-1)}><span>←</span> 이전 스케치</button>
                  <b className="sketch-modal-count" aria-live="polite">{selectedSketchIndex + 1} / {sketchPosts.length}</b>
                  <button type="button" onClick={() => moveSelectedSketch(1)}>다음 스케치 <span>→</span></button>
                </nav>
                <p className="sketch-modal-help" id="sketch-modal-help">좌우 버튼이나 키보드 방향키로 다음 스케치를 볼 수 있습니다.</p>
              </div>
            </article>
          </div>
        )}

        <div className="planner-section-group" id="about">
          <section className="about-section">
            <div className="about-photo-wrap">
              <img src="/kim-daae-planner.jpg" alt="김다애 웨딩플래너 프로필" />
              <span>11 YEARS<br />WITH COUPLES</span>
            </div>
            <div className="about-copy">
              <p className="section-kicker">ABOUT THE PLANNER</p>
              <h2>안녕하세요,<br />김다애 플래너입니다.</h2>
              <blockquote>“좋은 결혼 준비는 더 많은 선택이 아니라,<br />두 사람에게 꼭 맞는 선택을 남기는 일이라고 믿어요.”</blockquote>
              <p>정해진 패키지보다 두 분의 생활 방식과 취향을 먼저 듣습니다. 예산과 일정은 현실적으로, 중요한 장면은 두 분답게 지켜낼 수 있도록 처음부터 본식까지 한 사람이 책임지고 동행합니다.</p>
              <div className="about-tags"><span>#1:1전담</span><span>#예산설계</span><span>#취향큐레이션</span><span>#본식동행</span></div>
              <a className="line-link" href="#consult">김다애 플래너와 상담하기 <span>↗</span></a>
            </div>
          </section>

          <section className="fact-grid" aria-label="플래너 주요 경력">
            {facts.map((fact) => (
              <div key={fact.label}>
                <p>
                  <b
                    className="fact-counter"
                    data-count-target={fact.target}
                    data-count-suffix={fact.suffix}
                    data-count-format={fact.format}
                    aria-hidden="true"
                  >{fact.value}</b>
                  <span aria-hidden="true">{fact.unit}</span>
                  <span className="sr-only">{fact.value}{fact.unit}</span>
                </p>
                <small>{fact.label}</small>
              </div>
            ))}
          </section>

          <section className="process-section" id="process">
            <div className="section-title center">
              <p>DAAEPLAN SPECIAL BENEFITS</p>
              <h2>다애플래너만의<br />특별한 혜택</h2>
            </div>
            <div className="process-list">
              {benefits.map((item) => (
                <article key={item.step}>
                  <span>{item.step}</span>
                  <div>
                    <h3>{item.title}</h3>
                    {item.details && <ul className="benefit-details">{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

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

        <section className="consult-section" id="consult">
            <div className="consult-intro">
              <p>KAKAO OPEN CHAT</p><h2>두 분의 이야기를<br />카카오톡으로 들려주세요</h2><span>복잡한 양식 없이 오픈채팅에서 편하게 상담을 시작할 수 있습니다.</span>
            </div>
            <div className="kakao-consult-card">
              <div className="kakao-consult-copy">
                <span>1:1 WEDDING CONSULTATION</span>
                <h3>궁금한 점을 바로 남겨주세요</h3>
                <p>예식 예정 시기, 준비 단계, 원하는 분위기를 간단히 알려주시면<br />김다애 플래너가 확인 후 차근차근 안내해 드립니다.</p>
                <div className="kakao-consult-points"><span>✓ 부담 없는 첫 상담</span><span>✓ 1:1 맞춤 답변</span><span>✓ 모바일로 간편하게</span></div>
              </div>
              <a className="kakao-consult-button" href={kakaoChatUrl} target="_blank" rel="noreferrer">카카오톡 오픈채팅 상담 시작하기 <span>↗</span></a>
              <small>버튼을 누르면 카카오톡 오픈채팅으로 이동합니다.</small>
            </div>
        </section>

        <footer>
          <a className="footer-brand" href="#home">D A A E P L A N</a><p>김다애 플래너와 시작하는 1:1 퍼스널 웨딩 플래닝</p>
          <div>{navItems.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}</div>
          <small>© 2026 DAAEPLAN. ALL RIGHTS RESERVED.</small>
        </footer>

        <a className="chat-button" href={kakaoChatUrl} target="_blank" rel="noreferrer" aria-label="카카오톡 오픈채팅 상담">1:1<span>톡상담</span></a>
        <nav className="bottom-nav" aria-label="모바일 하단 메뉴">
          {[{ label: "홈", href: "#home", icon: "⌂" }, { label: "소개", href: "#about", icon: "D" }, { label: "후기", href: "#reviews", icon: "♡" }, { label: "상담", href: "#consult", icon: "✦" }].map((item, index) => (
            <a key={item.label} href={item.href} className={index === 0 ? "active" : ""}><span>{item.icon}</span>{item.label}</a>
          ))}
        </nav>
      </section>
    </main>
  );
}
