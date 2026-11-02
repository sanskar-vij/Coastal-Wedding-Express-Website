/** Separate botanical layers sway without shifting the page or its text. */
(() => {
  const assets = window.WEDDING_ASSETS;
  const pages = document.querySelectorAll('.page');

  function addBotanical(page, asset, className) {
    if (!assets[asset]) return;
    const image = document.createElement('img');
    image.src = assets[asset];
    image.alt = '';
    image.className = `breeze-art ${className}`;
    image.setAttribute('aria-hidden', 'true');
    image.loading = 'lazy';
    page.append(image);
  }

  pages.forEach((page, index) => {
    if (page.classList.contains('venue-page')) return;

    addBotanical(page, 'palm', 'breeze-palm');
    addBotanical(page, 'vine', 'breeze-vine');
    page.style.setProperty('--breeze-delay', `${-index * 0.7}s`);
  });

  const visibility = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        target.classList.toggle('foliage-offscreen', !isIntersecting);
      });
    },
    { rootMargin: '80px' },
  );
  pages.forEach((page) => visibility.observe(page));

  // Event cards animate in ONCE on first view; no re-animation when coming back
  const celebrationsPage = document.querySelector('#celebrations');
  const carousel = document.querySelector('#events-carousel');
  const slides = document.querySelectorAll('.event-slide');
  let celebrationsVisible = false;

  function markSlideEntered(slide) {
    if (!slide || slide.classList.contains('events-entered')) return;
    slide.classList.add('events-entered');
    const cards = slide.querySelectorAll('.event-card');
    cards.forEach((card) => {
      card.addEventListener(
        'animationend',
        (e) => {
          if (e.animationName === 'card-fade-slide') {
            card.classList.add('animation-done');
          }
        },
        { once: true },
      );
    });
    // Safety fallback: ensure animation-done is set after animation finishes (2.2s)
    setTimeout(() => {
      cards.forEach((card) => card.classList.add('animation-done'));
      slide.classList.add('animation-done');
    }, 2200);
  }

  function evaluateSlides() {
    if (!celebrationsVisible || !carousel) return;
    const parentRect = carousel.getBoundingClientRect();
    slides.forEach((slide) => {
      if (slide.classList.contains('events-entered')) return;
      const rect = slide.getBoundingClientRect();
      const overlap = Math.max(
        0,
        Math.min(rect.right, parentRect.right) - Math.max(rect.left, parentRect.left),
      );
      const visibleRatio = parentRect.width > 0 ? overlap / parentRect.width : 0;
      if (visibleRatio > 0.55) {
        markSlideEntered(slide);
      }
    });
  }

  if (celebrationsPage) {
    const celebrationsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting }) => {
          celebrationsVisible = isIntersecting;
          if (isIntersecting) {
            evaluateSlides();
          }
          // Do NOT remove events-entered when leaving; cards stay visible and do NOT animate when coming back
        });
      },
      { threshold: 0.12 },
    );
    celebrationsObserver.observe(celebrationsPage);
  }

  if (carousel) {
    const eventVisibility = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
          if (!celebrationsVisible) return;
          if (isIntersecting && intersectionRatio > 0.55) {
            markSlideEntered(target);
          }
        });
      },
      { root: carousel, threshold: [0, 0.55, 0.8] },
    );
    slides.forEach((slide) => eventVisibility.observe(slide));
  }
})();
