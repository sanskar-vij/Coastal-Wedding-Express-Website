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