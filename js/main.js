/* DCR — Domingues Construction Rénovation
   Interactions du site vitrine (aucune dépendance). */
(function () {
  'use strict';

  var EASE = 'cubic-bezier(.2,.7,.1,1)';
  var HEADER_H = 68;

  function motionOn() {
    try { return !window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return true; }
  }

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- Menu mobile ---------- */

  var menu = $('#menu-mobile');
  var menuBtn = $('[data-menu-open]');

  function openMenu() {
    menu.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    $('[data-menu-close]', menu).focus();
  }

  function closeMenu(returnFocus) {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    if (returnFocus) menuBtn.focus();
  }

  if (menu && menuBtn) {
    menuBtn.addEventListener('click', openMenu);
    $('[data-menu-close]', menu).addEventListener('click', function () { closeMenu(true); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(true); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1040) closeMenu(false); });
  }

  /* ---------- Navigation interne ---------- */

  function scrollToId(id) {
    if (!id || id === 'top') { window.scrollTo({ top: 0, behavior: motionOn() ? 'smooth' : 'auto' }); return; }
    var el = document.getElementById(id);
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.scrollY - HEADER_H;
    window.scrollTo({ top: Math.max(0, y), behavior: motionOn() ? 'smooth' : 'auto' });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains('skip-link')) return;
    var id = a.getAttribute('href').slice(1);
    if (a.hasAttribute('data-type')) pickService(a.getAttribute('data-type'));
    e.preventDefault();
    closeMenu(false);
    scrollToId(id);
    if (history.replaceState) history.replaceState(null, '', id && id !== 'top' ? '#' + id : location.pathname);
  });

  /* ---------- Statut ouvert / fermé (heure de Paris) ---------- */

  function getStatus() {
    var day, h;
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
      var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
      day = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[get('weekday')];
      h = Number(get('hour')) + Number(get('minute')) / 60;
    } catch (err) {
      var d = new Date();
      day = d.getDay();
      h = d.getHours() + d.getMinutes() / 60;
    }
    var weekday = day >= 1 && day <= 5;
    if (weekday && h >= 8 && h < 20) return { open: true, label: 'Ouvert — ferme à 20 h' };
    if (weekday && h < 8) return { open: false, label: 'Fermé — ouvre à 8 h' };
    if (day >= 1 && day <= 4) return { open: false, label: 'Fermé — ouvre demain à 8 h' };
    return { open: false, label: 'Fermé — ouvre lundi à 8 h' };
  }

  function renderStatus() {
    var st = getStatus();
    $$('[data-status]').forEach(function (el) {
      el.classList.toggle('is-open', st.open);
      var label = $('[data-status-label]', el);
      if (label) label.textContent = st.label;
    });
  }

  renderStatus();
  setInterval(renderStatus, 30000);

  /* ---------- Animation d’entrée de l’accueil ---------- */

  function intro() {
    var hero = $('[data-hero]');
    if (!hero || !hero.animate || !motionOn()) return;
    $$('[data-line]', hero).forEach(function (el, i) {
      el.animate([{ transform: 'translateY(105%)' }, { transform: 'translateY(0)' }], { duration: 1200, delay: 100 + i * 160, easing: EASE, fill: 'backwards' });
    });
    $$('[data-fade]', hero).forEach(function (el, i) {
      el.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 1000, delay: 520 + i * 140, easing: EASE, fill: 'backwards' });
    });
    $$('[data-wipe]', hero).forEach(function (el) {
      el.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }], { duration: 1500, delay: 380, easing: EASE, fill: 'backwards' });
    });
  }

  /* ---------- Apparition au défilement ---------- */

  function setupReveal() {
    if (!motionOn() || !('IntersectionObserver' in window)) return;
    var vh = window.innerHeight || 800;
    var pending = $$('[data-reveal], .section-head').filter(function (el) { return el.getBoundingClientRect().top >= vh * 0.92; });
    pending.forEach(function (el) { el.classList.add('is-pending'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        el.style.transitionDelay = (el.getAttribute('data-delay') || 0) + 'ms';
        el.classList.remove('is-pending');
        el.addEventListener('transitionend', function done() {
          el.style.transitionDelay = '';
          el.removeEventListener('transitionend', done);
        });
      });
    }, { rootMargin: '0px 0px -6% 0px' });

    pending.forEach(function (el) { io.observe(el); });
    window.addEventListener('beforeprint', function () {
      pending.forEach(function (el) { el.classList.remove('is-pending'); });
    });
  }

  requestAnimationFrame(function () { intro(); setupReveal(); });

  /* ---------- Section en cours soulignée dans la navigation ---------- */

  var navLinks = $$('.main-nav a[href^="#"]');
  var spySections = navLinks.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  var spyTicking = false;

  function updateSpy() {
    spyTicking = false;
    var line = window.innerHeight * 0.4;
    var current = -1;
    spySections.forEach(function (s, i) {
      if (!s) return;
      var r = s.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) current = i;
    });
    navLinks.forEach(function (a, i) {
      if (i === current) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  if (navLinks.length) {
    window.addEventListener('scroll', function () {
      if (!spyTicking) { spyTicking = true; requestAnimationFrame(updateSpy); }
    }, { passive: true });
    updateSpy();
  }

  /* ---------- Avant / Après ---------- */

  var ba = $('[data-ba]');
  if (ba) {
    var clip = $('[data-ba-clip]', ba);
    var handle = $('[data-ba-handle]', ba);
    var knob = $('[role="slider"]', handle);
    var imgBefore = $('[data-ba-before]', ba);
    var imgAfter = $('[data-ba-after]', ba);
    var title = $('[data-ba-title]');
    var text = $('[data-ba-text]');
    var tablist = $('[data-ba-tabs]');
    var tabs = $$('[role="tab"]', tablist);
    var baPos = 50;
    var dragging = false;

    var setBaPos = function (p) {
      baPos = p;
      clip.style.clipPath = 'inset(0 ' + (100 - p).toFixed(2) + '% 0 0)';
      handle.style.left = p.toFixed(2) + '%';
      knob.setAttribute('aria-valuenow', String(Math.round(p)));
    };

    var baDown = function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      dragging = true;
      knob.focus({ preventScroll: true });
      var move = function (ev) {
        var r = ba.getBoundingClientRect();
        setBaPos(Math.min(98, Math.max(2, ((ev.clientX - r.left) / r.width) * 100)));
      };
      var up = function () {
        dragging = false;
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
      move(e);
    };

    $$('[data-ba-drag]', ba).forEach(function (el) { el.addEventListener('pointerdown', baDown); });

    knob.addEventListener('keydown', function (e) {
      var step = e.shiftKey ? 10 : 4;
      if (e.key === 'ArrowLeft') { e.preventDefault(); setBaPos(Math.max(2, baPos - step)); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setBaPos(Math.min(98, baPos + step)); }
      if (e.key === 'Home') { e.preventDefault(); setBaPos(2); }
      if (e.key === 'End') { e.preventDefault(); setBaPos(98); }
    });

    // Un seul chantier : pas besoin d’onglets.
    if (tabs.length < 2) tablist.hidden = true;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.setAttribute('aria-selected', t === tab ? 'true' : 'false'); });
        imgBefore.src = tab.getAttribute('data-before');
        imgAfter.src = tab.getAttribute('data-after');
        title.textContent = tab.getAttribute('data-title');
        text.textContent = tab.getAttribute('data-text');
        setBaPos(50);
      });
    });

    // Petit va-et-vient du curseur à la première apparition, pour montrer qu’il se déplace.
    var wiggle = function () {
      var keys = [[0, 50], [700, 32], [1450, 66], [2050, 50]];
      var t0 = performance.now();
      var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
      var step = function (now) {
        if (dragging) return;
        var t = now - t0;
        var i = 0;
        while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
        var k = Math.min(1, Math.max(0, (t - keys[i][0]) / (keys[i + 1][0] - keys[i][0])));
        setBaPos(keys[i][1] + (keys[i + 1][1] - keys[i][1]) * ease(k));
        if (t < keys[keys.length - 1][0]) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      var baIo = new IntersectionObserver(function (entries) {
        if (entries.some(function (x) { return x.isIntersecting; })) {
          baIo.disconnect();
          if (motionOn()) setTimeout(wiggle, 500);
        }
      }, { threshold: 0.35 });
      baIo.observe(ba);
    }
  }

  /* ---------- Avis clients ---------- */

  var quotesBox = $('[data-quotes]');
  var quotes = quotesBox ? $$('.quote', quotesBox) : [];
  var quoteIndex = 0;
  var bars = [];

  function pad(n) { return String(n).padStart(2, '0'); }

  function showQuote(i, animate) {
    if (!quotes.length) return;
    quoteIndex = ((i % quotes.length) + quotes.length) % quotes.length;
    quotes.forEach(function (q, j) { q.hidden = j !== quoteIndex; });
    bars.forEach(function (b, j) { b.setAttribute('aria-current', j === quoteIndex ? 'true' : 'false'); });
    $('[data-quote-num]', quotesBox).textContent = pad(quoteIndex + 1);
    var q = quotes[quoteIndex];
    if (animate && q.animate && motionOn()) {
      q.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 650, easing: EASE });
    }
  }

  if (quotesBox) {
    var barsBox = $('[data-quote-bars]', quotesBox);
    quotes.forEach(function (q, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'quotes__bar';
      b.setAttribute('aria-label', 'Afficher l’avis ' + (i + 1));
      b.addEventListener('click', function () { showQuote(i, true); });
      barsBox.appendChild(b);
      bars.push(b);
    });
    $('[data-quote-total]', quotesBox).textContent = pad(quotes.length);
    $('[data-quote-prev]', quotesBox).addEventListener('click', function () { showQuote(quoteIndex - 1, true); });
    $('[data-quote-next]', quotesBox).addEventListener('click', function () { showQuote(quoteIndex + 1, true); });
    showQuote(0, false);
  }

  /* ---------- Demande de devis ---------- */

  var form = $('[data-quote-form]');
  var sentBox = $('[data-form-sent]');
  var errorBox = $('[data-form-error]');
  var typesInput = $('[data-types-input]');
  var chips = $$('[data-chips] .chip');
  var types = [];

  function renderChips() {
    chips.forEach(function (c) {
      c.setAttribute('aria-pressed', types.indexOf(c.getAttribute('data-type')) >= 0 ? 'true' : 'false');
    });
    if (typesInput) typesInput.value = types.join(', ');
  }

  function showError(msg) { errorBox.textContent = msg; errorBox.hidden = false; }
  function hideError() { errorBox.textContent = ''; errorBox.hidden = true; }

  function showForm() {
    if (!form) return;
    form.hidden = false;
    sentBox.hidden = true;
  }

  function pickService(t) {
    if (types.indexOf(t) < 0) types.push(t);
    renderChips();
    showForm();
  }

  if (form) {
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var t = c.getAttribute('data-type');
        types = types.indexOf(t) >= 0 ? types.filter(function (x) { return x !== t; }) : types.concat([t]);
        renderChips();
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var name = String(fd.get('nom') || '').trim();
      var digits = String(fd.get('telephone') || '').replace(/\D/g, '');
      if (!name || digits.length < 9) {
        showError('Merci d’indiquer votre nom et un numéro de téléphone valide.');
        return;
      }
      hideError();
      var btn = $('[type="submit"]', form);
      var btnLabel = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = 'Envoi en cours…';
      fetch(form.getAttribute('action') || '/', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(fd).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        $('[data-sent-name]', sentBox).textContent = name.split(/\s+/)[0];
        form.hidden = true;
        sentBox.hidden = false;
      }).catch(function () {
        showError('L’envoi n’a pas abouti. Appelez-nous directement au 06 69 97 77 27, du lundi au vendredi de 8 h à 20 h.');
      }).then(function () {
        btn.disabled = false;
        btn.innerHTML = btnLabel;
      });
    });

    $('[data-form-reset]', sentBox).addEventListener('click', function () {
      form.reset();
      types = [];
      renderChips();
      hideError();
      showForm();
    });
  }

  /* ---------- Signature « Domingues » à pleine largeur ---------- */

  var word = $('[data-fit-word]');
  function fitWord() {
    if (!word || !word.parentElement) return;
    var avail = word.parentElement.clientWidth;
    if (!avail) return;
    word.style.fontSize = '100px';
    var w = word.getBoundingClientRect().width;
    if (w) word.style.fontSize = (100 * avail / w * 0.995).toFixed(2) + 'px';
  }
  window.addEventListener('resize', fitWord);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWord);
  fitWord();
})();
