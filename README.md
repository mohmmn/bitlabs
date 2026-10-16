# Site bitLabs

Site vitrine de **BITLABS SAS** (bitlabs.fr), en français et en anglais.
Site statique sans aucune dépendance : un petit script Node assemble les pages dans `dist/`.

## Commandes

| Commande | Effet |
|---|---|
| `npm run dev` | Génère le site et l'affiche sur http://localhost:4321 |
| `npm run build` | Génère le site dans `dist/` et liste les informations encore à compléter |
| `npm run serve` | Affiche `dist/` sans régénérer |

Node 20 ou plus récent est nécessaire.

## Organisation

```
site.config.mjs        Informations légales, contact, formulaire, Google Analytics
build.mjs              Générateur du site (src/ → dist/)
serve.mjs              Serveur d'aperçu local
src/
  pages.mjs            Plan du site : adresses FR/EN, titres et descriptions
  strings.mjs          Textes communs (menu, pied de page, bandeau cookies)
  layout.mjs           Gabarit commun (<head>, en-tête, pied de page)
  pages/fr, pages/en   Contenu de chaque page
  partials/            Blocs réutilisés (méthode, appel à l'action, icônes, illustration)
  assets/              CSS, JS, polices IBM Plex, logos et favicons
  static/              Fichiers copiés tels quels à la racine (.htaccess)
```

## Modifier le contenu

- **Informations légales et contact** : uniquement dans `site.config.mjs`. Toutes les pages s'y réfèrent.
  Une valeur vide s'affiche « [À compléter] » sur le site et apparaît dans la sortie du build.
- **Textes** : dans `src/pages/fr/…` et `src/pages/en/…`. Pensez à modifier les deux langues.
- **Titres et descriptions des pages (SEO)** : dans `src/pages.mjs`.

Marqueurs utilisables dans les pages :

| Marqueur | Résultat |
|---|---|
| `{{company.siren}}` | Valeur de `site.config.mjs` |
| `{{link:contact}}`, `{{link:services#conseil}}` | Adresse de la page dans la langue courante |
| `{{> cta}}` | Insère `src/partials/<langue>/cta.html` (ou `src/partials/cta.html`) |
| `<!-- if:analytics.gaId --> … <!-- endif -->` | Bloc affiché seulement si la valeur est renseignée (`ifnot:` pour l'inverse) |

## Avant la mise en ligne

- [x] Acheter `bitlabs.fr`, avec **BITLABS SAS** comme titulaire
- [x] Créer la boîte `contact@bitlabs.fr` (déjà affichée sur le site : elle doit exister avant la mise en ligne)
- [x] Compléter les mentions légales dans `site.config.mjs` (capital, téléphone, directeur de la publication, hébergeur Hostinger)
- [ ] Brancher le formulaire (`form.provider`, `form.endpoint`, `form.hiddenFields`). Sans service branché, l'envoi ouvre la messagerie du visiteur avec le message pré-rempli.
- [ ] Google Analytics : créer une propriété GA4, renseigner `analytics.gaId`, puis régler la conservation des données sur **14 mois** (Administration › Collecte et conservation des données › Conservation des données). Le bandeau de consentement et la section cookies de la politique de confidentialité s'activent automatiquement.
- [ ] Lancer `npm run build` et vérifier qu'il ne reste rien « à compléter »

## Déploiement

### GitHub Pages (hébergement actuel)

Chaque push sur `main` génère le site et le publie (`.github/workflows/deploy.yml`).
Le domaine bitlabs.fr est déclaré dans Settings › Pages du dépôt. Les DNS, gérés chez Hostinger, pointent vers GitHub :

| Type | Nom | Valeur |
|---|---|---|
| A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (4 enregistrements) |
| AAAA | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` (4 enregistrements) |
| CNAME | `www` | `mohmmn.github.io` |

Une fois les DNS en place, cocher **Enforce HTTPS** dans Settings › Pages.

### Hostinger (ou tout hébergement Apache/LiteSpeed)

1. `npm run build`
2. Dans hPanel › Gestionnaire de fichiers, envoyer **le contenu** de `dist/` dans `public_html/`, y compris le fichier caché `.htaccess`.
3. Activer le certificat SSL, puis **Forcer HTTPS** (hPanel › Sécurité › SSL).

### Cloudflare Pages

Relier le dépôt GitHub, puis : commande de build `node build.mjs`, dossier de sortie `dist`. HTTPS et la page 404 sont gérés automatiquement.
