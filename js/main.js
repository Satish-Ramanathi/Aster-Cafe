/* ==========================================================================
   ASTER CAFE AND KITCHEN — MAIN JAVASCRIPT v2.0
   Handles: Navbar, Mobile Menu, Scroll Reveal, Lightbox, Reservation Modal,
            Menu Tabs, Reviews Carousel, Gallery Filter, Event Calendar
   ========================================================================== */

'use strict';

// ── Utility: debounce ──────────────────────────────────────────────────────
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ── 1. NAVBAR: Scroll behaviour + active link highlighting ─────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScrollY = window.scrollY;

  function onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('nav-top');
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.add('nav-top');
    }
    lastScrollY = scrollY;
  }

  // Start transparent if at the top
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Active link highlighting based on section in view
  const sections  = document.querySelectorAll('section[id], footer[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(s => sectionObserver.observe(s));
})();

// ── 2. MOBILE NAVIGATION DRAWER ────────────────────────────────────────────
(function initMobileNav() {
  const btn      = document.getElementById('hamburgerBtn');
  const drawer   = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileNavBackdrop');
  if (!btn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    btn.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
  backdrop.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('.mobile-nav-link').forEach(link => link.addEventListener('click', closeDrawer));

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
})();

// ── 3. SCROLL REVEAL ANIMATIONS ────────────────────────────────────────────
(function initScrollReveal() {
  const els = document.querySelectorAll('.fade-up-element');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
})();

// ── 4. MENU TAB SWITCHER ───────────────────────────────────────────────────
(function initMenuTabs() {
  const tabBar = document.getElementById('menuTabBar');
  if (!tabBar) return;

  const tabs   = tabBar.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;

      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(targetId);
      if (panel) {
        panel.classList.add('active');
        // Trigger scroll reveal for newly visible items
        panel.querySelectorAll('.fade-up-element:not(.in-view)').forEach(el => {
          setTimeout(() => el.classList.add('in-view'), 60);
        });
      }
    });
  });
})();

// ── 5. GALLERY FILTER ──────────────────────────────────────────────────────
(function initGalleryFilter() {
  const filterBar = document.getElementById('galleryFilterBar');
  if (!filterBar) return;

  const filterBtns  = filterBar.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        if (filter === 'all') {
          item.classList.remove('hidden');
        } else {
          const cats = item.dataset.category ? item.dataset.category.split(' ') : [];
          item.classList.toggle('hidden', !cats.includes(filter));
        }
      });
    });
  });
})();

// ── 6. GALLERY LIGHTBOX ────────────────────────────────────────────────────
(function initLightbox() {
  const lightbox    = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const caption     = document.getElementById('lightboxCaption');
  const closeBtn    = document.getElementById('lightboxCloseBtn');
  const prevBtn     = document.getElementById('lightboxPrevBtn');
  const nextBtn     = document.getElementById('lightboxNextBtn');
  if (!lightbox) return;

  let currentIndex  = 0;
  let galleryImages = [];

  function buildGalleryList() {
    galleryImages = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)')).map(item => ({
      src: item.querySelector('.gallery-img')?.src || '',
      alt: item.querySelector('.gallery-img')?.alt || '',
      caption: item.querySelector('.gallery-caption')?.textContent || '',
    }));
  }

  function showImage(index) {
    if (!galleryImages.length) return;
    currentIndex = (index + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
    lightboxImg.alt = galleryImages[currentIndex].alt;
    caption.textContent = galleryImages[currentIndex].caption;
  }

  function openLightbox(index) {
    buildGalleryList();
    showImage(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  // Attach click to gallery items
  document.querySelectorAll('.gallery-item').forEach((item, idx) => {
    item.addEventListener('click', () => { buildGalleryList(); openLightbox(idx); });
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); buildGalleryList(); openLightbox(idx); } });
  });

  closeBtn?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  prevBtn?.addEventListener('click', e => { e.stopPropagation(); showImage(currentIndex - 1); });
  nextBtn?.addEventListener('click', e => { e.stopPropagation(); showImage(currentIndex + 1); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
})();

