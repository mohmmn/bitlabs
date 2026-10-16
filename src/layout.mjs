// Gabarit commun : <head>, en-tête, pied de page et bandeau cookies.

import { routes } from './pages.mjs';
import { strings } from './strings.mjs';

export const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const href = (id, lang, hash = '') => routes[id][lang] + hash;

export function renderLayout({ page, body, data, assets }) {
  const { lang } = page;
  const t = strings[lang];
  const other = lang === 'fr' ? 'en' : 'fr';
  const route = routes[page.id];
  const canonical = route ? data.url + route[lang] : null;
  const altHref = route ? route[other] : routes.home[other];
  const { company, contact, analytics } = data;

  const navItems = t.nav
    .map((item) => {
      const current = !item.hash && item.id === page.id ? ' aria-current="page"' : '';
      return `<li><a href="${href(item.id, lang, item.hash)}"${current}>${item.label}</a></li>`;
    })
    .join('');

  const serviceLinks = t.footer.serviceLinks
    .map((l) => `<li><a href="${href('services', lang, l.hash)}">${l.label}</a></li>`)
    .join('');
  const companyLinks = t.footer.companyLinks
    .map((l) => `<li><a href="${href(l.id, lang, l.hash)}">${l.label}</a></li>`)
    .join('');

  const alternates = route
    ? `
  <link rel="alternate" hreflang="fr" href="${data.url}${route.fr}">
  <link rel="alternate" hreflang="en" href="${data.url}${route.en}">
  <link rel="alternate" hreflang="x-default" href="${data.url}${route.fr}">`
    : '';

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.brand,
    legalName: `${company.legalName} ${company.legalForm}`,
    url: data.url + '/',
    logo: `${data.url}/assets/img/bitlabs-icone-512.png`,
    email: contact.email || undefined,
    telephone: contact.phone || undefined,
    foundingDate: company.founded,
    vatID: company.vat,
    taxID: company.siren.replace(/\s/g, ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.street,
      postalCode: company.postalCode,
      addressLocality: company.city,
      addressCountry: 'FR',
    },
  };

  const cookieBanner = analytics.gaId
    ? `
  <div class="cookie-banner" id="cookie-banner" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-text" hidden>
    <p class="cookie-title" id="cookie-title">${t.cookie.title}</p>
    <p id="cookie-text">${t.cookie.text} <a href="${href('privacy', lang, '#cookies')}">${t.cookie.more}</a></p>
    <div class="cookie-actions">
      <button type="button" class="btn btn-on-dark" data-consent="refused">${t.cookie.refuse}</button>
      <button type="button" class="btn btn-on-dark" data-consent="accepted">${t.cookie.accept}</button>
    </div>
  </div>`
    : '';

  const cookieLink = analytics.gaId
    ? `<li><button type="button" class="link-button" data-cookie-settings>${t.footer.cookies}</button></li>`
    : '';

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  ${page.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}${alternates}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${company.brand}">
  <meta property="og:locale" content="${t.locale}">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  ${canonical ? `<meta property="og:url" content="${canonical}">` : ''}
  <meta property="og:image" content="${data.url}/assets/img/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#FAF7F2">
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/assets/img/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon-180.png">
  <link rel="preload" href="/assets/fonts/ibm-plex-sans-latin-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/site.css?v=${assets.css}">
  <script type="application/ld+json">${JSON.stringify(organization)}</script>
  <script src="/assets/js/site.js?v=${assets.js}" defer></script>
</head>
<body data-lang="${lang}"${analytics.gaId ? ` data-ga-id="${escapeHtml(analytics.gaId)}"` : ''}>
  <a class="skip-link" href="#contenu">${t.skip}</a>

  <header class="site-header" id="site-header">
    <div class="container header-inner">
      <a class="brand" href="${href('home', lang)}" aria-label="${t.homeLabel}">
        <img src="/assets/img/logo-fond-clair.svg" alt="${company.brand}" width="116" height="36">
      </a>
      <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="site-nav" data-label-open="${t.menu}" data-label-close="${t.close}">
        <span class="nav-toggle-bars" aria-hidden="true"></span>
        <span class="nav-toggle-label">${t.menu}</span>
      </button>
      <nav class="site-nav" id="site-nav" aria-label="${t.navLabel}">
        <ul class="nav-links">${navItems}</ul>
        <div class="nav-actions">
          <a class="lang-switch" href="${altHref}" hreflang="${t.langSwitch.lang}" lang="${t.langSwitch.lang}" title="${t.langSwitch.title}">${t.langSwitch.label}</a>
          <a class="btn btn-primary" href="${href('contact', lang)}">${t.cta}</a>
        </div>
      </nav>
    </div>
  </header>

  <main id="contenu">
${body}
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <img src="/assets/img/logo-fond-sombre.svg" alt="${company.brand}" width="129" height="40" loading="lazy">
          <p>${t.footer.tagline}</p>
          <address>${escapeHtml(company.legalName)} ${company.legalForm}<br>${escapeHtml(company.street)}<br>${company.postalCode} ${escapeHtml(company.city)}, ${escapeHtml(company.country)}${contact.email ? `<br><a href="mailto:${contact.email}">${contact.email}</a>` : ''}</address>
        </div>
        <div class="footer-col">
          <p class="footer-heading">${t.footer.services}</p>
          <ul>${serviceLinks}</ul>
        </div>
        <div class="footer-col">
          <p class="footer-heading">${t.footer.company}</p>
          <ul>${companyLinks}</ul>
        </div>
        <div class="footer-col">
          <p class="footer-heading">${t.footer.info}</p>
          <ul>
            <li><a href="${href('legal', lang)}">${t.footer.legal}</a></li>
            <li><a href="${href('privacy', lang)}">${t.footer.privacy}</a></li>
            ${cookieLink}
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© ${data.year} ${escapeHtml(company.legalName)} ${company.legalForm} · ${t.footer.registry} ${company.siren} · ${escapeHtml(company.rcs.replace(/\s[\d\s]+$/, ''))}</p>
        <a class="lang-switch" href="${altHref}" hreflang="${t.langSwitch.lang}" lang="${t.langSwitch.lang}">${t.langSwitch.title}</a>
      </div>
    </div>
  </footer>
${cookieBanner}
</body>
</html>
`;
}
