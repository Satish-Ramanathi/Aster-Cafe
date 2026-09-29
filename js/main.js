/**
 * ASTER CAFE AND KITCHEN - INTERACTIVE CONTROLLER
 * Handles navigation, mobile menu, reservation modal, lightbox,
 * scroll animations, and gallery filtering.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initReservationModal();
  initGallery();
  initScrollAnimations();
});

/* ==========================================================================
   1. NAVBAR & SCROLL SPY
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy for active link
    let currentSection = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta-btn');

  function openMenu() {
    hamburgerBtn.classList.add('active');
    mobileDrawer.classList.add('open');
    mobileBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburgerBtn.classList.remove('active');
    mobileDrawer.classList.remove('open');
    mobileBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // ESC key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   3. RESERVATION MODAL & VALIDATION
   ========================================================================== */
function initReservationModal() {
  const modalBackdrop = document.getElementById('reservationModal');
  const openButtons = document.querySelectorAll('.btn-open-reserve');
  const closeButton = document.getElementById('modalCloseBtn');
  const reservationForm = document.getElementById('reservationForm');
  const successState = document.getElementById('modalSuccessState');
  const eventTypeSelect = document.getElementById('reserveEventType');
  const dateInput = document.getElementById('reserveDate');
  const whatsappConfirmBtn = document.getElementById('btnSendWhatsappConfirmation');
  const closeSuccessBtn = document.getElementById('btnCloseSuccess');

  // Set min date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  function openModal(defaultEvent = 'Dining Table') {
    if (modalBackdrop) {
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Pre-select event type if passed
      if (eventTypeSelect && defaultEvent) {
        for (let i = 0; i < eventTypeSelect.options.length; i++) {
          if (eventTypeSelect.options[i].value.toLowerCase().includes(defaultEvent.toLowerCase())) {
            eventTypeSelect.selectedIndex = i;
            break;
          }
        }
      }

      // Reset to form if previously on success
      if (reservationForm) reservationForm.style.display = 'block';
      if (successState) successState.classList.remove('active');
    }
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const eventType = btn.getAttribute('data-event-type') || 'Dining Table';
      openModal(eventType);
    });
  });

  if (closeButton) closeButton.addEventListener('click', closeModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // Form Validation and Submission
  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      const name = document.getElementById('reserveName');
      const phone = document.getElementById('reservePhone');
      const email = document.getElementById('reserveEmail');
      const date = document.getElementById('reserveDate');
      const time = document.getElementById('reserveTime');
      const guests = document.getElementById('reserveGuests');
      const eventType = document.getElementById('reserveEventType');
      const message = document.getElementById('reserveMessage');

      function validateField(input, condition, errorId) {
        const errorEl = document.getElementById(errorId);
        if (!condition) {
          if (errorEl) errorEl.classList.add('visible');
          input.style.borderColor = '#D32F2F';
          isValid = false;
        } else {
          if (errorEl) errorEl.classList.remove('visible');
          input.style.borderColor = '#E0E0E0';
        }
      }

      validateField(name, name.value.trim().length >= 2, 'errName');
      validateField(phone, /^[0-9+ ]{8,15}$/.test(phone.value.trim()), 'errPhone');
      validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()), 'errEmail');
      validateField(date, date.value.trim() !== '', 'errDate');
      validateField(time, time.value.trim() !== '', 'errTime');
      validateField(guests, guests.value.trim() !== '', 'errGuests');

      if (!isValid) return;

      // Populate Success Summary
      const refCode = 'AST-' + Math.floor(100000 + Math.random() * 900000);
      document.getElementById('confRefCode').textContent = refCode;
      document.getElementById('confName').textContent = name.value.trim();
      document.getElementById('confDate').textContent = `${date.value} at ${time.value}`;
      document.getElementById('confGuests').textContent = `${guests.value} Guest(s) (${eventType.value})`;

      // Prepare WhatsApp Direct Message link
      if (whatsappConfirmBtn) {
        const msg = encodeURIComponent(
          `Hello Aster Cafe and Kitchen!\nI just placed a reservation request:\n\nReference: ${refCode}\nName: ${name.value.trim()}\nPhone: ${phone.value.trim()}\nDate & Time: ${date.value} at ${time.value}\nGuests: ${guests.value}\nEvent Type: ${eventType.value}\nSpecial Requests: ${message.value.trim() || 'None'}`
        );
        whatsappConfirmBtn.href = `https://wa.me/918686745411?text=${msg}`;
      }

      // Transition to success screen
      reservationForm.style.display = 'none';
      successState.classList.add('active');
      reservationForm.reset();
    });
  }
}

/* ==========================================================================
   4. GALLERY FILTER & LIGHTBOX
   ========================================================================== */
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const filterBtns = document.querySelectorAll('.gallery-tab-btn');
  const viewMoreBtn = document.getElementById('galleryViewMoreBtn');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');

  let currentActiveIndex = 0;
  let visibleItems = [];

  function updateVisibleItems() {
    visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
  }

  // Filter Buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      updateVisibleItems();
    });
  });

  // View More Button Toggle
  if (viewMoreBtn) {
    let isExpanded = false;
    viewMoreBtn.addEventListener('click', () => {
      const extraItems = document.querySelectorAll('.gallery-item-extra');
      isExpanded = !isExpanded;

      extraItems.forEach((item) => {
        if (isExpanded) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      if (isExpanded) {
        viewMoreBtn.textContent = 'View Less ↑';
      } else {
        viewMoreBtn.textContent = 'View More →';
      }

      updateVisibleItems();
    });
  }

  // Lightbox Implementation
  function openLightbox(index) {
    updateVisibleItems();
    if (visibleItems.length === 0) return;

    currentActiveIndex = index;
    const item = visibleItems[currentActiveIndex];
    const img = item.querySelector('.gallery-img');
    const caption = item.querySelector('.gallery-item-caption');

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || 'Aster Cafe Photo';
    lightboxCaption.textContent = caption ? caption.textContent : 'Aster Cafe and Kitchen';

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    updateVisibleItems();
    currentActiveIndex = (currentActiveIndex + 1) % visibleItems.length;
    openLightbox(currentActiveIndex);
  }

  function showPrev() {
    updateVisibleItems();
    currentActiveIndex = (currentActiveIndex - 1 + visibleItems.length) % visibleItems.length;
    openLightbox(currentActiveIndex);
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      updateVisibleItems();
      const index = visibleItems.indexOf(item);
      if (index !== -1) {
        openLightbox(index);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  updateVisibleItems();
}

/* ==========================================================================
   5. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up-element');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    elements.forEach(el => el.classList.add('in-view'));
  }
}