// ── 7. RESERVATION MODAL ───────────────────────────────────────────────────
(function initReservationModal() {
  const modal     = document.getElementById('reservationModal');
  const closeBtn  = document.getElementById('modalCloseBtn');
  const form      = document.getElementById('reservationForm');
  const successEl = document.getElementById('modalSuccessState');
  const eventTypeEl = document.getElementById('reserveEventType');
  if (!modal) return;

  function openModal(eventType) {
    form.style.display = '';
    successEl.classList.remove('show');
    if (eventType && eventTypeEl) {
      const opt = Array.from(eventTypeEl.options).find(o => o.value === eventType);
      if (opt) eventTypeEl.value = opt.value;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Set min date to today
    const dateInput = document.getElementById('reserveDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { form.reset(); clearErrors(); }, 350);
  }

  // Open via any .btn-open-reserve
  document.body.addEventListener('click', e => {
    const trigger = e.target.closest('.btn-open-reserve');
    if (trigger) {
      e.preventDefault();
      openModal(trigger.dataset.eventType);
    }
  });

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });
  document.getElementById('btnCloseSuccess')?.addEventListener('click', closeModal);

  // ── Validation helpers ────────────────────────────────────────────────
  function showError(id, show = true) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('show', show);
  }
  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(e => e.classList.remove('show'));
    document.querySelectorAll('.form-control').forEach(i => i.style.borderColor = '');
  }

  function validate() {
    let valid = true;
    clearErrors();

    const name  = document.getElementById('reserveName');
    const phone = document.getElementById('reservePhone');
    const email = document.getElementById('reserveEmail');
    const date  = document.getElementById('reserveDate');
    const time  = document.getElementById('reserveTime');
    const guests = document.getElementById('reserveGuests');

    if (!name?.value.trim() || name.value.trim().length < 2) {
      showError('errName'); name.style.borderColor = '#D32F2F'; valid = false;
    }
    if (!phone?.value.trim() || !/^\+?[\d\s\-()]{7,15}$/.test(phone.value.trim())) {
      showError('errPhone'); phone.style.borderColor = '#D32F2F'; valid = false;
    }
    if (!email?.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError('errEmail'); email.style.borderColor = '#D32F2F'; valid = false;
    }
    if (!date?.value) {
      showError('errDate'); date.style.borderColor = '#D32F2F'; valid = false;
    } else {
      const selected = new Date(date.value);
      const today = new Date(); today.setHours(0,0,0,0);
      if (selected < today) {
        showError('errDate'); date.style.borderColor = '#D32F2F'; valid = false;
      }
    }
    if (!time?.value) {
      showError('errTime'); time.style.borderColor = '#D32F2F'; valid = false;
    }
    if (!guests?.value) {
      showError('errGuests'); guests.style.borderColor = '#D32F2F'; valid = false;
    }

    return valid;
  }

  // ── Form submit ───────────────────────────────────────────────────────
  form?.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    const name     = document.getElementById('reserveName').value.trim();
    const phone    = document.getElementById('reservePhone').value.trim();
    const email    = document.getElementById('reserveEmail').value.trim();
    const eventType = document.getElementById('reserveEventType').value;
    const date     = document.getElementById('reserveDate').value;
    const time     = document.getElementById('reserveTime').value;
    const guests   = document.getElementById('reserveGuests').value;
    const message  = document.getElementById('reserveMessage').value.trim();

    // Generate reference code
    const refCode = 'AST-' + Math.floor(100000 + Math.random() * 900000);

    // Populate success panel
    document.getElementById('confRefCode').textContent = refCode;
    document.getElementById('confName').textContent    = name;
    document.getElementById('confDate').textContent    = `${date} at ${time}`;
    document.getElementById('confGuests').textContent  = `${guests} guest(s) · ${eventType}`;

    // Build WhatsApp message
    const waMsg = encodeURIComponent(
      `🌸 *New Aster Reservation*\n\n` +
      `📋 Ref: ${refCode}\n` +
      `👤 Name: ${name}\n` +
      `📞 Phone: ${phone}\n` +
      `📧 Email: ${email}\n` +
      `🎉 Event: ${eventType}\n` +
      `📅 Date: ${date} at ${time}\n` +
      `👥 Guests: ${guests}\n` +
      (message ? `💬 Note: ${message}` : '')
    );
    const waLink = `https://wa.me/918686745411?text=${waMsg}`;
    document.getElementById('btnSendWhatsappConfirmation').href = waLink;

    // Show success state
    form.style.display = 'none';
    successEl.classList.add('show');
  });
})();

