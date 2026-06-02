(function () {
  'use strict';

  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      progressBar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
    }, { passive: true });
  }

  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [];

  navLinks.forEach(function (link) {
    const id = link.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (section) sections.push({ link: link, section: section });
  });

  if (sections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(function (item) {
      navObserver.observe(item.section);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', function () {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      faqItems.forEach(function (other) {
        const otherBtn = other.querySelector('.faq-question');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherBtn && otherAnswer) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.style.maxHeight = '0';
        }
      });

      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxTitle = lightbox && lightbox.querySelector('.lightbox-title');
  const lightboxViews = lightbox && lightbox.querySelector('.lightbox-views');
  const lightboxEra = lightbox && lightbox.querySelector('.lightbox-era');
  const lightboxTag = lightbox && lightbox.querySelector('.lightbox-tag');
  const lightboxClose = lightbox && lightbox.querySelector('.lightbox-close');
  const lightboxBackdrop = lightbox && lightbox.querySelector('.lightbox-backdrop');

  function openLightbox(card) {
    if (!lightbox) return;
    lightboxTitle.textContent = card.dataset.title || '';
    lightboxViews.textContent = card.dataset.views || '';
    lightboxEra.textContent = card.dataset.era || '';
    lightboxTag.textContent = card.dataset.tag || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.portfolio-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openLightbox(card);
    });
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(card);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', closeLightbox);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });

  /* ── Castle 3D parallax ── */
  var castleImg = document.getElementById('castle-img');

  if (castleImg) {
    var castleScrollY  = 0;
    var castleMouseX   = 0;
    var castleMouseY   = 0;
    var tMouseX        = 0;
    var tMouseY        = 0;
    var castleRafId    = null;

    function maxScrollCastle() {
      return Math.max(1, document.body.scrollHeight - window.innerHeight);
    }

    function lerpC(a, b, t) { return a + (b - a) * t; }

    function updateCastle() {
      var t        = castleScrollY / maxScrollCastle();
      castleMouseX = lerpC(castleMouseX, tMouseX, 0.06);
      castleMouseY = lerpC(castleMouseY, tMouseY, 0.06);

      var rotY   = (t - 0.5) * 48 + castleMouseX * 12;
      var rotX   = castleMouseY * -7;
      var scale  = 1 + t * 0.18;

      castleImg.style.transform =
        'rotateY(' + rotY + 'deg) rotateX(' + rotX + 'deg) scale(' + scale + ')';

      castleRafId = requestAnimationFrame(updateCastle);
    }

    window.addEventListener('scroll', function () {
      castleScrollY = window.scrollY;
    }, { passive: true });

    window.addEventListener('mousemove', function (e) {
      tMouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      tMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    updateCastle();
  }

})();
