// Plan du site : chaque page existe en français et en anglais.
// Dans les contenus, {{link:id}} renvoie l'adresse de la page dans la langue courante.

export const routes = {
  home: { fr: '/', en: '/en/' },
  services: { fr: '/services/', en: '/en/services/' },
  about: { fr: '/a-propos/', en: '/en/about/' },
  contact: { fr: '/contact/', en: '/en/contact/' },
  legal: { fr: '/mentions-legales/', en: '/en/legal-notice/' },
  privacy: { fr: '/confidentialite/', en: '/en/privacy/' },
};

export const pages = [
  {
    id: 'home',
    lang: 'fr',
    file: 'fr/accueil.html',
    title: 'bitLabs · Conseil et développement web et mobile',
    description:
      "bitLabs conçoit et développe les applications web et mobiles des entreprises : conseil, ingénierie, développement, gestion de projet et conception de systèmes d'information.",
  },
  {
    id: 'home',
    lang: 'en',
    file: 'en/home.html',
    title: 'bitLabs · Web and mobile software consulting and development',
    description:
      'bitLabs designs and builds web and mobile applications for businesses: IT consulting, engineering, software development, project management and information systems design.',
  },
  {
    id: 'services',
    lang: 'fr',
    file: 'fr/services.html',
    title: 'Services · bitLabs',
    description:
      "Conseil en technologies de l'information, ingénierie informatique, développement de logiciels, gestion de projets et conception de systèmes d'information.",
  },
  {
    id: 'services',
    lang: 'en',
    file: 'en/services.html',
    title: 'Services · bitLabs',
    description:
      'IT consulting, software engineering services, software development, IT project management and information systems analysis and design.',
  },
  {
    id: 'about',
    lang: 'fr',
    file: 'fr/a-propos.html',
    title: 'À propos · bitLabs',
    description:
      'BITLABS est une société française de conseil et de développement logiciel, basée à Villejuif. Nous accompagnons les entreprises et développons nos propres applications.',
  },
  {
    id: 'about',
    lang: 'en',
    file: 'en/about.html',
    title: 'About · bitLabs',
    description:
      'BITLABS is a French software consulting and development company based in Villejuif. We work with businesses and build our own applications.',
  },
  {
    id: 'contact',
    lang: 'fr',
    file: 'fr/contact.html',
    title: 'Contact · bitLabs',
    description:
      'Présentez-nous votre projet. Nous revenons vers vous par e-mail ou par téléphone, puis nous vous adressons un devis.',
  },
  {
    id: 'contact',
    lang: 'en',
    file: 'en/contact.html',
    title: 'Contact · bitLabs',
    description:
      'Tell us about your project. We get back to you by email or phone, then send you a quote.',
  },
  {
    id: 'legal',
    lang: 'fr',
    file: 'fr/mentions-legales.html',
    title: 'Mentions légales · bitLabs',
    description: 'Mentions légales du site bitLabs, édité par BITLABS SAS.',
  },
  {
    id: 'legal',
    lang: 'en',
    file: 'en/legal-notice.html',
    title: 'Legal notice · bitLabs',
    description: 'Legal notice for the bitLabs website, published by BITLABS SAS.',
  },
  {
    id: 'privacy',
    lang: 'fr',
    file: 'fr/confidentialite.html',
    title: 'Politique de confidentialité · bitLabs',
    description: 'Comment BITLABS collecte et utilise vos données personnelles, et comment exercer vos droits.',
  },
  {
    id: 'privacy',
    lang: 'en',
    file: 'en/privacy.html',
    title: 'Privacy policy · bitLabs',
    description: 'How BITLABS collects and uses your personal data, and how to exercise your rights.',
  },
  {
    id: 'notfound',
    lang: 'fr',
    file: 'fr/404.html',
    out: '404.html',
    noindex: true,
    title: 'Page introuvable · bitLabs',
    description: "Cette page n'existe pas ou a été déplacée.",
  },
];
