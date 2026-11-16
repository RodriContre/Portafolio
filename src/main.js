import emailjs from 'emailjs-com';
import './style.css';

const root = document.documentElement;
const themeButton = document.getElementById('themeBtn');
const themeColor = document.querySelector('meta[name="theme-color"]');
function syncTheme() {
  const isDark = root.classList.contains('dark');
  themeButton.setAttribute('aria-pressed', String(isDark));
  themeButton.setAttribute('aria-label', isDark ? 'Activar tema claro' : 'Activar tema oscuro');
  themeColor.setAttribute('content', isDark ? '#15121d' : '#f7f5fc');
}
syncTheme();
themeButton.addEventListener('click', () => {
  root.classList.toggle('dark');
  try { localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light'); } catch (_) { /* Storage is optional. */ }
  syncTheme();
});
const menuButton = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
function setMenu(open) {
  mobileMenu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
menuButton.addEventListener('click', () => setMenu(mobileMenu.hidden));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileMenu.hidden) { setMenu(false); menuButton.focus(); }
});
window.matchMedia('(min-width: 900px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
document.getElementById('year').textContent = String(new Date().getFullYear());
const form = document.getElementById('contactForm');
const submitButton = document.getElementById('submitBtn');
const submitLabel = document.getElementById('submitLabel');
const status = document.getElementById('formStatus');
const fields = form.querySelectorAll('input, textarea');
let submitting = false;
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting || !form.reportValidity()) return;
  submitting = true;
  submitButton.disabled = true;
  fields.forEach(field => { field.readOnly = true; });
  form.setAttribute('aria-busy', 'true');
  submitLabel.textContent = 'Enviando…';
  status.dataset.state = 'pending';
  status.textContent = 'Enviando tu mensaje…';
  try {
    await emailjs.sendForm('service_wr0x4m7', 'template_ygzvhvp', form, 'afne6iCmh5iG9wbVM');
    status.dataset.state = 'success';
    status.textContent = 'Mensaje enviado. Gracias por contactarme.';
    form.reset();
  } catch (_) {
    status.dataset.state = 'error';
    status.textContent = 'No se pudo enviar. Tus datos se conservaron; vuelve a intentarlo o escríbeme a rodricontre1234@gmail.com.';
  } finally {
    submitting = false;
    submitButton.disabled = false;
    fields.forEach(field => { field.readOnly = false; });
    form.removeAttribute('aria-busy');
    submitLabel.textContent = 'Enviar mensaje';
  }
});
