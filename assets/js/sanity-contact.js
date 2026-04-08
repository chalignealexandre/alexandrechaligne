/**
 * Connexion Sanity – Page Contact.
 * Injecte pageContact : hero, contact direct (téléphones, email), zones d'intervention.
 */

import { fetchQuery } from './sanity-client.js';
import { applyBackgroundOrientation } from './image-orientation.js';

const PAGE_CONTACT_QUERY = `*[_id == "pageContact"][0]{
  "heroImageUrl": heroImage.asset->url,
  heroTitle_fr, heroTitle_en, heroSubtitle_fr, heroSubtitle_en,
  phone1Label_fr, phone1Label_en, phone1Number, phone1Schedule_fr, phone1Schedule_en,
  phone2Label_fr, phone2Label_en, phone2Number, phone2Schedule_fr, phone2Schedule_en,
  emailLabel_fr, emailLabel_en, emailAddress, emailNote_fr, emailNote_en,
  zones_fr, zones_en,
  trustTitle_fr, trustTitle_en,
  trustItems_fr, trustItems_en,
  benefitsTitle_fr, benefitsTitle_en,
  benefitsItems[]{
    isEnabled,
    title_fr, title_en,
    text_fr, text_en
  },
  preferCallText_fr, preferCallText_en,
  preferCallPhone1, preferCallPhone2,
  faqItems[]{
    isEnabled,
    question_fr, question_en,
    answer_fr, answer_en
  }
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
    applyBackgroundOrientation(heroSection, data.heroImageUrl);
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

function sanitizeTel(value) {
  return String(value || '').replace(/\s/g, '');
}

function applyTrust(data) {
  if (!data) return;
  const lang = getLang();
  const isFr = lang === 'fr';

  const card = document.querySelector('.trust-card');
  if (!card) return;

  const title = isFr ? data.trustTitle_fr : data.trustTitle_en;
  const titleEl = card.querySelector('.sidebar-card-title');
  if (titleEl && title) titleEl.textContent = title;

  const items = isFr ? (data.trustItems_fr || []) : (data.trustItems_en || []);
  const cleanItems = Array.isArray(items) ? items.map((s) => String(s || '').trim()).filter(Boolean) : [];
  if (cleanItems.length === 0) return; // fallback to static HTML

  const list = card.querySelector('.trust-list');
  if (!list) return;

  const iconSvg = list.querySelector('.trust-item svg')?.outerHTML || '';
  list.innerHTML = cleanItems
    .map((text) => {
      return `<li class="trust-item">
        ${iconSvg}
        <span>${escapeHtml(text)}</span>
      </li>`;
    })
    .join('');
}

function applyPartnershipBenefits(data) {
  if (!data) return;
  const lang = getLang();
  const isFr = lang === 'fr';

  const card = document.querySelector('.partnership-benefits .benefits-card');
  if (!card) return;

  const title = isFr ? data.benefitsTitle_fr : data.benefitsTitle_en;
  const titleEl = card.querySelector('.benefits-title');
  if (titleEl && title) titleEl.textContent = title;

  const items = Array.isArray(data.benefitsItems) ? data.benefitsItems : [];
  const enabled = items.filter((it) => it && it.isEnabled !== false);
  if (enabled.length === 0) return; // fallback to static HTML

  const iconSvg = card.querySelector('.benefit-item .benefit-icon')?.innerHTML || '';

  const html = enabled
    .map((it) => {
      const t = (isFr ? it.title_fr : it.title_en) || '';
      const p = (isFr ? it.text_fr : it.text_en) || '';
      return `<div class="benefit-item">
        <div class="benefit-icon">${iconSvg}</div>
        <div class="benefit-content">
          <h4>${escapeHtml(t)}</h4>
          <p>${escapeHtml(p)}</p>
        </div>
      </div>`;
    })
    .join('');

  const existingItems = Array.from(card.querySelectorAll('.benefit-item'));
  existingItems.forEach((el) => el.remove());
  card.insertAdjacentHTML('beforeend', html);
}

function applyPreferCall(data) {
  if (!data) return;
  const lang = getLang();
  const isFr = lang === 'fr';

  const block = document.querySelector('.partnership-contact-direct');
  if (!block) return;

  const text = isFr ? data.preferCallText_fr : data.preferCallText_en;
  const p = block.querySelector('p');
  if (p && text) p.textContent = text;

  const links = block.querySelectorAll('a.partnership-phone');
  if (links.length < 2) return;

  if (data.preferCallPhone1) {
    links[0].href = `tel:${sanitizeTel(data.preferCallPhone1)}`;
    const svg = links[0].querySelector('svg');
    links[0].innerHTML = '';
    if (svg) links[0].appendChild(svg);
    links[0].appendChild(document.createTextNode(`\n                            ${data.preferCallPhone1}`));
  }

  if (data.preferCallPhone2) {
    links[1].href = `tel:${sanitizeTel(data.preferCallPhone2)}`;
    const svg = links[1].querySelector('svg');
    links[1].innerHTML = '';
    if (svg) links[1].appendChild(svg);
    links[1].appendChild(document.createTextNode(`\n                            ${data.preferCallPhone2}`));
  }
}

function nl2br(text) {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

function applyFaq(data) {
  if (!data) return;

  const accordion = document.querySelector('.faq-accordion');
  if (!accordion) return;

  const lang = getLang();
  const isFr = lang === 'fr';

  const items = Array.isArray(data.faqItems) ? data.faqItems : [];
  const enabledItems = items.filter((it) => it && it.isEnabled !== false);

  // Fallback: if no FAQ configured in Sanity, keep the existing static FAQ in HTML.
  if (enabledItems.length === 0) return;

  accordion.innerHTML = enabledItems
    .map((it) => {
      const q = (isFr ? it.question_fr : it.question_en) || '';
      const a = (isFr ? it.answer_fr : it.answer_en) || '';

      return `<div class="faq-item-enhanced" data-faq-item>
        <button class="faq-question-btn" aria-expanded="false">
          <span class="faq-question-text">${escapeHtml(q)}</span>
          <svg class="faq-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="faq-answer-wrapper">
          <p class="faq-answer-text">${nl2br(a)}</p>
        </div>
      </div>`;
    })
    .join('');

  // Re-bind accordion interactions because we replaced the DOM after main.js initial bind.
  const faqItemsEnhanced = accordion.querySelectorAll('[data-faq-item]');
  faqItemsEnhanced.forEach((item) => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const isOpen = item.hasAttribute('data-faq-open');

      faqItemsEnhanced.forEach((otherItem) => {
        otherItem.removeAttribute('data-faq-open');
        const otherBtn = otherItem.querySelector('.faq-question-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.setAttribute('data-faq-open', '');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
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
    applyTrust(data);
    applyPartnershipBenefits(data);
    applyPreferCall(data);
    applyFaq(data);
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
