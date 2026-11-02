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
})();
