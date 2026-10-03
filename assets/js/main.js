(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  // ---------- Theme toggle ----------
  var toggle = document.querySelector('.theme-toggle');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    return root.dataset.theme || (systemDark.matches ? 'dark' : 'light');
  }

  function updateToggleLabel() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }

  toggle.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
    updateToggleLabel();
  });
  systemDark.addEventListener('change', updateToggleLabel);
  updateToggleLabel();

  // ---------- Navigation border once the page is scrolled ----------
  var nav = document.querySelector('.nav');
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Project filters ----------
  var chips = document.querySelectorAll('.chip');
  var cards = document.querySelectorAll('#project-grid .card');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.dataset.filter;
      chips.forEach(function (other) { other.setAttribute('aria-pressed', String(other === chip)); });
      cards.forEach(function (card) {
        var categories = card.dataset.category.split(' ');
        card.hidden = filter !== 'all' && categories.indexOf(filter) === -1;
        if (!card.hidden) card.classList.add('is-visible');
      });
    });
  });

  // ---------- Reveal sections on scroll ----------
  var revealed = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0 });
    revealed.forEach(function (el) { observer.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- Footer year ----------
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
