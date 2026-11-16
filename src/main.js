import emailjs from 'emailjs-com';
import './style.css';
import { translations } from './translations.js';

const root = document.documentElement;
const themeButton = document.getElementById('themeBtn');
const themeColor = document.querySelector('meta[name="theme-color"]');
const menuButton = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const languageButtons = document.querySelectorAll('[data-language]');
const form = document.getElementById('contactForm');
const submitButton = document.getElementById('submitBtn');
const submitLabel = document.getElementById('submitLabel');
const status = document.getElementById('formStatus');
const fields = form.querySelectorAll('input, textarea');
let submitting = false;
let language = 'es';

function initialLanguage() {
  const requested = new URL(window.location.href).searchParams.get('lang');
  if (requested === 'es' || requested === 'en') return requested;
  try {
    const saved = localStorage.getItem('language');
    if (saved === 'es' || saved === 'en') return saved;
  } catch (_) { /* Storage is optional. */ }
  return 'es';
}

function message(key) {
  return translations[language][key] ?? translations.es[key] ?? '';
}

function syncTheme() {
  const isDark = root.classList.contains('dark');
  themeButton.setAttribute('aria-pressed', String(isDark));
  themeButton.setAttribute('aria-label', message(isDark ? 'ui.themeLight' : 'ui.themeDark'));
  themeColor.setAttribute('content', isDark ? '#111111' : '#fafafa');
}

function syncFormState() {
  submitLabel.textContent = message(submitting ? 'form.sending' : 'form.send');
  const state = status.dataset.state;
  status.textContent = ['pending', 'success', 'error'].includes(state) ? message(`form.${state}`) : '';
}

function applyLanguage(nextLanguage, updateUrl = false) {
  language = nextLanguage === 'en' ? 'en' : 'es';
  root.setAttribute('lang', language);
  document.title = message('meta.title');
  // Only trusted strings shipped with the page are used here, never visitor input.
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.innerHTML = message(element.dataset.i18n);
  });
  for (const attribute of ['placeholder', 'aria-label', 'content']) {
    document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
      element.setAttribute(attribute, message(element.getAttribute(`data-i18n-${attribute}`)));
    });
  }
  languageButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
  syncTheme();
  setMenu(!mobileMenu.hidden);
  syncFormState();
  try { localStorage.setItem('language', language); } catch (_) { /* Storage is optional. */ }
  if (updateUrl) {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', language);
      window.history.replaceState(null, '', url);
    } catch (_) { /* Language switching also works without URL updates. */ }
  }
}

languageButtons.forEach(button => button.addEventListener('click', () => applyLanguage(button.dataset.language, true)));
themeButton.addEventListener('click', () => {
  root.classList.toggle('dark');
  try { localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light'); } catch (_) { /* Storage is optional. */ }
  syncTheme();
});
function setMenu(open) {
  mobileMenu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', message(open ? 'ui.menuClose' : 'ui.menuOpen'));
}
menuButton.addEventListener('click', () => setMenu(mobileMenu.hidden));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileMenu.hidden) { setMenu(false); menuButton.focus(); }
});
window.matchMedia('(min-width: 900px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
document.getElementById('year').textContent = String(new Date().getFullYear());
applyLanguage(initialLanguage());
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting || !form.reportValidity()) return;
  submitting = true;
  submitButton.disabled = true;
  fields.forEach(field => { field.readOnly = true; });
  form.setAttribute('aria-busy', 'true');
  status.dataset.state = 'pending';
  syncFormState();
  try {
    await emailjs.sendForm('service_wr0x4m7', 'template_ygzvhvp', form, 'afne6iCmh5iG9wbVM');
    status.dataset.state = 'success';
    form.reset();
  } catch (_) {
    status.dataset.state = 'error';
  } finally {
    submitting = false;
    submitButton.disabled = false;
    fields.forEach(field => { field.readOnly = false; });
    form.removeAttribute('aria-busy');
    syncFormState();
  }
});
