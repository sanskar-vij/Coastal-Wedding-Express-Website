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
  if (page) {
    page.scrollIntoView({ behavior: paused ? 'auto' : 'smooth', block: 'start' });
    location.hash = page.id;
  }
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

  let isNavigatingSlide = false;
  let snapResetTimeout = null;

  function goToSlide(index) {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    if (target === selected && !isNavigatingSlide) return;

    isNavigatingSlide = true;
    carousel.style.scrollSnapType = 'none';

    const targetLeft = slides[target].offsetLeft - slides[0].offsetLeft;
    carousel.scrollTo({
      left: targetLeft,
      behavior: document.body.classList.contains('paused') ? 'auto' : 'smooth',
    });

    clearTimeout(snapResetTimeout);
    snapResetTimeout = setTimeout(() => {
      carousel.style.scrollSnapType = 'x mandatory';
      isNavigatingSlide = false;
      updateEvents();
    }, 450);
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
  let wasPlayingBeforeHidden = false;

  if (audio && music) {
    audio.volume = content.music.volume;
    function reflect() {
      music.setAttribute('aria-pressed', String(!audio.paused));
      music.setAttribute('aria-label', audio.paused ? 'Play music' : 'Pause music');
      music.textContent = audio.paused ? '♫' : '♪';
    }
    music.addEventListener('click', async () => {
      if (audio.paused) {
        wasPlayingBeforeHidden = false;
        try {
          await audio.play();
        } catch {
          music.setAttribute('aria-label', 'Play music');
        }
      } else {
        wasPlayingBeforeHidden = false;
        audio.pause();
      }
      reflect();
    });
    audio.addEventListener('play', reflect);
    audio.addEventListener('pause', reflect);
    reflect();

    // Cross-device audio lifecycle handlers: pause music on tab switch, minimize,
    // backgrounding, lock screen or window close on all devices (mobile iOS/Android and desktop).
    function handleVisibilityChange() {
      if (!audio) return;
      if (document.hidden) {
        if (!audio.paused) {
          wasPlayingBeforeHidden = true;
          audio.pause();
        }
      } else {
        if (wasPlayingBeforeHidden && !document.body.classList.contains('paused')) {
          audio.play().catch(() => {});
        }
        wasPlayingBeforeHidden = false;
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    window.addEventListener('pagehide', () => {
      if (audio && !audio.paused) {
        wasPlayingBeforeHidden = true;
        audio.pause();
      }
    });

    window.addEventListener('beforeunload', () => {
      if (audio) {
        audio.pause();
      }
    });

    window.addEventListener('blur', () => {
      if (document.hidden && audio && !audio.paused) {
        wasPlayingBeforeHidden = true;
        audio.pause();
      }
    });

    window.addEventListener('focus', () => {
      if (!document.hidden && wasPlayingBeforeHidden && audio && !document.body.classList.contains('paused')) {
        audio.play().catch(() => {});
        wasPlayingBeforeHidden = false;
      }
    });

    if (content.music.playOnBoard)
      document
        .querySelector('.cover .primary-button')
        ?.addEventListener('click', () => audio.play().catch(() => {}));
  }
  // ==========================================================================
  // CENTRALIZED SCROLL LOCK MANAGER
  // ==========================================================================
  const ScrollLock = {
    isLocked: false,
    lockKeys: new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Space', ' ', 'Home', 'End']),

    handleWheel(e) {
      if (!ScrollLock.isLocked) return;
      if (e.target.closest?.('.entrance-scrollable')) return;
      e.preventDefault();
    },

    handleTouchMove(e) {
      if (!ScrollLock.isLocked) return;
      if (e.target.closest?.('.entrance-scrollable')) return;
      e.preventDefault();
    },

    handleKeyDown(e) {
      if (!ScrollLock.isLocked) return;
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return;
      if (ScrollLock.lockKeys.has(e.key)) {
        e.preventDefault();
      }
    },

    lock() {
      if (ScrollLock.isLocked) return;
      ScrollLock.isLocked = true;
      window.addEventListener('wheel', ScrollLock.handleWheel, { passive: false });
      window.addEventListener('touchmove', ScrollLock.handleTouchMove, { passive: false });
      window.addEventListener('keydown', ScrollLock.handleKeyDown, { passive: false });
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    },

    unlock() {
      if (!ScrollLock.isLocked) return;
      ScrollLock.isLocked = false;
      window.removeEventListener('wheel', ScrollLock.handleWheel);
      window.removeEventListener('touchmove', ScrollLock.handleTouchMove);
      window.removeEventListener('keydown', ScrollLock.handleKeyDown);

      // Clean up body and document styles
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    }
  };
  window.ScrollLock = ScrollLock;

  // ==========================================================================
  // REUSABLE 24K GOLD CONFETTI PARTICLE SYSTEM
  // ==========================================================================
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
            const spikes = 4;
            const outerRadius = p.size * 0.8;
            const innerRadius = p.size * 0.35;
            ctx.beginPath();
            let rot = (Math.PI / 2) * 3;
            let cx = 0;
            let cy = 0;
            let step = Math.PI / spikes;

            ctx.moveTo(cx, cy - outerRadius);
            for (let s = 0; s < spikes; s++) {
              cx = Math.cos(rot) * outerRadius;
              cy = Math.sin(rot) * outerRadius;
              ctx.lineTo(cx, cy);
              rot += step;

              cx = Math.cos(rot) * innerRadius;
              cy = Math.sin(rot) * innerRadius;
              ctx.lineTo(cx, cy);
              rot += step;
            }
            ctx.lineTo(0, -outerRadius);
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

  // ==========================================================================
  // ENTRANCE MODAL DISMISSAL & SYNCHRONIZED SCROLL ACTIVATION
  // ==========================================================================
  const entrance = document.querySelector('#palace-entrance');
  let entranceDismissed = false;

  function dismissEntranceModal(playAudio = true) {
    if (entranceDismissed) return;
    entranceDismissed = true;

    // 1. Success styling on the saloon card
    const saloonCard = entrance?.querySelector('.entrance-saloon-card');
    if (saloonCard) {
      saloonCard.classList.add('saloon-card-success');
    }

    // 2. Celebratory gold confetti burst
    const confettiCanvas = entrance?.querySelector('.entrance-confetti-canvas');
    if (confettiCanvas) {
      triggerWindowConfetti(confettiCanvas);
    }

    // 3. Play wedding song synchronously with user interaction
    if (playAudio && audio) {
      audio.volume = content.music.volume || 0.45;
      const playPromise = audio.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(() => {});
      }
    }

    // 4. Modal Exit Animation & Scroll Activation
    setTimeout(() => {
      if (!entrance) {
        ScrollLock.unlock();
        return;
      }

      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.querySelector('#welcome')?.scrollIntoView({ behavior: 'instant', block: 'start' });

      entrance.classList.add('entrance-closing');

      let unlocked = false;
      const finalizeExit = () => {
        if (unlocked) return;
        unlocked = true;
        entrance.hidden = true;
        const shell = document.querySelector('.site-shell');
        if (shell) shell.inert = false;

        // SCROLL ACTIVATION: unlocked ONLY after modal exit transition finishes!
        ScrollLock.unlock();
        window.scrollTo(0, 0);
        document.querySelector('#page-index')?.focus();
      };

      entrance.addEventListener('transitionend', finalizeExit, { once: true });
      setTimeout(finalizeExit, 750);
    }, 400);
  }

  if (entrance) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const shell = document.querySelector('.site-shell');
    if (shell) shell.inert = true;

    // Lock background scrolling initially while entrance modal is active
    ScrollLock.lock();

    // Interaction triggers:
    // A. Click on "BEGIN YOUR JOURNEY" button
    document.querySelector('#entrance-board')?.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissEntranceModal(true);
    });

    // B. Tap anywhere on entrance pavilion
    entrance.addEventListener('click', () => {
      dismissEntranceModal(true);
    });
  }

  // --------------------------------------------------------------------------
  // PAGE 2: INTERACTIVE GOLD TRAIN WINDOW OPEN & CELEBRATION CONFETTI
  // --------------------------------------------------------------------------
  const windowWrappers = document.querySelectorAll('.portrait-window-wrapper');

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
  // PAGE 3: INTERACTIVE OUR STORY STATION CAROUSEL & HARDWARE SLIDER
  // --------------------------------------------------------------------------
  const storyTrack = document.querySelector('#story-track');
  const storyCarousel = document.querySelector('#story-carousel');
  if (storyTrack && storyCarousel) {
    const storyCards = [...storyTrack.querySelectorAll('.story-card')];
    const storyPills = [...document.querySelectorAll('.story-station-pill')];
    const storyDots = [...document.querySelectorAll('.story-dot')];
    const storyPrev = document.querySelector('#story-prev');
    const storyNext = document.querySelector('#story-next');
    let currentStory = 0;

    function goToStory(index) {
      if (index < 0 || index >= storyCards.length) return;
      currentStory = index;

      // 1. Hardware-accelerated smooth slide (100% reliable across all browsers & devices)
      storyTrack.style.transform = `translateX(-${currentStory * 100}%)`;

      // 2. Reflect active card
      storyCards.forEach((card, i) => {
        const isActive = i === currentStory;
        card.classList.toggle('active', isActive);
        card.setAttribute('aria-hidden', String(!isActive));
      });

      // 3. Reflect active station pill
      storyPills.forEach((pill, i) => {
        const isActive = i === currentStory;
        pill.classList.toggle('active', isActive);
        pill.setAttribute('aria-selected', String(isActive));
      });

      // 4. Reflect active indicator dot
      storyDots.forEach((dot, i) => {
        const isActive = i === currentStory;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
      });

      // 5. Update arrow controls
      if (storyPrev) storyPrev.disabled = currentStory === 0;
      if (storyNext) storyNext.disabled = currentStory === storyCards.length - 1;
    }

    // Station pill navigation
    storyPills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = parseInt(pill.getAttribute('data-story-target'), 10);
        goToStory(idx);
      });
    });

    // Dot navigation
    storyDots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = parseInt(dot.getAttribute('data-dot-index'), 10);
        goToStory(idx);
      });
    });

    // Arrow navigation
    storyPrev?.addEventListener('click', (e) => {
      e.preventDefault();
      goToStory(currentStory - 1);
    });

    storyNext?.addEventListener('click', (e) => {
      e.preventDefault();
      goToStory(currentStory + 1);
    });

    // Keyboard support: Left and Right arrow keys when focused
    storyCarousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToStory(currentStory + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToStory(currentStory - 1);
      }
    });

    // Touch swipe support (fluid horizontal swipe with vertical scroll preservation)
    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    storyCarousel.addEventListener(
      'touchstart',
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwiping = true;
      },
      { passive: true },
    );

    storyCarousel.addEventListener(
      'touchend',
      (e) => {
        if (!isSwiping) return;
        isSwiping = false;
        const diffX = e.changedTouches[0].clientX - startX;
        const diffY = e.changedTouches[0].clientY - startY;

        // If predominantly horizontal swipe with at least 35px threshold
        if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            goToStory(currentStory + 1); // Swipe left -> Next
          } else {
            goToStory(currentStory - 1); // Swipe right -> Previous
          }
        }
      },
      { passive: true },
    );

    goToStory(0);
  }

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

  // --------------------------------------------------------------------------
  // INTERACTIVE GLOWING STAMP & "SEE YOU ON BOARD!" SPARKLE CELEBRATION
  // --------------------------------------------------------------------------

  // Stamp glow, expanding halo ring & golden ember explosion
  function createStampGlowEffects(stamp) {
    const rect = stamp.getBoundingClientRect();
    const parent = stamp.parentElement || document.body;
    const parentRect = parent.getBoundingClientRect();
    const centerX = rect.left - parentRect.left + rect.width / 2;
    const centerY = rect.top - parentRect.top + rect.height / 2;

    // Expanding golden halo ring
    const halo = document.createElement('span');
    halo.className = 'stamp-halo-ring';
    halo.style.left = `${centerX}px`;
    halo.style.top = `${centerY}px`;
    halo.style.width = `${rect.width * 0.9}px`;
    halo.style.height = `${rect.width * 0.9}px`;
    parent.appendChild(halo);
    setTimeout(() => halo.remove(), 1250);

    // Warm golden ember sparks
    const symbols = ['✧', '✦', '⋆', '★'];
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('span');
      p.className = 'stamp-particle';
      p.textContent = symbols[i % symbols.length];
      const angle = (i / 8) * (2 * Math.PI) + (Math.random() * 0.3 - 0.15);
      const distance = 35 + Math.random() * 32;
      p.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
      p.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
      p.style.setProperty('--rot', `${Math.floor(Math.random() * 360)}deg`);
      p.style.left = `${centerX}px`;
      p.style.top = `${centerY}px`;
      parent.appendChild(p);
      setTimeout(() => p.remove(), 1250);
    }
  }

  const stamps = document.querySelectorAll('.stamp');
  stamps.forEach((stamp) => {
    let glowTimer = null;
    function triggerStampGlow(e) {
      if (e) e.stopPropagation();
      stamp.classList.remove('stamp-glow');
      void stamp.offsetWidth; // Force CSS reflow to re-trigger animation
      stamp.classList.add('stamp-glow');
      createStampGlowEffects(stamp);

      // If stamp is inside farewell card, also trigger sparkles on "See you on board!"
      if (stamp.closest('.farewell')) {
        const wrap = stamp.parentElement?.querySelector('.see-you-wrap');
        if (wrap) {
          triggerCelebration(wrap);
        }
      }

      clearTimeout(glowTimer);
      glowTimer = setTimeout(() => {
        stamp.classList.remove('stamp-glow');
      }, 1650);
    }

    stamp.addEventListener('click', triggerStampGlow);
    stamp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerStampGlow(e);
      }
    });
  });

  // "See you on board!" Sparkle Celebration
  function triggerCelebration(wrap) {
    const rect = wrap.getBoundingClientRect();
    const symbols = ['✧', '✦', '⋆', '★', '✨'];
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('span');
      s.className = 'celebration-sparkle';
      s.textContent = symbols[i % symbols.length];
      const angle = (i / 12) * (2 * Math.PI) + (Math.random() * 0.4 - 0.2);
      const dist = 30 + Math.random() * 45;
      s.style.setProperty('--cx', `${Math.cos(angle) * dist}px`);
      s.style.setProperty('--cy', `${Math.sin(angle) * dist - 8}px`);
      s.style.setProperty('--crot', `${Math.floor(Math.random() * 360)}deg`);
      s.style.left = `${rect.width / 2}px`;
      s.style.top = `${rect.height / 2}px`;
      wrap.appendChild(s);
      setTimeout(() => s.remove(), 1450);
    }
  }

  const seeYouWrap = document.querySelector('.see-you-wrap');
  if (seeYouWrap) {
    seeYouWrap.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerCelebration(seeYouWrap);
    });
    seeYouWrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerCelebration(seeYouWrap);
      }
    });
  }
})();
