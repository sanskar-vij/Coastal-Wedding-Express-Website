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

  // Event cards animate in ONCE on first view; completely smooth between page changes, no re-animation when coming back
  const celebrationsPage = document.querySelector('#celebrations');
  const slides = document.querySelectorAll('.event-slide');

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
    // Safety fallback: ensure animation-done is set after animation finishes (1.8s)
    setTimeout(() => {
      cards.forEach((card) => card.classList.add('animation-done'));
      slide.classList.add('animation-done');
    }, 1800);
  }

  if (celebrationsPage) {
    const celebrationsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting }) => {
          if (isIntersecting) {
            // Initial slide plays appear animation; subsequent slides are pre-marked for completely smooth, jerk-free page changes
            slides.forEach((slide, idx) => {
              slide.classList.add('events-entered');
              if (idx > 0) {
                slide.classList.add('animation-done');
                slide.querySelectorAll('.event-card').forEach((c) => c.classList.add('animation-done'));
              }
            });
            if (slides[0]) {
              markSlideEntered(slides[0]);
            }
            celebrationsObserver.disconnect();
          }
        });
      },
      { threshold: 0.12 },
    );
    celebrationsObserver.observe(celebrationsPage);
  }
})();
