/* ============================================================
   ST aluminum — interactions
   Navigation, works lightbox, FAQ, quote form
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Navigation ---------- */
  const head = document.getElementById('siteHead');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const meter = document.getElementById('scrollMeter');

  function closeMenu() {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function () {
    const open = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
  });

  /* ---------- Scroll state: header + progress + active link ---------- */
  const navAnchors = Array.from(navLinks.querySelectorAll('a'));
  const sections = navAnchors
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function onScroll() {
    const y = window.scrollY;
    head.classList.toggle('is-scrolled', y > 8);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    meter.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

    let current = '';
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= 140) current = section.id;
    });
    navAnchors.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-in'); });
  }

  /* ---------- Works lightbox ---------- */
  const works = Array.from(document.querySelectorAll('.work'));
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCap = document.getElementById('lbCap');
  let activeIndex = 0;
  let lastFocused = null;

  function showWork(index) {
    activeIndex = (index + works.length) % works.length;
    const work = works[activeIndex];
    const img = work.querySelector('img');
    lbImage.src = img.src;
    lbImage.alt = img.alt;
    lbCap.textContent = work.dataset.caption || '';
  }

  function openLightbox(index) {
    lastFocused = document.activeElement;
    showWork(index);
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('[data-lb-close]').focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  works.forEach(function (work, index) {
    work.addEventListener('click', function () { openLightbox(index); });
  });

  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeLightbox();
    if (event.target.closest('[data-lb-close]')) closeLightbox();
    const stepBtn = event.target.closest('[data-lb-step]');
    if (stepBtn) showWork(activeIndex + Number(stepBtn.dataset.lbStep));
  });

  document.addEventListener('keydown', function (event) {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') showWork(activeIndex + 1);
    if (event.key === 'ArrowLeft') showWork(activeIndex - 1);
  });

  /* ---------- FAQ accordion ---------- */
  const faqItems = Array.from(document.querySelectorAll('.faq__item'));
  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq__q');
    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Quote form ---------- */
  const form = document.getElementById('quoteForm');
  const status = document.getElementById('formStatus');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const phoneOk = /^[0-9+\-\s()]{8,}$/.test(phone);

    if (!name || !phoneOk) {
      status.style.color = '#B4232A';
      status.textContent = 'กรุณากรอกชื่อและเบอร์โทรศัพท์ให้ครบถ้วน';
      (!name ? form.elements.name : form.elements.phone).focus();
      return;
    }

    status.style.color = '';
    status.textContent = 'ได้รับคำขอแล้ว — ทีมงานจะติดต่อกลับภายใน 1 วันทำการ';
    form.reset();
  });
})();
