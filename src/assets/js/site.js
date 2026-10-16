// bitLabs : menu mobile, en-tête au défilement, formulaire de contact,
// consentement aux cookies et chargement de Google Analytics après accord.

(function () {
  'use strict';

  // En-tête : bordure dès que la page défile
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Menu mobile
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var label = toggle.querySelector('.nav-toggle-label');
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      label.textContent = open ? toggle.dataset.labelClose : toggle.dataset.labelOpen;
    };
    toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (event) { if (event.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
  }

  // Formulaire de contact
  var form = document.getElementById('contact-form');
  if (form) {
    var status = form.querySelector('.form-status');
    var submit = form.querySelector('[type="submit"]');
    var showStatus = function (state, message) {
      status.hidden = false;
      status.dataset.state = state;
      status.textContent = message;
    };

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form);
      if (data.get('botcheck')) return;

      var endpoint = form.dataset.endpoint;
      if (!endpoint) {
        // Pas de service branché : on ouvre la messagerie du visiteur avec le message pré-rempli.
        var subject = data.get('subject') + (data.get('company') ? ' · ' + data.get('company') : '');
        var lines = [
          data.get('message'),
          '',
          '—',
          data.get('name'),
          data.get('company'),
          data.get('email'),
          data.get('phone'),
        ].filter(function (line, index) { return index < 3 || line; });
        window.location.href = 'mailto:' + form.dataset.email +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(lines.join('\n'));
        showStatus('info', form.dataset.msgMailto);
        return;
      }

      submit.disabled = true;
      showStatus('info', form.dataset.msgSending);
      fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (response) {
          if (!response.ok) throw new Error(String(response.status));
          form.reset();
          showStatus('success', form.dataset.msgSuccess);
        })
        .catch(function () { showStatus('error', form.dataset.msgError); })
        .then(function () { submit.disabled = false; });
    });
  }

  // Consentement aux cookies (uniquement si un identifiant Google Analytics est configuré)
  var gaId = document.body.dataset.gaId;
  var banner = document.getElementById('cookie-banner');
  if (!gaId || !banner) return;

  var KEY = 'bitlabs-consent';
  var SIX_MONTHS = 182 * 24 * 60 * 60 * 1000;

  var readConsent = function () {
    try {
      var stored = JSON.parse(localStorage.getItem(KEY));
      if (stored && Date.now() - stored.date < SIX_MONTHS) return stored.value;
    } catch (e) { /* stockage indisponible : on redemandera */ }
    return null;
  };
  var saveConsent = function (value) {
    try { localStorage.setItem(KEY, JSON.stringify({ value: value, date: Date.now() })); } catch (e) { /* ignoré */ }
  };

  var loadAnalytics = function () {
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // 13 mois maximum, conformément aux recommandations de la CNIL.
    window.gtag('config', gaId, { cookie_expires: 13 * 30 * 24 * 60 * 60 });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
    document.head.appendChild(script);
  };

  var clearAnalyticsCookies = function () {
    var host = location.hostname;
    var domains = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    document.cookie.split(';').forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();
      if (name.indexOf('_ga') !== 0) return;
      domains.forEach(function (domain) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (domain ? '; domain=' + domain : '');
      });
    });
  };

  var showBanner = function () {
    banner.hidden = false;
    var first = banner.querySelector('button');
    if (first) first.focus({ preventScroll: true });
  };

  banner.addEventListener('click', function (event) {
    var button = event.target.closest('[data-consent]');
    if (!button) return;
    var value = button.dataset.consent;
    var wasAccepted = readConsent() === 'accepted';
    saveConsent(value);
    banner.hidden = true;
    if (value === 'accepted') loadAnalytics();
    else if (wasAccepted) { clearAnalyticsCookies(); location.reload(); }
  });

  document.querySelectorAll('[data-cookie-settings]').forEach(function (button) {
    button.addEventListener('click', showBanner);
  });

  var consent = readConsent();
  if (consent === 'accepted') loadAnalytics();
  else if (consent === null) banner.hidden = false;
})();
