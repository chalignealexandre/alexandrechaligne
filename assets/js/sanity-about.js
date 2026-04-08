/**
 * Connexion Sanity – Page À propos.
 * Injecte uniquement les valeurs du schéma pageAPropos dans le design existant.
 */

import { fetchQuery } from './sanity-client.js';
import { applyBackgroundOrientation, applyImgOrientation } from './image-orientation.js';

const PAGE_A_PROPOS_QUERY = `*[_id == "pageAPropos"][0]{
  "heroImageUrl": heroImage.asset->url,
  heroTitle_fr, heroTitle_en, heroSubtitle_fr, heroSubtitle_en,
  "sectionArtStaffImageUrl": sectionArtStaffImage.asset->url,

  storyTitle_fr, storyTitle_en,
  storyText_fr, storyText_en,
  storyQuoteText_fr, storyQuoteText_en,
  storyQuoteAuthor_fr, storyQuoteAuthor_en,

  timelineTitle_fr, timelineTitle_en,
  timelineSubtitle_fr, timelineSubtitle_en,
  timelineItems[]{
    isEnabled,
    year,
    title_fr, title_en,
    text_fr, text_en
  },

  valuesTitle_fr, valuesTitle_en,
  valuesSubtitle_fr, valuesSubtitle_en,
  valuesItems[]{
    isEnabled,
    title_fr, title_en,
    text_fr, text_en
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

function escapeHtml(s) {
  if (s == null) return '';
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function splitParagraphs(text) {
  const raw = String(text || '');
  return raw
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function applyStory(data) {
  if (!data) return;
  const lang = getLang();
  const isFr = lang === 'fr';

  const section = document.querySelector('.about-story');
  if (!section) return;

  const title = isFr ? data.storyTitle_fr : data.storyTitle_en;
  const titleEl = section.querySelector('.about-content .section-title');
  if (titleEl && title) titleEl.textContent = title;

  const text = isFr ? data.storyText_fr : data.storyText_en;
  const paragraphs = splitParagraphs(text);
  const textBlock = section.querySelector('.about-text-block');
  if (textBlock && paragraphs.length > 0) {
    textBlock.innerHTML = paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
  }

  const quoteText = isFr ? data.storyQuoteText_fr : data.storyQuoteText_en;
  const quoteAuthor = isFr ? data.storyQuoteAuthor_fr : data.storyQuoteAuthor_en;
  const quoteP = section.querySelector('.about-quote blockquote p');
  const quoteCite = section.querySelector('.about-quote blockquote cite');
  if (quoteP && quoteText) quoteP.textContent = quoteText;
  if (quoteCite && quoteAuthor) quoteCite.textContent = quoteAuthor;
}

function applyTimeline(data) {
  if (!data) return;
  const lang = getLang();
  const isFr = lang === 'fr';

  const section = document.querySelector('.expertise-timeline');
  if (!section) return;

  const title = isFr ? data.timelineTitle_fr : data.timelineTitle_en;
  const subtitle = isFr ? data.timelineSubtitle_fr : data.timelineSubtitle_en;
  const titleEl = section.querySelector('.section-header .section-title');
  const subEl = section.querySelector('.section-header .section-subtitle');
  if (titleEl && title) titleEl.textContent = title;
  if (subEl && subtitle) subEl.textContent = subtitle;

  const items = Array.isArray(data.timelineItems) ? data.timelineItems : [];
  const enabled = items.filter((it) => it && it.isEnabled !== false);
  if (enabled.length === 0) return; // fallback to existing HTML/i18n

  const timeline = section.querySelector('.timeline');
  if (!timeline) return;

  timeline.innerHTML = enabled
    .map((it) => {
      const year = String(it.year || '').trim();
      const t = (isFr ? it.title_fr : it.title_en) || '';
      const desc = (isFr ? it.text_fr : it.text_en) || '';
      const fullTitle = year ? `${year} - ${t}` : t;
      return `<div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <h3 class="timeline-title">${escapeHtml(fullTitle)}</h3>
          <p class="timeline-description">${escapeHtml(desc)}</p>
        </div>
      </div>`;
    })
    .join('');
}

function applyValues(data) {
  if (!data) return;
  const lang = getLang();
  const isFr = lang === 'fr';

  const section = document.querySelector('.values-detailed');
  if (!section) return;

  const title = isFr ? data.valuesTitle_fr : data.valuesTitle_en;
  const subtitle = isFr ? data.valuesSubtitle_fr : data.valuesSubtitle_en;
  const titleEl = section.querySelector('.section-header .section-title');
  const subEl = section.querySelector('.section-header .section-subtitle');
  if (titleEl && title) titleEl.textContent = title;
  if (subEl && subtitle) subEl.textContent = subtitle;

  const items = Array.isArray(data.valuesItems) ? data.valuesItems : [];
  const enabled = items.filter((it) => it && it.isEnabled !== false);
  if (enabled.length === 0) return; // fallback to existing HTML/i18n

  const grid = section.querySelector('.values-detailed-grid');
  if (!grid) return;

  // Keep existing icons if possible (re-use the first N icons from current DOM)
  const existingIcons = Array.from(grid.querySelectorAll('.value-card-icon')).map((el) => el.innerHTML);

  grid.innerHTML = enabled
    .map((it, idx) => {
      const t = (isFr ? it.title_fr : it.title_en) || '';
      const desc = (isFr ? it.text_fr : it.text_en) || '';
      const icon = existingIcons[idx] || existingIcons[0] || '';
      return `<article class="value-card">
        <div class="value-card-icon">${icon}</div>
        <h3 class="value-card-title">${escapeHtml(t)}</h3>
        <p class="value-card-description">${escapeHtml(desc)}</p>
      </article>`;
    })
    .join('');
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
    applyStory(data);
    applyTimeline(data);
    applyValues(data);
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
