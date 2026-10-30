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
