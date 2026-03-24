import en from '../i18n/en.json';
import ml from '../i18n/ml.json';

const translations = { en, ml };
let currentLang = 'en';

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('kla-lang', lang);
    applyTranslations();
    return true;
  }
  return false;
}

export function getLanguage() {
  return currentLang;
}

export function initLanguage() {
  const stored = localStorage.getItem('kla-lang');
  if (stored && translations[stored]) {
    currentLang = stored;
  }
  applyTranslations();
  return currentLang;
}

export function t(key) {
  const keys = key.split('.');
  let value = translations[currentLang];
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      break;
    }
  }
  
  if (value === undefined) {
    // Fallback to English
    value = translations.en;
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        break;
      }
    }
  }
  
  return value || key;
}

export function tReplace(key, replacements) {
  let text = t(key);
  if (replacements) {
    Object.keys(replacements).forEach(placeholder => {
      text = text.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
    });
  }
  return text;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (text) {
      el.textContent = text;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = t(key);
    if (text) {
      el.placeholder = text;
    }
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const text = t(key);
    if (text) {
      el.title = text;
    }
  });

  // Dispatch event for components that need manual updates
  window.dispatchEvent(new CustomEvent('i18n-updated', { detail: { lang: currentLang } }));
}

export function getAvailableLanguages() {
  return Object.keys(translations);
}
