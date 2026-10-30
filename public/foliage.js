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

  // Re-enter the three event cards in order on every carousel page.
  const celebrationsPage = document.querySelector('#celebrations');
  const carousel = document.querySelector('#events-carousel');
  const slides = document.querySelectorAll('.event-slide');
  let celebrationsVisible = false;

  function evaluateSlides() {
    if (!celebrationsVisible || !carousel) return;
    const parentRect = carousel.getBoundingClientRect();
    slides.forEach((slide) => {
      const rect = slide.getBoundingClientRect();
      const overlap = Math.max(
        0,
        Math.min(rect.right, parentRect.right) - Math.max(rect.left, parentRect.left),
      );
      const visibleRatio = parentRect.width > 0 ? overlap / parentRect.width : 0;
      slide.classList.toggle('events-entered', visibleRatio > 0.55);
    });
  }

  if (celebrationsPage) {
    const celebrationsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting }) => {
          celebrationsVisible = isIntersecting;
          if (isIntersecting) {
            evaluateSlides();
          } else {
            slides.forEach((s) => s.classList.remove('events-entered'));
          }
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
          if (!celebrationsVisible) {
            target.classList.remove('events-entered');
            return;
          }
          target.classList.toggle('events-entered', isIntersecting && intersectionRatio > 0.55);
        });
      },
      { root: carousel, threshold: [0, 0.55, 0.8] },
    );
    slides.forEach((slide) => eventVisibility.observe(slide));
  }
})();
