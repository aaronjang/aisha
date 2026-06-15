/* ============================================================
   AISHA — interactions (restrained, elegant)
   ============================================================ */
(function () {
  'use strict';

  /* ---------- NAV scroll state ---------- */
  var navbar = document.getElementById('navbar');
  function onScrollNav() { navbar.classList.toggle('scrolled', window.scrollY > 50); }
  onScrollNav();

  /* ---------- mobile menu ---------- */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  window.toggleMenu = function () {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  };
  window.closeMenu = function () {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  };

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal, .gold-divider, .section-label');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(function (el) { io.observe(el); });

  /* ---------- count-up for stats ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = (el.getAttribute('data-decimals') | 0);
    var dur = 1500;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val)) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = (decimals ? target.toFixed(decimals) : target) + suffix;
    }
    requestAnimationFrame(step);
  }
  var prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var motionOff = document.documentElement.getAttribute('data-motion') === 'off';
  var statIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var el = e.target;
        if (prefersReduce || document.documentElement.getAttribute('data-motion') === 'off') {
          el.textContent = (el.getAttribute('data-fixed') || el.getAttribute('data-count') + (el.getAttribute('data-suffix') || ''));
        } else {
          animateCount(el);
        }
        statIO.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) { statIO.observe(el); });

  /* ---------- parallax (subtle) ---------- */
  var pEls = document.querySelectorAll('[data-parallax]');
  var ticking = false;
  function applyParallax() {
    var y = window.scrollY;
    pEls.forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax'));
      el.style.transform = 'translate3d(0,' + (y * speed) + 'px,0)';
    });
    ticking = false;
  }
  function requestParallax() {
    if (!ticking && !prefersReduce && document.documentElement.getAttribute('data-motion') !== 'off') {
      window.requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', function () {
    onScrollNav();
    requestParallax();
  }, { passive: true });

  /* ---------- smooth anchor + close menu ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () { window.closeMenu(); });
  });

  /* ---------- contact form: validation + success ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    var success = document.getElementById('formSuccess');
    function setError(group, on) { group.classList.toggle('error', on); }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var valid = true;
      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      var message = form.querySelector('[name="message"]');

      var nameG = name.closest('.form-group');
      var emailG = email.closest('.form-group');
      var msgG = message.closest('.form-group');

      var nameBad = !name.value.trim();
      var emailBad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      var msgBad = !message.value.trim();

      setError(nameG, nameBad);
      setError(emailG, emailBad);
      setError(msgG, msgBad);

      valid = !nameBad && !emailBad && !msgBad;
      if (!valid) {
        var firstBad = form.querySelector('.form-group.error');
        if (firstBad) firstBad.querySelector('input,textarea').focus();
        return;
      }
      success.classList.add('show');
    });

    form.querySelectorAll('input, textarea, select').forEach(function (f) {
      f.addEventListener('input', function () {
        var g = f.closest('.form-group');
        if (g) g.classList.remove('error');
      });
    });

    window.resetForm = function () {
      form.reset();
      document.getElementById('formSuccess').classList.remove('show');
    };
  }
})();
