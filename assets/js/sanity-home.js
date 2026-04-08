/**
 * Connexion Sanity – Page Accueil.
 * Injecte uniquement les valeurs Sanity dans le design existant (structure et styles inchangés).
 */

import { fetchQuery } from './sanity-client.js';
import { applyImgOrientation } from './image-orientation.js';

const PAGE_ACCUEIL_QUERY = `*[_id == "pageAccueil"][0]{
  "heroVideoUrl": heroVideo.asset->url,
  heroTitle_fr, heroTitle_en, heroSubtitle_fr, heroSubtitle_en,
  heroBadge_fr, heroBadge_en,
  "excellenceImageUrl": excellenceImage.asset->url,
  excellenceYears, excellenceProjectsCount,
  remarkableProjectsCount, remarkableCountriesCount,
  "remarkableProjects": remarkableProjects[]->{
    _id,
    "slug": slug.current,
    "previewImageUrl": previewImage.asset->url,
    previewTitle_fr, previewTitle_en,
    previewCategory_fr, previewCategory_en,
    previewLieu_fr, previewLieu_en
  }
}`;

function getLang() {
  const lang = document.documentElement.lang || document.documentElement.dataset?.lang;
  return lang === 'en' ? 'en' : 'fr';
}

/**
 * Met à jour le texte des 5 spans .hero-word (titre) et du sous-titre .hero-tagline-line.
 * La structure et les classes restent identiques.
 */
function applyHero(data) {
  if (!data) return;
  const lang = getLang();

  const badgeText = (lang === 'fr' ? data.heroBadge_fr : data.heroBadge_en) || '';
  const badgeEl = document.querySelector('.hero-label [data-i18n="home.hero.badge"]');
  if (badgeEl && badgeText.trim() !== '') badgeEl.textContent = badgeText.trim();

  const videoSource = document.querySelector('.hero .hero-video source');
  if (data.heroVideoUrl && videoSource) {
    videoSource.src = data.heroVideoUrl;
    videoSource.type = data.heroVideoUrl.includes('webm') ? 'video/webm' : 'video/mp4';
    const video = videoSource.closest('video');
    if (video) video.load();
  }

  const title = (lang === 'fr' ? data.heroTitle_fr : data.heroTitle_en) || '';
  const words = title.trim().split(/\s+/).slice(0, 5);
  const heroWords = document.querySelectorAll('.hero-heading .hero-word');
  heroWords.forEach((el, i) => {
    if (i < 4) {
      el.textContent = words[i] ?? '';
    } else {
      el.textContent = words[4] ?? '';
    }
  });

  const subtitle = (lang === 'fr' ? data.heroSubtitle_fr : data.heroSubtitle_en) || '';
  const taglineEl = document.querySelector('.hero-tagline .hero-tagline-line');
  if (taglineEl) taglineEl.textContent = subtitle.replace(/\n/g, ' ').trim();
}

/**
 * Met à jour uniquement l'image et les deux chiffres. Le reste du bloc reste inchangé.
 */
function applyExcellence(data) {
  if (!data) return;

  const introImage = document.querySelector('.intro-section .intro-image img');
  if (data.excellenceImageUrl && introImage) {
    introImage.src = data.excellenceImageUrl;
    introImage.removeAttribute('srcset');
    introImage.dataset.autoOrient = '1';
    applyImgOrientation(introImage);
  }

  const statNumbers = document.querySelectorAll('.intro-stat-number');
  if (statNumbers.length >= 2) {
    if (data.excellenceYears != null) statNumbers[0].textContent = `${data.excellenceYears}+`;
    if (data.excellenceProjectsCount != null) statNumbers[1].textContent = `${data.excellenceProjectsCount}+`;
  }
}

/**
 * Met à jour uniquement les stats (chiffres) de la section portfolio. Ne touche pas à la grille des projets.
 */
function applyPortfolioStats(data) {
  if (!data) return;
  const statsContainer = document.querySelector('.portfolio-gallery__stats');
  if (!statsContainer) return;
  const statNumbers = statsContainer.querySelectorAll('.portfolio-gallery__stat-number');
  if (statNumbers.length >= 2) {
    if (data.remarkableProjectsCount != null) statNumbers[0].textContent = `${data.remarkableProjectsCount}+`;
    if (data.remarkableCountriesCount != null) statNumbers[1].textContent = data.remarkableCountriesCount;
  }
}

/**
 * Met à jour le contenu des cartes projets existantes (image, titre, catégorie, lieu, lien) sans changer la structure HTML.
 * Si Sanity renvoie plus ou moins de projets que les cartes présentes, on met à jour uniquement les cartes qui existent.
 */
function applyPortfolioCards(data) {
  if (!data || !data.remarkableProjects || !data.remarkableProjects.length) return;
  const lang = getLang();

  const grid = document.querySelector('.portfolio-gallery__grid');
  if (!grid) return;

  const projectItems = grid.querySelectorAll('.portfolio-gallery__item--hero, .portfolio-gallery__item--secondary');
  const projects = data.remarkableProjects.filter((p) => p && p.slug);

  projectItems.forEach((item, i) => {
    const p = projects[i];
    if (!p) return;

    const title = lang === 'fr' ? p.previewTitle_fr : p.previewTitle_en;
    const category = lang === 'fr' ? p.previewCategory_fr : p.previewCategory_en;
    const lieu = lang === 'fr' ? p.previewLieu_fr : p.previewLieu_en;

    if (item.tagName === 'A') item.href = `/pages/projects/${p.slug}.html`;

    const img = item.querySelector('.portfolio-gallery__image');
    if (img && p.previewImageUrl) {
      img.src = p.previewImageUrl;
      img.dataset.autoOrient = '1';
      applyImgOrientation(img);
    }

    const titleEl = item.querySelector('.portfolio-gallery__item-title');
    if (titleEl) titleEl.textContent = title || '';

    const categoryEl = item.querySelector('.portfolio-gallery__item-category');
    if (categoryEl) categoryEl.textContent = category || '';

    const locationSpan = item.querySelector('.portfolio-gallery__location');
    if (locationSpan) {
      const svg = locationSpan.querySelector('svg');
      const text = lieu || '';
      locationSpan.innerHTML = '';
      if (svg) locationSpan.appendChild(svg);
      locationSpan.appendChild(document.createTextNode(text ? ` ${text}` : text));
    }
  });
}

async function init() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const isHome = path === '' || path === '/' || path === '/index.html' || path === '/en' || path === '/en/index.html';
  if (!isHome) return;

  try {
    const data = await fetchQuery(PAGE_ACCUEIL_QUERY);
    if (!data) return;
    applyHero(data);
    applyExcellence(data);
    applyPortfolioStats(data);
    applyPortfolioCards(data);
  } catch (e) {
    console.warn('Sanity page accueil:', e.message);
  }
}

function runWhenReady() {
  const tryInit = () => {
    if (!document.querySelector('.hero-heading')) {
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
