/**
 * Connexion Sanity – Page Services.
 * Injecte les valeurs du schéma pageServices dans le design existant (hero + 3 blocs service).
 */

import { fetchQuery } from './sanity-client.js';
import { applyBackgroundOrientation, applyImgOrientation } from './image-orientation.js';

const PAGE_SERVICES_QUERY = `*[_id == "pageServices"][0]{
  "heroImageUrl": heroImage.asset->url,
  heroTitle_fr, heroTitle_en, heroSubtitle_fr, heroSubtitle_en,
  areasTitle_fr, areasTitle_en,
  areasSubtitle_fr, areasSubtitle_en,
  areasItems[]{
    isEnabled,
    title_fr, title_en,
    desc_fr, desc_en
  },
  services[]{
    title_fr, title_en, description_fr, description_en,
    "imageUrl": image.asset->url,
    prestations_fr, prestations_en,
    question_fr, question_en, answer_fr, answer_en
  }
}`;

function getLang() {
  const lang = document.documentElement.lang || document.documentElement.dataset?.lang;
  return lang === 'en' ? 'en' : 'fr';
}

function applyHero(data) {
  if (!data) return;
  const lang = getLang();

  const title = lang === 'fr' ? data.heroTitle_fr : data.heroTitle_en;
  const pageTitle = document.querySelector('.services-hero .page-title');
  if (title && pageTitle) pageTitle.textContent = title;

  const subtitle = lang === 'fr' ? data.heroSubtitle_fr : data.heroSubtitle_en;
  const pageSubtitle = document.querySelector('.services-hero .page-subtitle');
  if (subtitle != null && pageSubtitle) pageSubtitle.textContent = subtitle;

  const heroSection = document.querySelector('.services-hero');
  if (data.heroImageUrl && heroSection) {
    applyBackgroundOrientation(heroSection, data.heroImageUrl);
  }
}

function applyServiceBlock(section, service, lang) {
  if (!service) return;
  const isFr = lang === 'fr';

  const titleEl = section.querySelector('.service-title');
  if (titleEl) titleEl.textContent = isFr ? service.title_fr : service.title_en;

  const descEl = section.querySelector('.service-description');
  if (descEl) descEl.textContent = isFr ? service.description_fr : service.description_en;

  const list = section.querySelector('.service-list');
  if (list) {
    const items = isFr ? (service.prestations_fr || []) : (service.prestations_en || []);
    const lis = list.querySelectorAll('li');
    lis.forEach((li, i) => {
      li.textContent = items[i] ?? li.textContent;
    });
  }

  const highlight = section.querySelector('.service-highlight');
  if (highlight) {
    const h4 = highlight.querySelector('h4');
    const p = highlight.querySelector('p');
    if (h4) h4.textContent = isFr ? service.question_fr : service.question_en;
    if (p) p.textContent = isFr ? service.answer_fr : service.answer_en;
  }

  const img = section.querySelector('.service-image img');
  if (img && service.imageUrl) {
    img.src = service.imageUrl;
    img.removeAttribute('srcset');
    img.dataset.autoOrient = '1';
    applyImgOrientation(img);
  }
}

function applyServices(data) {
  if (!data || !data.services || !data.services.length) return;
  const lang = getLang();

  const sections = document.querySelectorAll('.service-detail');
  sections.forEach((section, i) => {
    applyServiceBlock(section, data.services[i], lang);
  });
}

function escapeHtml(s) {
  if (s == null) return '';
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function applyServiceAreas(data) {
  if (!data) return;
  const lang = getLang();
  const isFr = lang === 'fr';

  const section = document.querySelector('.service-areas');
  if (!section) return;

  const title = isFr ? data.areasTitle_fr : data.areasTitle_en;
  const subtitle = isFr ? data.areasSubtitle_fr : data.areasSubtitle_en;
  const titleEl = section.querySelector('.section-header .section-title');
  const subEl = section.querySelector('.section-header .section-subtitle');
  if (titleEl && title) titleEl.textContent = title;
  if (subEl && subtitle) subEl.textContent = subtitle;

  const items = Array.isArray(data.areasItems) ? data.areasItems : [];
  const enabled = items.filter((it) => it && it.isEnabled !== false);
  if (enabled.length === 0) return; // fallback to static HTML/i18n

  const grid = section.querySelector('.areas-grid');
  if (!grid) return;

  // Reuse existing icons from current DOM (one per card)
  const existingIcons = Array.from(grid.querySelectorAll('.area-icon')).map((el) => el.innerHTML);

  grid.innerHTML = enabled
    .map((it, idx) => {
      const t = (isFr ? it.title_fr : it.title_en) || '';
      const d = (isFr ? it.desc_fr : it.desc_en) || '';
      const icon = existingIcons[idx] || existingIcons[0] || '';
      return `<div class="area-card">
        <div class="area-icon">${icon}</div>
        <h3 class="area-title">${escapeHtml(t)}</h3>
        <p class="area-description">${escapeHtml(d)}</p>
      </div>`;
    })
    .join('');
}

async function init() {
  const path = window.location.pathname.replace(/\/$/, '');
  const isServices = path === '/pages/services.html' || path === '/en/pages/services.html';
  if (!isServices) return;

  try {
    const data = await fetchQuery(PAGE_SERVICES_QUERY);
    if (!data) return;
    applyHero(data);
    applyServiceAreas(data);
    applyServices(data);
  } catch (e) {
    console.warn('Sanity page Services:', e.message);
  }
}

function runWhenReady() {
  const tryInit = () => {
    if (!document.querySelector('.services-hero')) {
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
