/**
 * Connexion Sanity – Page Contact.
 * Injecte pageContact : hero, contact direct (téléphones, email), zones d'intervention.
 */

import { fetchQuery } from './sanity-client.js';

const PAGE_CONTACT_QUERY = `*[_id == "pageContact"][0]{
  "heroImageUrl": heroImage.asset->url,
  heroTitle_fr, heroTitle_en, heroSubtitle_fr, heroSubtitle_en,
  phone1Label_fr, phone1Label_en, phone1Number, phone1Schedule_fr, phone1Schedule_en,
  phone2Label_fr, phone2Label_en, phone2Number, phone2Schedule_fr, phone2Schedule_en,
  emailLabel_fr, emailLabel_en, emailAddress, emailNote_fr, emailNote_en,
  zones_fr, zones_en
}`;

function getLang() {
  const lang = document.documentElement.lang || document.documentElement.dataset?.lang;
  return lang === 'en' ? 'en' : 'fr';
}

function applyHero(data) {
  if (!data) return;
  const lang = getLang();

  const heroSection = document.querySelector('.contact-hero-enhanced');
  if (!heroSection) return;

  const title = (lang === 'fr' ? data.heroTitle_fr : data.heroTitle_en) || '';
  const subtitle = lang === 'fr' ? data.heroSubtitle_fr : data.heroSubtitle_en;

  const titleLines = heroSection.querySelectorAll('.hero-title-enhanced .title-line');
  if (title && titleLines.length >= 2) {
    const words = title.trim().split(/\s+/);
    if (words.length >= 2) {
      const mid = Math.max(1, Math.ceil(words.length / 2));
      titleLines[0].textContent = words.slice(0, mid).join(' ');
      titleLines[1].textContent = words.slice(mid).join(' ');
    } else {
      titleLines[0].textContent = title;
      titleLines[1].textContent = '';
    }
  }

  const descriptionEl = heroSection.querySelector('.hero-description-enhanced');
  if (descriptionEl && subtitle != null) descriptionEl.textContent = subtitle;

  if (data.heroImageUrl) {
    heroSection.style.backgroundImage = `url(${data.heroImageUrl})`;
    heroSection.style.backgroundSize = 'cover';
    heroSection.style.backgroundPosition = 'center';
  }
}

function applyContactDirect(data) {
  if (!data) return;
  const lang = getLang();
  const isFr = lang === 'fr';

  const items = document.querySelectorAll('.contact-direct-card .contact-detail-item');
  if (items.length < 3) return;

  // Téléphone 1
  const phone1Label = isFr ? data.phone1Label_fr : data.phone1Label_en;
  const phone1Schedule = isFr ? data.phone1Schedule_fr : data.phone1Schedule_en;
  if (data.phone1Number) {
    items[0].href = `tel:${data.phone1Number.replace(/\s/g, '')}`;
    const label = items[0].querySelector('.detail-label');
    const value = items[0].querySelector('.detail-value');
    const info = items[0].querySelector('.detail-info');
    if (label && phone1Label) label.textContent = phone1Label;
    if (value) value.textContent = data.phone1Number;
    if (info && phone1Schedule) info.textContent = phone1Schedule;
  }

  // Téléphone 2
  const phone2Label = isFr ? data.phone2Label_fr : data.phone2Label_en;
  const phone2Schedule = isFr ? data.phone2Schedule_fr : data.phone2Schedule_en;
  if (data.phone2Number) {
    items[1].href = `tel:${data.phone2Number.replace(/\s/g, '')}`;
    const label = items[1].querySelector('.detail-label');
    const value = items[1].querySelector('.detail-value');
    const info = items[1].querySelector('.detail-info');
    if (label && phone2Label) label.textContent = phone2Label;
    if (value) value.textContent = data.phone2Number;
    if (info && phone2Schedule) info.textContent = phone2Schedule;
  }

  // Email
  const emailLabel = isFr ? data.emailLabel_fr : data.emailLabel_en;
  const emailNote = isFr ? data.emailNote_fr : data.emailNote_en;
  if (data.emailAddress) {
    items[2].href = `mailto:${data.emailAddress}`;
    const label = items[2].querySelector('.detail-label');
    const value = items[2].querySelector('.detail-value');
    const info = items[2].querySelector('.detail-info');
    if (label && emailLabel) label.textContent = emailLabel;
    if (value) value.textContent = data.emailAddress;
    if (info && emailNote) info.textContent = emailNote;
  }
}

function applyZones(data) {
  if (!data) return;
  const lang = getLang();
  const zones = lang === 'fr' ? (data.zones_fr || []) : (data.zones_en || []);

  const list = document.querySelector('.location-card .zones-list');
  if (!list || zones.length === 0) return;

  const svgCheck = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>`;

  list.innerHTML = zones
    .map(
      (zone) =>
        `<li class="zone-item">${svgCheck}<span>${escapeHtml(zone)}</span></li>`
    )
    .join('');
}

function escapeHtml(s) {
  if (s == null) return '';
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

async function init() {
  const path = window.location.pathname.replace(/\/$/, '');
  const isContact = path === '/pages/contact.html' || path === '/en/pages/contact.html';
  if (!isContact) return;

  try {
    const data = await fetchQuery(PAGE_CONTACT_QUERY);
    if (!data) return;
    applyHero(data);
    applyContactDirect(data);
    applyZones(data);
  } catch (e) {
    console.warn('Sanity page Contact:', e.message);
  }
}

function runWhenReady() {
  const tryInit = () => {
    if (!document.querySelector('.contact-hero-enhanced')) {
      setTimeout(tryInit, 50);
      return;
    }
    init();
  };
  window.addEventListener('i18nReady', tryInit);
  if (document.documentElement.classList.contains('i18n-ready')) {
    tryInit();
  } else {
    setTimeout(tryInit, 500);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runWhenReady);
} else {
  runWhenReady();
}
