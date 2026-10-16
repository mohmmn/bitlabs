// Configuration centrale du site bitLabs.
// Toutes les informations légales et de contact sont ici : les pages les lisent
// via des marqueurs {{...}}. Une valeur vide s'affiche « [À compléter] » sur le
// site et est signalée à chaque build.

export default {
  // Adresse publique du site (sans / final), utilisée pour les liens canoniques et le sitemap.
  url: 'https://bitlabs.fr',

  company: {
    brand: 'bitLabs',
    legalName: 'BITLABS',
    legalForm: 'SAS',
    capital: '1 000,00 €',
    siren: '983 350 810',
    siret: '983 350 810 00013',
    rcs: 'RCS Créteil 983 350 810',
    vat: 'FR75983350810',
    naf: '62.02A',
    founded: '2023',
    street: '11 rue Griffuelhes',
    postalCode: '94800',
    city: 'Villejuif',
    country: 'France',
  },

  contact: {
    email: 'contact@bitlabs.fr',
    phone: '+33 6 28 60 92 98', // format affiché
  },

  // Personne responsable du contenu publié, en principe le représentant légal de la société.
  publication: {
    director: 'Reda Mimouni',
  },

  // Hébergeur du site, obligatoire dans les mentions légales. phone et contact sont facultatifs.
  // GitHub ne publie pas de numéro de téléphone officiel : sa page d'assistance sert de contact.
  // Pour repasser chez Hostinger : 'Hostinger International Limited',
  //   '61 Lordou Vironos str., 6023 Larnaca, Cyprus', contact 'compliance@hostinger.com'.
  host: {
    name: 'GitHub, Inc. (GitHub Pages)',
    address: '88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, United States',
    phone: '',
    contact: 'https://support.github.com',
  },

  // Formulaire de contact. Sans endpoint, l'envoi ouvre la messagerie du visiteur
  // avec le message pré-rempli vers contact.email.
  //   Web3Forms : endpoint 'https://api.web3forms.com/submit', hiddenFields { access_key: '...' }
  //   Formspree : endpoint 'https://formspree.io/f/xxxxxxx'
  form: {
    provider: '', // nom du service, cité dans la politique de confidentialité
    endpoint: '',
    hiddenFields: {},
  },

  // Google Analytics 4. Laisser vide tant que la propriété n'est pas créée :
  // aucun cookie n'est alors déposé et le bandeau de consentement n'apparaît pas.
  analytics: {
    gaId: '', // ex. 'G-XXXXXXXXXX'
  },
};
