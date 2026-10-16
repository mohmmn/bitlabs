// Génère le site statique dans dist/ à partir de src/ et de site.config.mjs.
// Usage : node build.mjs
//
// Marqueurs disponibles dans les pages et les blocs (src/partials) :
//   {{company.siren}}      valeur de la configuration, échappée (vide → « [À compléter] »)
//   {{{form.hiddenInputs}}} valeur insérée telle quelle (HTML)
//   {{link:contact}}       adresse de la page dans la langue courante (accepte #ancre)
//   {{> nom}}              insère src/partials/<langue>/nom.html, sinon src/partials/nom.html
//   <!-- if:cle --> … <!-- endif -->     garde le bloc si la valeur est renseignée
//   <!-- ifnot:cle --> … <!-- endif -->  garde le bloc si la valeur est vide
// Les blocs conditionnels ne s'imbriquent pas.

import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import config from './site.config.mjs';
import { pages, routes } from './src/pages.mjs';
import { strings } from './src/strings.mjs';
import { escapeHtml, renderLayout } from './src/layout.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(root, 'src');
const DIST = path.join(root, 'dist');

const missing = new Set();

function phoneHref(phone) {
  const digits = phone.replace(/[^\d+]/g, '');
  if (!digits) return '';
  if (digits.startsWith('+')) return `tel:${digits}`;
  if (digits.startsWith('0') && digits.length === 10) return `tel:+33${digits.slice(1)}`;
  return `tel:${digits}`;
}

function buildData() {
  const { company, contact, form } = config;
  const hiddenInputs = Object.entries(form.hiddenFields || {})
    .map(([name, value]) => `<input type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(value)}">`)
    .join('\n');
  return {
    ...config,
    year: String(new Date().getFullYear()),
    company: {
      ...company,
      address: `${company.street}, ${company.postalCode} ${company.city}`,
    },
    contact: { ...contact, phoneHref: phoneHref(contact.phone) },
    form: { ...form, hiddenInputs },
  };
}

function lookup(data, key) {
  return key.split('.').reduce((obj, part) => (obj == null ? undefined : obj[part]), data);
}

async function readPartial(name, lang) {
  for (const file of [path.join(SRC, 'partials', lang, `${name}.html`), path.join(SRC, 'partials', `${name}.html`)]) {
    if (existsSync(file)) return readFile(file, 'utf8');
  }
  throw new Error(`Bloc introuvable : {{> ${name}}} (${lang})`);
}

async function expandIncludes(template, lang, depth = 0) {
  if (depth > 5) throw new Error('Trop de niveaux de blocs imbriqués');
  const pattern = /\{\{>\s*([\w-]+)\s*\}\}/g;
  const names = [...new Set([...template.matchAll(pattern)].map((m) => m[1]))];
  for (const name of names) {
    const partial = await expandIncludes(await readPartial(name, lang), lang, depth + 1);
    template = template.replaceAll(new RegExp(`\\{\\{>\\s*${name}\\s*\\}\\}`, 'g'), partial.trim());
  }
  return template;
}

async function fill(template, { lang, data, source }) {
  const todo = `<span class="todo">${strings[lang].todo}</span>`;
  let out = await expandIncludes(template, lang);

  out = out.replace(/<!--\s*(if|ifnot):([\w.]+)\s*-->([\s\S]*?)<!--\s*endif\s*-->/g, (_, kind, key, block) => {
    const value = lookup(data, key);
    if (value === undefined) throw new Error(`${source} : clé inconnue « ${key} »`);
    return Boolean(value) === (kind === 'if') ? block : '';
  });

  out = out.replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (_, key) => {
    const value = lookup(data, key);
    if (value === undefined) throw new Error(`${source} : clé inconnue « ${key} »`);
    return String(value);
  });

  out = out.replace(/\{\{\s*link:([\w-]+)(#[\w-]+)?\s*\}\}/g, (_, id, hash = '') => {
    if (!routes[id]) throw new Error(`${source} : page inconnue « ${id} »`);
    return routes[id][lang] + hash;
  });

  out = out.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
    const value = lookup(data, key);
    if (value === undefined) throw new Error(`${source} : clé inconnue « ${key} »`);
    if (value === '') {
      missing.add(key);
      return todo;
    }
    return escapeHtml(value);
  });

  return out;
}

const shortHash = (content) => createHash('sha256').update(content).digest('hex').slice(0, 10);

function sitemap(data) {
  const ids = Object.keys(routes);
  const entries = ids.flatMap((id) =>
    ['fr', 'en'].map(
      (lang) => `  <url>
    <loc>${data.url}${routes[id][lang]}</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${data.url}${routes[id].fr}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${data.url}${routes[id].en}"/>
  </url>`,
    ),
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
}

async function build() {
  const data = buildData();
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  await cp(path.join(SRC, 'assets'), path.join(DIST, 'assets'), { recursive: true });
  await cp(path.join(SRC, 'static'), DIST, { recursive: true });

  const assets = {
    css: shortHash(await readFile(path.join(SRC, 'assets/css/site.css'))),
    js: shortHash(await readFile(path.join(SRC, 'assets/js/site.js'))),
  };

  for (const page of pages) {
    const source = `src/pages/${page.file}`;
    const raw = await readFile(path.join(SRC, 'pages', page.file), 'utf8');
    const body = await fill(raw, { lang: page.lang, data, source });
    const html = renderLayout({ page, body, data, assets });
    const outPath = page.out ? path.join(DIST, page.out) : path.join(DIST, routes[page.id][page.lang], 'index.html');
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, html);
  }

  await writeFile(path.join(DIST, 'sitemap.xml'), sitemap(data));
  await writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${data.url}/sitemap.xml\n`);

  console.log(`Site généré dans dist/ (${pages.length} pages).`);
  if (missing.size) {
    console.log('\nÀ compléter dans site.config.mjs avant la mise en ligne :');
    for (const key of [...missing].sort()) console.log(`  - ${key}`);
  }
  if (!config.form.endpoint) console.log('\nFormulaire : aucun service branché, l\'envoi ouvre la messagerie du visiteur.');
  if (!config.analytics.gaId) console.log('Google Analytics : désactivé (analytics.gaId vide), aucun cookie déposé.');
}

build().catch((error) => {
  console.error(`\nÉchec du build : ${error.message}`);
  process.exit(1);
});