// ── 8. REVIEWS CAROUSEL ────────────────────────────────────────────────────
(function initReviewsCarousel() {
  const track    = document.getElementById('reviewsTrack');
  const prevBtn  = document.getElementById('reviewsPrevBtn');
  const nextBtn  = document.getElementById('reviewsNextBtn');
  const dotsEl   = document.getElementById('reviewsDots');
  if (!track) return;

  const cards         = Array.from(track.querySelectorAll('.review-card'));
  let currentPage     = 0;
  let cardsPerPage    = 3;
  let totalPages      = 1;
  let autoPlayTimer   = null;

  function getCardsPerPage() {
    if (window.innerWidth <= 767) return 1;
    if (window.innerWidth <= 1023) return 2;
    return 3;
  }

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = 'reviews-dot' + (i === currentPage ? ' active' : '');
      dot.setAttribute('aria-label', `Go to reviews page ${i + 1}`);
      dot.addEventListener('click', () => goToPage(i));
      dotsEl.appendChild(dot);
    }
  }

  function updateDots() {
    dotsEl?.querySelectorAll('.reviews-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentPage);
    });
  }

  function goToPage(page) {
    cardsPerPage = getCardsPerPage();
    totalPages   = Math.ceil(cards.length / cardsPerPage);
    currentPage  = Math.max(0, Math.min(page, totalPages - 1));

    const cardWidth = track.parentElement.offsetWidth;
    const gap       = 24; // 1.5rem
    const offset    = currentPage * (cardWidth + gap);

    // Use discrete card positioning
    const singleCard = cards[0];
    if (!singleCard) return;
    const singleWidth = (cardWidth - (cardsPerPage - 1) * gap) / cardsPerPage;
    const moveBy = currentPage * (singleWidth + gap) * cardsPerPage;

    track.style.transform = `translateX(-${moveBy}px)`;
    updateDots();
  }

  function nextPage() {
    cardsPerPage = getCardsPerPage();
    totalPages   = Math.ceil(cards.length / cardsPerPage);
    goToPage((currentPage + 1) % totalPages);
  }
  function prevPage() {
    cardsPerPage = getCardsPerPage();
    totalPages   = Math.ceil(cards.length / cardsPerPage);
    goToPage((currentPage - 1 + totalPages) % totalPages);
  }

  function initCarousel() {
    cardsPerPage = getCardsPerPage();
    totalPages   = Math.ceil(cards.length / cardsPerPage);
    currentPage  = 0;

    // Size cards
    const containerWidth = track.parentElement.offsetWidth;
    const gap = 24;
    const cardWidth = (containerWidth - (cardsPerPage - 1) * gap) / cardsPerPage;
    cards.forEach(card => {
      card.style.minWidth = `${cardWidth}px`;
    });

    track.style.gap = `${gap}px`;
    track.style.transform = 'translateX(0)';
    buildDots();
  }

  prevBtn?.addEventListener('click', prevPage);
  nextBtn?.addEventListener('click', nextPage);

  // Auto-play
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextPage, 5000);
  }
  function stopAutoPlay() {
    clearInterval(autoPlayTimer);
  }

  const wrapper = track.closest('.reviews-carousel-wrapper');
  wrapper?.addEventListener('mouseenter', stopAutoPlay);
  wrapper?.addEventListener('mouseleave', startAutoPlay);

  // Touch/swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? nextPage() : prevPage(); }
  }, { passive: true });

  initCarousel();
  startAutoPlay();

  window.addEventListener('resize', debounce(() => {
    initCarousel();
    goToPage(0);
    startAutoPlay();
  }, 250));
})();

// ── 9. MINI EVENT CALENDAR ─────────────────────────────────────────────────
(function initMiniCalendar() {
  const calGrid   = document.getElementById('calendarGrid');
  const monthLabel = document.getElementById('calMonthLabel');
  const prevBtn   = document.getElementById('calPrevBtn');
  const nextBtn   = document.getElementById('calNextBtn');
  if (!calGrid) return;

  const eventDates = [5, 12, 19, 26]; // October event days

  const now     = new Date();
  let viewYear  = now.getFullYear();
  let viewMonth = now.getMonth();

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  function renderCalendar() {
    calGrid.innerHTML = '';
    monthLabel.textContent = `${MONTHS[viewMonth]} ${viewYear}`;

    // Day headers
    DAYS.forEach(d => {
      const h = document.createElement('div');
      h.className = 'calendar-day-header';
      h.textContent = d;
      calGrid.appendChild(h);
    });

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevDays = new Date(viewYear, viewMonth, 0).getDate();

    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = document.createElement('div');
      d.className = 'calendar-day other-month';
      d.textContent = prevDays - i;
      calGrid.appendChild(d);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = document.createElement('div');
      d.className = 'calendar-day';
      d.textContent = day;

      const isToday = (day === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear());
      if (isToday) d.classList.add('today');
      if (eventDates.includes(day) && viewMonth === 9 && viewYear === 2026) d.classList.add('has-event');

      d.addEventListener('click', () => {
        calGrid.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
        d.classList.add('selected');
      });

      calGrid.appendChild(d);
    }

    // Next month leading days
    const totalShown = firstDay + daysInMonth;
    const remaining  = 42 - totalShown; // always show 6 rows
    for (let i = 1; i <= Math.min(remaining, 14); i++) {
      const d = document.createElement('div');
      d.className = 'calendar-day other-month';
      d.textContent = i;
      calGrid.appendChild(d);
    }
  }

  prevBtn?.addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });
  nextBtn?.addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });

  renderCalendar();
})();
