(function () {
  'use strict';

  var FORMSPREE = 'https://formspree.io/f/xnjrnjwy';

  /* ── Toast ── */
  var toast     = document.getElementById('toast');
  var toastMsg  = document.getElementById('toast-message');
  var toastClose = document.getElementById('toast-close');
  var toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMsg) return;
    clearTimeout(toastTimer);
    toast.hidden = false;
    toast.classList.remove('toast-visible');
    void toast.offsetWidth;
    toastMsg.textContent = message;
    toast.classList.add('toast-visible');
    toastTimer = setTimeout(hideToast, 4000);
  }

  function hideToast() {
    if (!toast) return;
    toast.classList.remove('toast-visible');
    setTimeout(function () { toast.hidden = true; }, 400);
  }

  if (toastClose) {
    toastClose.addEventListener('click', hideToast);
  }

  /* ── Helpers ── */
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function shakeField(el) {
    el.classList.remove('shake-anim');
    void el.offsetWidth;
    el.classList.add('shake-anim');
    el.style.borderColor = '#ee0055';
    setTimeout(function () {
      el.style.borderColor = '';
      el.classList.remove('shake-anim');
    }, 600);
  }

  function setLoading(btn, loading) {
    btn.disabled = loading;
    btn.style.opacity = loading ? '0.6' : '';
    btn.textContent   = loading ? 'Sending…' : btn.dataset.label;
  }

  /* ── Hero form (email only) ── */
  var heroForm  = document.getElementById('hero-form');
  var heroEmail = document.getElementById('hero-email');

  if (heroForm && heroEmail) {
    var heroBtn = heroForm.querySelector('button[type="submit"]');
    if (heroBtn) heroBtn.dataset.label = heroBtn.textContent;

    heroForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!isValidEmail(heroEmail.value)) {
        shakeField(heroEmail);
        heroEmail.focus();
        return;
      }

      setLoading(heroBtn, true);

      fetch(FORMSPREE, {
        method  : 'POST',
        headers : { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body    : JSON.stringify({
          email   : heroEmail.value.trim(),
          _subject: 'Collaboration request — EpicSurfaceFlow'
        })
      })
      .then(function (res) {
        setLoading(heroBtn, false);
        if (res.ok) {
          heroEmail.value = '';
          showToast("Message received! We'll get back to you within 24 hours.");
        } else {
          showToast('Something went wrong. Email us at contact@epicsurfaceflow.com');
        }
      })
      .catch(function () {
        setLoading(heroBtn, false);
        showToast('No connection. Email us at contact@epicsurfaceflow.com');
      });
    });
  }

  /* ── CTA form (name + email + message) ── */
  var ctaForm    = document.getElementById('cta-form');
  var ctaName    = document.getElementById('cta-name');
  var ctaEmail   = document.getElementById('cta-email');
  var ctaMessage = document.getElementById('cta-message');

  if (ctaForm) {
    var ctaBtn = ctaForm.querySelector('button[type="submit"]');
    if (ctaBtn) ctaBtn.dataset.label = ctaBtn.textContent;

    ctaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      if (!ctaName || !ctaName.value.trim())          { if (ctaName)    shakeField(ctaName);    valid = false; }
      if (!ctaEmail || !isValidEmail(ctaEmail.value)) { if (ctaEmail)   shakeField(ctaEmail);   valid = false; }
      if (!ctaMessage || !ctaMessage.value.trim())    { if (ctaMessage) shakeField(ctaMessage); valid = false; }

      if (!valid) return;

      setLoading(ctaBtn, true);

      fetch(FORMSPREE, {
        method  : 'POST',
        headers : { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body    : JSON.stringify({
          name    : ctaName.value.trim(),
          email   : ctaEmail.value.trim(),
          message : ctaMessage.value.trim(),
          _subject: 'New proposal — EpicSurfaceFlow'
        })
      })
      .then(function (res) {
        setLoading(ctaBtn, false);
        if (res.ok) {
          ctaName.value    = '';
          ctaEmail.value   = '';
          ctaMessage.value = '';
          showToast("Proposal received! We'll review your message shortly.");
        } else {
          showToast('Something went wrong. Email us at contact@epicsurfaceflow.com');
        }
      })
      .catch(function () {
        setLoading(ctaBtn, false);
        showToast('No connection. Email us at contact@epicsurfaceflow.com');
      });
    });
  }

  /* ── Pricing buttons → scroll to contact ── */
  document.querySelectorAll('.pricing-cta').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.querySelector(btn.dataset.target || '#contact');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

})();
