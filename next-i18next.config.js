const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
  },
  // On the server (build) use the filesystem path so serverSideTranslations can read files.
  // In the browser we'll request from '/locales'. next-i18next accepts a single localePath,
  // so provide the absolute path for server usage.
  localePath: typeof window === 'undefined' ? path.resolve('./public/locales') : '/locales',
}