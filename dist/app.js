/** Generated from src/scripts/app.js and countdown.js. */
function countdownParts(target, now = Date.now()) {
  const end = Date.parse(target);
  if (!Number.isFinite(end)) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  const total = Math.max(0, Math.floor((end - now) / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    total,
  };
}

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
const assets = window.WEDDING_ASSETS;
const pages = [...document.querySelectorAll('main>.page')];
const menu = document.querySelector('#menu'),
  menuToggle = document.querySelector('#menu-toggle');
const motion = document.querySelector('#motion'),
  pref = matchMedia('(prefers-reduced-motion: reduce)');
let current = 0,
  paused = pref.matches;
function setMotion() {
  document.body.classList.toggle('paused', paused);
  document.body.classList.toggle('motion-enabled', !paused);
  motion.setAttribute('aria-pressed', String(paused));
  motion.setAttribute('aria-label', paused ? 'Play animations' : 'Pause animations');
  motion.textContent = paused ? '▷' : 'Ⅱ';
  pages.forEach(updateBackgroundVideos);
}
function updateBackgroundVideos(page) {
  const bounds = page.getBoundingClientRect();
  const isVisible = bounds.bottom > -150 && bounds.top < innerHeight + 150;
  page.classList.toggle('video-visible', isVisible);
  page.querySelectorAll('.scene-video, .welcome-video').forEach((video) => {
    if (paused || !isVisible) {
      video.pause();
    } else if (video.paused) {
      video.play().catch((error) => {
        console.warn(
          'Background video could not start; the illustrated scene remains visible.',
          error,
        );
      });
    }
  });
}
setMotion();
motion.addEventListener('click', () => {
  paused = !paused;
  setMotion();
});
pref.addEventListener('change', () => {
  paused = pref.matches;
  setMotion();
});
function setMenu(open) {
  menu.hidden = !open;
  menuToggle?.setAttribute('aria-expanded', String(open));
  menuToggle?.setAttribute('aria-label', open ? 'Close invitation menu' : 'Open invitation menu');
  if (open) menu.querySelector('a').focus();
}
menuToggle?.addEventListener('click', () => setMenu(menu.hidden));
document.querySelector('.menu-close').addEventListener('click', () => {
  setMenu(false);
  document.querySelector('#page-index').focus();
});
document.querySelector('#page-index').addEventListener('click', () => setMenu(menu.hidden));
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', (e) => {
  if (
    !menu.hidden &&
    !menu.contains(e.target) &&
    !menuToggle?.contains(e.target) &&
    !document.querySelector('#page-index').contains(e.target)
  )
    setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !menu.hidden) {
    setMenu(false);
    document.querySelector('#page-index').focus();
  }
});
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const e of entries)
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
  },
  { threshold: 0.08 },
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
const activeObserver = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      e.target.classList.toggle('offscreen', !e.isIntersecting);
      e.target.classList.toggle('video-visible', e.isIntersecting);
      updateBackgroundVideos(e.target);
    }
  },
  { rootMargin: '150px' },
);
pages.forEach((p) => activeObserver.observe(p));
const routeLinks = [...document.querySelectorAll('.desktop-route a')];
function updatePage() {
  let nearest = 0,
    best = Infinity;
  const target = innerHeight * 0.35;
  pages.forEach((page, i) => {
    const r = page.getBoundingClientRect();
    const distance = r.top <= target && r.bottom > target ? 0 : Math.abs(r.top - target);
    if (distance < best) {
      best = distance;
      nearest = i;
    }
  });
  if (current !== nearest || !document.querySelector('#previous').hasAttribute('data-ready')) {
    current = nearest;
    document.querySelector('#current-page').textContent = String(current + 1).padStart(2, '0');
    document.querySelector('#previous').disabled = current === 0;
    document.querySelector('#previous').dataset.ready = 'true';
    document.querySelector('#next').disabled = current === pages.length - 1;
    document
      .querySelector('#page-index')
      .setAttribute(
        'aria-label',
        `Page ${current + 1} of 8: ${pages[current].dataset.label}. Open page navigation`,
      );
    routeLinks.forEach((a, i) => {
      if (i === current) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }
  pages.forEach(updateBackgroundVideos);
}
let scheduled = false;
addEventListener(
  'scroll',
  () => {
    if (!scheduled) {
      requestAnimationFrame(() => {
        updatePage();
        scheduled = false;
      });
      scheduled = true;
    }
  },
  { passive: true },
);
addEventListener('resize', updatePage);
updatePage();
function goTo(index) {
  const page = pages[Math.max(0, Math.min(pages.length - 1, index))];
  location.hash = page.id;
}
document.querySelector('#previous').addEventListener('click', () => goTo(current - 1));
document.querySelector('#next').addEventListener('click', () => goTo(current + 1));
const info = document.querySelector('#info-dialog');
const infoContent = {
  directions: [
    'Our Seaside Destination',
    '<p><strong>The Palm Pavilion · Goa</strong></p><p>Perched along the Arabian Sea shore amidst swaying coconut palms and warm coastal breezes. Located in South Goa within effortless reach of heritage monuments and beach retreats.</p><p><a href="https://maps.google.com/?q=The+Palm+Pavilion+Goa" target="_blank" rel="noopener noreferrer" class="primary-button" style="display:inline-flex;margin-top:14px;max-width:240px">OPEN IN GOOGLE MAPS ↗</a></p>',
  ],
  stay: [
    'Accommodations & Guest Stays',
    '<p>We have reserved exclusive wedding guest suites and villas nearby with complimentary concierge transfers to all ceremonies:</p><p><strong>Heritage Coastal Resort & Spa</strong><br>Direct beach access &middot; 5 mins from Pavilion<br><small>Group booking code: <em>COASTAL2027</em></small></p><p><strong>The Palm Grove Boutique Villas</strong><br>Private cottages &middot; 8 mins from Pavilion<br><small>Special wedding tariff available through November 2027</small></p><p class="draft-note">For room upgrades or extended stays before or after the wedding, reach out to our concierge.</p>',
  ],
  travel: [
    'Travel Guidance to Goa',
    '<p><strong>By Air:</strong></p><p>• <strong>Goa International Airport (GOI / Dabolim):</strong> ~28 km to venue. Dedicated wedding express shuttles will greet arriving guests.<br>• <strong>Manohar International Airport (GOX / Mopa):</strong> ~55 km to venue.</p><p><strong>By Rail:</strong></p><p>• <strong>Madgaon Junction (MAO):</strong> ~12 km. Direct express connections from Mumbai, Bangalore, and Pune.</p><p class="draft-note">Airport and station transfers will be coordinated according to your RSVP arrival schedule.</p>',
  ],
  contact: [
    'Wedding Concierge & Team',
    '<p>Our wedding hospitality desk is at your service for travel coordination, itinerary assistance, and special requests:</p><p><strong>Wedding Hospitality Desk</strong><br>Email: <em>hospitality@aaravmeera.wedding</em><br>Telephone: <em>+91 (0832) 274-2027</em></p><p><strong>Event Coordinators:</strong><br>Available on-site 24/7 across all celebrations from 17 to 21 November 2027.</p>',
  ],
};
document.querySelectorAll('[data-info]').forEach((b) =>
  b.addEventListener('click', () => {
    const [title, body] = infoContent[b.dataset.info] || ['Information', ''];
    document.querySelector('#info-title').textContent = title;
    document.querySelector('#info-body').innerHTML = body;
    info.showModal();
  }),
);
document
  .querySelectorAll('.dialog-close,.dialog-done')
  .forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));
