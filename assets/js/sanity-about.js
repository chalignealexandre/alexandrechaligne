/**
 * Connexion Sanity – Page À propos.
 * Injecte uniquement les valeurs du schéma pageAPropos dans le design existant.
 */

import { fetchQuery } from './sanity-client.js';
import { applyBackgroundOrientation, applyImgOrientation } from './image-orientation.js';

const PAGE_A_PROPOS_QUERY = `*[_id == "pageAPropos"][0]{
  "heroImageUrl": heroImage.asset->url,
  heroTitle_fr, heroTitle_en, heroSubtitle_fr, heroSubtitle_en,
  "sectionArtStaffImageUrl": sectionArtStaffImage.asset->url
}`;

function getLang() {
  const lang = document.documentElement.lang || document.documentElement.dataset?.lang;
  return lang === 'en' ? 'en' : 'fr';
}

function applyHero(data) {
  if (!data) return;
  const lang = getLang();

  const title = lang === 'fr' ? data.heroTitle_fr : data.heroTitle_en;
  const pageTitle = document.querySelector('.page-hero .page-title');
  if (title && pageTitle) pageTitle.textContent = title;

  const subtitle = lang === 'fr' ? data.heroSubtitle_fr : data.heroSubtitle_en;
  const pageSubtitle = document.querySelector('.page-hero .page-subtitle');
  if (subtitle != null && pageSubtitle) pageSubtitle.textContent = subtitle;

  const heroSection = document.querySelector('.page-hero');
  if (data.heroImageUrl && heroSection) {
    applyBackgroundOrientation(heroSection, data.heroImageUrl);
  }
}

function applySectionArtStaff(data) {
  if (!data) return;
  const img = document.querySelector('.about-story .about-image img');
  if (data.sectionArtStaffImageUrl && img) {
    img.src = data.sectionArtStaffImageUrl;
    img.removeAttribute('srcset');
    img.dataset.autoOrient = '1';
    applyImgOrientation(img);
  }
}

async function init() {
  const path = window.location.pathname.replace(/\/$/, '');
  const isAbout = path === '/pages/about.html' || path === '/en/pages/about.html';
  if (!isAbout) return;

  try {
    const data = await fetchQuery(PAGE_A_PROPOS_QUERY);
    if (!data) return;
    applyHero(data);
    applySectionArtStaff(data);
  } catch (e) {
    console.warn('Sanity page À propos:', e.message);
  }
}

function runWhenReady() {
  const tryInit = () => {
    if (!document.querySelector('.page-hero')) {
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
