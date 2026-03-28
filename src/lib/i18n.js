import { init, register, locale, _, isLoading } from 'svelte-i18n';
import { atom } from 'nanostores';

import en from '../i18n/en.json';
import ml from '../i18n/ml.json';

register('en', () => Promise.resolve(en));
register('ml', () => Promise.resolve(ml));

function getInitialLocale() {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('kla-lang');
    if (stored) return stored;
  }
  return 'en';
}

const initialLocale = getInitialLocale();

init({
  fallbackLocale: 'en',
  initialLocale,
  preload: [initialLocale],
});

const currentLang = atom(initialLocale);

if (typeof window !== 'undefined') {
  currentLang.subscribe((lang) => {
    locale.set(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('kla-lang', lang);
    }
  });
}

export { locale, _, isLoading, currentLang };

export function setLanguage(lang) {
  currentLang.set(lang);
}

export function getLanguage() {
  return currentLang;
}

export function getAvailableLanguages() {
  return ['en', 'ml'];
}