for (const d of document.querySelectorAll('dialog'))
  d.addEventListener('click', (e) => {
    if (e.target === d) {
      const r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
        d.close();
    }
  });
const photoDialog = document.querySelector('#photo-dialog');
const photoButtons = [...document.querySelectorAll('[data-photo]')];
let currentPhotoIdx = 0;
function displayPhoto(index) {
  if (!photoButtons.length) return;
  currentPhotoIdx = (index + photoButtons.length) % photoButtons.length;
  const btn = photoButtons[currentPhotoIdx];
  const img = document.querySelector('#large-photo');
  img.src = assets[btn.dataset.photo];
  img.alt = btn.querySelector('img').alt;
  document.querySelector('#photo-caption').textContent = btn.dataset.caption;
}
photoButtons.forEach((b, i) =>
  b.addEventListener('click', () => {
    if (b.classList.contains('memory-window-wrapper') && !b.classList.contains('is-open')) {
      return;
    }
    displayPhoto(i);
    photoDialog.showModal();
  }),
);
photoDialog?.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') displayPhoto(currentPhotoIdx + 1);
  if (e.key === 'ArrowLeft') displayPhoto(currentPhotoIdx - 1);
});
const form = document.querySelector('#rsvp-form'),
  guests = document.querySelector('#guests');
form.querySelectorAll('[name=attending]').forEach((r) =>
  r.addEventListener('change', () => {
    guests.disabled = form.elements.attending.value === 'no';
    if (guests.disabled) guests.value = '1';
  }),
);
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = form.elements.name.value.trim();
  if (!name) {
    form.elements.name.setCustomValidity('Please enter your name.');
    form.elements.name.reportValidity();
    return;
  }
  form.elements.name.setCustomValidity('');
  const attending = form.elements.attending.value === 'yes';
  const countVal = guests.value;
  const notesVal = form.elements.notes.value.trim();
  const result = document.querySelector('#rsvp-result');
  result.innerHTML = `
    <div class="rsvp-confirmation-card">
      <div class="rsvp-confirm-badge">✦ RESPONSE RECORDED (PREVIEW) ✦</div>
      <h4>Thank you, ${name}!</h4>
      <p class="rsvp-confirm-status">
        <strong>Celebration Status:</strong> ${
          attending
            ? `<span class="rsvp-attending-yes">Delighted to attend (${countVal} guest${countVal === '1' ? '' : 's'})</span>`
            : '<span class="rsvp-attending-no">Unable to attend in person (sending best wishes)</span>'
        }
      </p>
      ${notesVal ? `<p class="rsvp-confirm-notes"><strong>Special Notes:</strong> "${notesVal}"</p>` : ''}
      <div class="rsvp-integration-notice">
        <small><strong>Front-End Preview Notice:</strong> This interactive form validates inputs for front-end demonstration. To collect responses permanently, connect this form to a backend service (e.g. Supabase, Firebase, or a Google Sheets Webhook endpoint). No guest data has been stored externally.</small>
      </div>
      <button type="button" class="text-button rsvp-edit-btn" style="margin-top:12px;width:auto;display:inline-flex">EDIT YOUR RSVP <span>↺</span></button>
    </div>
  `;
  result.hidden = false;
  result.querySelector('.rsvp-edit-btn')?.addEventListener('click', () => {
    result.hidden = true;
    form.elements.name.focus();
  });
  result.scrollIntoView({ block: 'nearest', behavior: paused ? 'auto' : 'smooth' });
});
form.elements.name.addEventListener('input', () => form.elements.name.setCustomValidity(''));
// Event carousel, countdown, music and optional entrance interactions.
(() => {
  const content = window.WEDDING;
  const carousel = document.querySelector('#events-carousel'),
    slides = [...carousel.querySelectorAll('.event-slide')];
  const previous = document.querySelector('#events-prev'),
    next = document.querySelector('#events-next'),
    count = document.querySelector('#events-count'),
    dots = [...document.querySelectorAll('.event-dot')];
  let selected = 0,
    scheduled = false;
  function updateEvents() {
    let best = Infinity;
    slides.forEach((slide, i) => {
      const delta = Math.abs(slide.offsetLeft - slides[0].offsetLeft - carousel.scrollLeft);
      if (delta < best) {
        best = delta;
        selected = i;
      }
    });
    previous.disabled = selected === 0;
    next.disabled = selected === slides.length - 1;
    count.textContent = selected + 1 + ' / ' + slides.length;
    dots.forEach((dot, i) => {
      const isActive = i === selected;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });
    slides.forEach((slide, i) => {
      if (i === selected) {
        slide.classList.add('events-entered');
      }
    });
  }

  // Interactive 3D photo flip support for event cards
  const flipCards = document.querySelectorAll('.event-card.flip-card');

  function unflipAllCards() {
    flipCards.forEach((c) => {
      c.classList.remove('is-flipped');
      c.setAttribute('aria-expanded', 'false');
    });
  }

  function toggleCardFlip(targetCard) {
    const willBeFlipped = !targetCard.classList.contains('is-flipped');
    targetCard.classList.toggle('is-flipped', willBeFlipped);
    targetCard.setAttribute('aria-expanded', String(willBeFlipped));
  }

  flipCards.forEach((card) => {
    let touchMoved = false;
    let startX = 0;
    let startY = 0;
    let lastTouchTime = 0;

    card.addEventListener(
      'touchstart',
      (e) => {
        touchMoved = false;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      { passive: true },
    );

    card.addEventListener(
      'touchmove',
      (e) => {
        const dx = Math.abs(e.touches[0].clientX - startX);
        const dy = Math.abs(e.touches[0].clientY - startY);
        if (dx > 10 || dy > 10) {
          touchMoved = true;
        }
      },
      { passive: true },
    );

    card.addEventListener('touchend', (e) => {
      if (!touchMoved) {
        lastTouchTime = Date.now();
        toggleCardFlip(card);
      }
    });

    card.addEventListener('click', () => {
      if (Date.now() - lastTouchTime < 400) {
        return;
      }
      toggleCardFlip(card);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCardFlip(card);
      } else if (e.key === 'Escape') {
        card.classList.remove('is-flipped');
        card.setAttribute('aria-expanded', 'false');
      }
    });
  });

  function goToSlide(index) {
    unflipAllCards();
    const target = Math.max(0, Math.min(slides.length - 1, index));
    carousel.scrollTo({
      left: slides[target].offsetLeft - slides[0].offsetLeft,
      behavior: document.body.classList.contains('paused') ? 'auto' : 'smooth',
    });
  }
  function changeEvents(delta) {
    goToSlide(selected + delta);
  }
  previous.addEventListener('click', () => changeEvents(-1));
  next.addEventListener('click', () => changeEvents(1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));
  carousel.addEventListener(
    'scroll',
    () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(() => {
          updateEvents();
          scheduled = false;
        });
      }
    },
    { passive: true },
  );
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      changeEvents(e.key === 'ArrowRight' ? 1 : -1);
    }
  });
  addEventListener('resize', updateEvents);
  updateEvents();
  function updateCountdown() {
    const value = countdownParts(content.date);
    for (const el of document.querySelectorAll('[data-count]'))
      el.textContent = String(value[el.dataset.count]).padStart(2, '0');
    const timer = document.querySelector('#countdown');
    if (timer)
      timer.setAttribute(
        'aria-label',
        value.days +
          ' days, ' +
          value.hours +
          ' hours, ' +
          value.minutes +
          ' minutes, ' +
          value.seconds +
          ' seconds until the wedding',
      );
  }
  if (content.countdown.enabled) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
  const audio = document.querySelector('#wedding-music'),
    music = document.querySelector('#music');
  if (audio && music) {
    audio.volume = content.music.volume;
    function reflect() {
      music.setAttribute('aria-pressed', String(!audio.paused));
      music.setAttribute('aria-label', audio.paused ? 'Play music' : 'Pause music');
      music.textContent = audio.paused ? '♫' : '♪';
    }
    music.addEventListener('click', async () => {
      if (audio.paused) {
        try {
          await audio.play();
        } catch {
          music.setAttribute('aria-label', 'Play music');
        }
      } else audio.pause();
      reflect();
    });
    audio.addEventListener('play', reflect);
    audio.addEventListener('pause', reflect);
    reflect();
    if (content.music.playOnBoard)
      document
        .querySelector('.cover .primary-button')
        ?.addEventListener('click', () => audio.play().catch(() => {}));
  }
  const entrance = document.querySelector('#palace-entrance');
  if (entrance) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const shell = document.querySelector('.site-shell');
    if (shell) shell.inert = true;
    document.body.style.overflow = 'hidden';
    function enter(play) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.querySelector('#welcome')?.scrollIntoView({ behavior: 'instant', block: 'start' });

      entrance.classList.add('entrance-closing');
      setTimeout(() => {
        entrance.hidden = true;
        if (shell) shell.inert = false;
        document.body.style.overflow = '';
        window.scrollTo(0, 0);
      }, 600);
      if (play && audio) {
        audio.volume = content.music.volume || 0.45;
        const playPromise = audio.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(() => {});
        }
      }
      document.querySelector('#page-index')?.focus();
    }
    document.querySelector('#entrance-board')?.addEventListener('click', () => enter(true));
  }

  // --------------------------------------------------------------------------
  // PAGE 2: INTERACTIVE GOLD TRAIN WINDOW OPEN & CELEBRATION CONFETTI
  // --------------------------------------------------------------------------
  const windowWrappers = document.querySelectorAll('.portrait-window-wrapper');

  function triggerWindowConfetti(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const w = canvas.width;
    const h = canvas.height;

    const colors = [
      '#ffd700', // 24k bright gold
      '#d4af37', // metallic classic gold
      '#f5d77f', // gleaming pale gold
      '#e6b800', // rich golden amber
      '#ffec99', // radiant champagne gold
      '#c9a86a', // antique carriage brass
      '#ffe066', // warm yellow gold
      '#fff8db', // white-gold star glimmer
    ];

    const particles = [];
    const count = 75;
    const originX = w * 0.5;
    const originY = h * 0.45;

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 1.5) + Math.PI * 0.75;
      const speed = (Math.random() * 7 + 4.5) * (w / 350);
      particles.push({
        x: originX + (Math.random() - 0.5) * (w * 0.25),
        y: originY + (Math.random() - 0.5) * (h * 0.15),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (3.5 * (h / 450)),
        size: (Math.random() * 6 + 4) * dpr,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        tilt: Math.random() * 10,
        tiltSpeed: Math.random() * 0.18 + 0.06,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : (Math.random() > 0.4 ? 'circle' : 'star'),
      });
    }

    let startTime = performance.now();

    function render(now) {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, w, h);

      let active = 0;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.24 * dpr; // realistic gravity
        p.vx *= 0.985; // air resistance
        p.rotation += p.rotationSpeed;
        p.tilt += p.tiltSpeed;

        if (elapsed > 1100) {
          p.opacity -= 0.018; // soft fadeout
        }

        if (p.opacity > 0 && p.y < h + 30) {
          active++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            const width = p.size * Math.cos(p.tilt);
            const height = p.size * 1.6;
            ctx.fillRect(-width / 2, -height / 2, width, height);
          } else if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Star particle
            ctx.beginPath();
            for (let s = 0; s < 5; s++) {
              ctx.lineTo(
                Math.cos(((18 + s * 72) * Math.PI) / 180) * p.size,
                -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.size,
              );
              ctx.lineTo(
                Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size * 0.48),
                -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size * 0.48),
              );
            }
            ctx.closePath();
            ctx.fill();
          }

          ctx.restore();
        }
      }

      if (active > 0 && elapsed < 3500) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    }

    requestAnimationFrame(render);
  }

  windowWrappers.forEach((wrapper) => {
    const cue = wrapper.querySelector('.window-tap-cue');
    const tapText = cue?.querySelector('.tap-text');
    const tapHand = cue?.querySelector('.tap-hand');
    const canvas = wrapper.querySelector('.portrait-confetti-canvas');
    let lastToggle = 0;

    function toggleWindow() {
      const willBeOpen = !wrapper.classList.contains('is-open');
      wrapper.classList.toggle('is-open', willBeOpen);
      wrapper.setAttribute('aria-expanded', String(willBeOpen));

      if (tapText && tapHand) {
        if (!willBeOpen) {
          tapText.textContent = wrapper.classList.contains('memory-window-wrapper')
            ? 'Tap to open'
            : 'Tap to open';
          tapHand.textContent = '👆';
        } else {
          if (wrapper.classList.contains('memory-window-wrapper')) {
            tapText.textContent = 'Tap to enlarge';
            tapHand.textContent = '🔍';
          }
        }
      }

      if (willBeOpen && canvas) {
        setTimeout(() => triggerWindowConfetti(canvas), 240);
      }
    }

    let touchMoved = false;
    let startX = 0;
    let startY = 0;

    wrapper.addEventListener(
      'touchstart',
      (e) => {
        touchMoved = false;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      { passive: true },
    );

    wrapper.addEventListener(
      'touchmove',
      (e) => {
        if (
          Math.abs(e.touches[0].clientX - startX) > 10 ||
          Math.abs(e.touches[0].clientY - startY) > 10
        ) {
          touchMoved = true;
        }
      },
      { passive: true },
    );

    wrapper.addEventListener('touchend', (e) => {
      if (!touchMoved) {
        e.preventDefault();
        lastToggle = Date.now();
        toggleWindow();
      }
    });

    wrapper.addEventListener('click', () => {
      if (Date.now() - lastToggle < 400) return;
      toggleWindow();
    });

    wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleWindow();
      } else if (e.key === 'Escape' && wrapper.classList.contains('is-open')) {
        toggleWindow();
      }
    });
  });

  // --------------------------------------------------------------------------
  // PAGE 3: INTERACTIVE OUR STORY SCRATCH-TO-REVEAL CARDS
  // --------------------------------------------------------------------------
  const scratchContainers = document.querySelectorAll('.story-scratch-container');

  scratchContainers.forEach((container) => {
    const canvas = container.querySelector('.story-scratch-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRevealed = false;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let checkCounter = 0;

    function initFoil() {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      // Draw metallic gold foil coating
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#d4af37');
      grad.addColorStop(0.25, '#f5d77f');
      grad.addColorStop(0.5, '#aa7a1e');
      grad.addColorStop(0.75, '#ffe082');
      grad.addColorStop(1, '#c99738');

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle metallic noise / sparkle flecks
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      for (let i = 0; i < 40; i++) {
        const rx = Math.random() * w;
        const ry = Math.random() * h;
        const rsize = Math.random() * 3 * dpr;
        ctx.fillRect(rx, ry, rsize, rsize);
      }

      // Delicate engraved railway monogram & borders
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.5 * dpr;
      ctx.strokeRect(10 * dpr, 10 * dpr, w - 20 * dpr, h - 20 * dpr);

      // Dashed inner border
      ctx.strokeStyle = 'rgba(100, 68, 12, 0.35)';
      ctx.lineWidth = 1 * dpr;
      ctx.setLineDash([5 * dpr, 4 * dpr]);
      ctx.strokeRect(15 * dpr, 15 * dpr, w - 30 * dpr, h - 30 * dpr);
      ctx.setLineDash([]);

      // Centered vintage lettering
      ctx.fillStyle = '#422e0f';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
      ctx.shadowOffsetY = 1 * dpr;
      ctx.font = `bold ${Math.max(10, Math.round(12 * dpr))}px 'Lora', Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✧ SCRATCH TO REVEAL ✧', w / 2, h / 2 - 4 * dpr);

      ctx.font = `${Math.max(7, Math.round(8.5 * dpr))}px sans-serif`;
      ctx.fillStyle = '#5c4114';
      ctx.fillText('COASTAL EXPRESS MEMORY', w / 2, h / 2 + 15 * dpr);
      ctx.shadowColor = 'transparent';
    }

    initFoil();
    window.addEventListener('resize', () => {
      if (!isRevealed) initFoil();
    });

    function scratch(clientX, clientY) {
      if (isRevealed) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = canvas.width / rect.width;
      const curX = (clientX - rect.left) * dpr;
      const curY = (clientY - rect.top) * dpr;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 42 * dpr;

      ctx.beginPath();
      if (lastX && lastY) {
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(curX, curY);
      } else {
        ctx.arc(curX, curY, 21 * dpr, 0, Math.PI * 2);
      }
      ctx.stroke();

      lastX = curX;
      lastY = curY;

      checkCounter++;
      if (checkCounter % 12 === 0) {
        checkClearedPercent();
      }
    }

    function checkClearedPercent() {
      if (isRevealed) return;
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      let cleared = 0;
      const stepX = Math.floor(w / 10);
      const stepY = Math.floor(h / 8);

      try {
        const imgData = ctx.getImageData(0, 0, w, h);
        let sampled = 0;
        for (let y = stepY; y < h - stepY; y += stepY) {
          for (let x = stepX; x < w - stepX; x += stepX) {
            sampled++;
            const idx = (y * w + x) * 4 + 3;
            if (imgData.data[idx] < 128) {
              cleared++;
            }
          }
        }
        if (sampled > 0 && cleared / sampled >= 0.32) {
          revealCard();
        }
      } catch (err) {
        // Fallback for security/sampling restrictions
      }
    }

    function revealCard() {
      if (isRevealed) return;
      isRevealed = true;
      container.classList.add('is-revealed');
    }

    // Pointer event listeners (supporting touch, mouse, stylus seamlessly)
    container.addEventListener('pointerdown', (e) => {
      if (isRevealed) return;
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      const dpr = canvas.width / rect.width;
      lastX = (e.clientX - rect.left) * dpr;
      lastY = (e.clientY - rect.top) * dpr;
      scratch(e.clientX, e.clientY);
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDrawing || isRevealed) return;
      scratch(e.clientX, e.clientY);
    });

    window.addEventListener('pointerup', () => {
      if (isDrawing) {
        isDrawing = false;
        lastX = 0;
        lastY = 0;
        checkClearedPercent();
      }
    });

    // Quick 1-tap reveal button
    const quickBtn = container.querySelector('.scratch-reveal-btn');
    quickBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      revealCard();
    });
  });

  // --------------------------------------------------------------------------
  // PAGE 7: INTERACTIVE RSVP TICKET STEPPER & SEAT SELECTOR
  // --------------------------------------------------------------------------
  const rsvpForm = document.querySelector('#rsvp-form');
  if (rsvpForm) {
    const guestsSelect = rsvpForm.querySelector('#guests');
    const guestMinus = rsvpForm.querySelector('#guest-minus');
    const guestPlus = rsvpForm.querySelector('#guest-plus');
    const stepperDigit = rsvpForm.querySelector('#stepper-digit');
    const stepperUnit = rsvpForm.querySelector('#stepper-unit');
    const stepperWrap = rsvpForm.querySelector('#guest-stepper-wrap');

    let guestCount = 1;

    function syncGuestDisplay(val) {
      guestCount = Math.max(1, Math.min(6, val));
      if (guestsSelect) guestsSelect.value = String(guestCount);
      if (stepperDigit) stepperDigit.textContent = String(guestCount);
      if (stepperUnit) {
        stepperUnit.textContent = guestCount === 1 ? 'GUEST (FIRST CLASS)' : 'GUESTS (FIRST CLASS)';
      }
      if (guestMinus) guestMinus.disabled = guestCount <= 1;
      if (guestPlus) guestPlus.disabled = guestCount >= 6;
    }

    guestMinus?.addEventListener('click', () => syncGuestDisplay(guestCount - 1));
    guestPlus?.addEventListener('click', () => syncGuestDisplay(guestCount + 1));
    guestsSelect?.addEventListener('change', () => {
      syncGuestDisplay(parseInt(guestsSelect.value, 10) || 1);
    });

    // Attending radio cards change handler
    const attendingRadios = rsvpForm.querySelectorAll('input[name="attending"]');
    attendingRadios.forEach((radio) => {
      radio.addEventListener('change', () => {
        const isAttending = rsvpForm.elements.attending.value === 'yes';
        if (stepperWrap) {
          stepperWrap.classList.toggle('is-disabled', !isAttending);
        }
        if (guestMinus) guestMinus.disabled = !isAttending || guestCount <= 1;
        if (guestPlus) guestPlus.disabled = !isAttending || guestCount >= 6;
      });
    });

    syncGuestDisplay(1);
  }
})();
