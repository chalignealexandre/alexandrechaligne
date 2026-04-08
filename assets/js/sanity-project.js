/**
 * Connexion Sanity – Page détail réalisation (projet).
 * Détecte le slug depuis l’URL (/pages/projects/<slug>.html), charge le document realisation et injecte tout le contenu.
 */

import { fetchQuery } from './sanity-client.js';
import { applyImgOrientation, applyOrientationWithin } from './image-orientation.js';

const REALISATION_QUERY = `*[_type == "realisation" && slug.current == $slug][0]{
  "slug": slug.current,
  "heroImageUrl": heroImage.asset->url,
  heroBadge_fr, heroBadge_en, heroTitle_fr, heroTitle_en,
  heroTitleSuffix_fr, heroTitleSuffix_en, heroSubtitle_fr, heroSubtitle_en,
  showMetaSection, showIntroSection, showApproachSection, showFeaturesSection, showGallerySection, showResultsSection,
  metaTypeLabel_fr, metaTypeLabel_en, metaTypeValue_fr, metaTypeValue_en, metaYear,
  metaLocationLabel_fr, metaLocationLabel_en, metaLocationValue_fr, metaLocationValue_en,
  metaFourthLabel_fr, metaFourthLabel_en, metaFourthValue_fr, metaFourthValue_en,
  introLabel_fr, introLabel_en, introTitle_fr, introTitle_en,
  introLead_fr, introLead_en, introDescription_fr, introDescription_en,
  approachSectionTitle_fr, approachSectionTitle_en,
  challengeTitle_fr, challengeTitle_en, challengeDescription_fr, challengeDescription_en,
  solutionTitle_fr, solutionTitle_en, solutionDescription_fr, solutionDescription_en,
  featuresTitle_fr, featuresTitle_en, featuresSubtitle_fr, featuresSubtitle_en,
  feature1Title_fr, feature1Title_en, feature1Description_fr, feature1Description_en,
  feature2Title_fr, feature2Title_en, feature2Description_fr, feature2Description_en,
  feature3Title_fr, feature3Title_en, feature3Description_fr, feature3Description_en,
  feature4Title_fr, feature4Title_en, feature4Description_fr, feature4Description_en,
  galleryTitle_fr, galleryTitle_en, gallerySubtitle_fr, gallerySubtitle_en,
  "galleryItems": galleryItems[]{
    "imageUrl": image.asset->url,
    caption_fr, caption_en
  },
  quoteText_fr, quoteText_en, quoteAuthor_fr, quoteAuthor_en, quotePosition_fr, quotePosition_en,
  stat1Number, stat1Label_fr, stat1Label_en, stat2Number, stat2Label_fr, stat2Label_en,
  stat3Number, stat3Label_fr, stat3Label_en
}`;

function getLang() {
  const lang = document.documentElement.lang || document.documentElement.dataset?.lang;
  return lang === 'en' ? 'en' : 'fr';
}

function normalizeSlug(input) {
  return String(input ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function getSlugFromPath() {
  const path = window.location.pathname.replace(/\/$/, '');
  const match = path.match(/\/projects\/([^/]+?)(?:\.html)?$/);
  if (!match) return null;
  const slug = normalizeSlug(decodeURIComponent(match[1]));
  if (!slug || slug === 'project') return null;
  return slug;
}

function getRawProjectSegmentFromPath() {
  const path = window.location.pathname.replace(/\/$/, '');
  const match = path.match(/\/projects\/([^/]+?)(?:\.html)?$/);
  if (!match) return null;
  return decodeURIComponent(match[1]).trim();
}

function showNotFound(slug) {
  const subtitle = document.querySelector('.project-hero-premium .hero-subtitle-premium');
  if (subtitle) subtitle.textContent = `Projet introuvable (${slug}).`;

  const hideSelectors = [
    '.project-meta-premium',
    '.project-intro-premium',
    '.challenge-solution-premium',
    '.features-premium',
    '.gallery-premium',
    '.results-premium',
  ];
  hideSelectors.forEach((sel) => {
    const el = document.querySelector(sel);
    if (el) el.style.display = 'none';
  });
}

function buildProjectUrl(slug) {
  const isEn = window.location.pathname.startsWith('/en/');
  const prefix = isEn ? '/en' : '';
  const cleanSlug = String(slug ?? '')
    .trim()
    .replace(/\.html$/i, '');
  return `${prefix}/pages/projects/${encodeURIComponent(cleanSlug)}`;
}

function normalizeProjectPath(pathname) {
  return String(pathname ?? '')
    .replace(/\/$/, '')
    .replace(/\.html$/i, '');
}

function toggleSection(selector, shouldShow) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.style.display = shouldShow ? '' : 'none';
}

function hasText(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function hasValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function hasVisibleGallery(items) {
  return Array.isArray(items) && items.some((item) => item && item.imageUrl);
}

function shouldShowSection(flag, hasContent) {
  if (flag === false) return false;
  if (flag === true) return true;
  return hasContent;
}

function applySectionVisibility(data) {
  const hasMetaContent = [
    data.metaTypeLabel_fr,
    data.metaTypeLabel_en,
    data.metaTypeValue_fr,
    data.metaTypeValue_en,
    data.metaYear,
    data.metaLocationLabel_fr,
    data.metaLocationLabel_en,
    data.metaLocationValue_fr,
    data.metaLocationValue_en,
    data.metaFourthLabel_fr,
    data.metaFourthLabel_en,
    data.metaFourthValue_fr,
    data.metaFourthValue_en,
  ].some(hasValue);

  const hasIntroContent = [
    data.introLabel_fr,
    data.introLabel_en,
    data.introTitle_fr,
    data.introTitle_en,
    data.introLead_fr,
    data.introLead_en,
    data.introDescription_fr,
    data.introDescription_en,
  ].some(hasText);

  const hasApproachContent = [
    data.approachSectionTitle_fr,
    data.approachSectionTitle_en,
    data.challengeTitle_fr,
    data.challengeTitle_en,
    data.challengeDescription_fr,
    data.challengeDescription_en,
    data.solutionTitle_fr,
    data.solutionTitle_en,
    data.solutionDescription_fr,
    data.solutionDescription_en,
  ].some(hasText);

  const hasFeaturesContent = [
    data.featuresTitle_fr,
    data.featuresTitle_en,
    data.featuresSubtitle_fr,
    data.featuresSubtitle_en,
    data.feature1Title_fr,
    data.feature1Title_en,
    data.feature1Description_fr,
    data.feature1Description_en,
    data.feature2Title_fr,
    data.feature2Title_en,
    data.feature2Description_fr,
    data.feature2Description_en,
    data.feature3Title_fr,
    data.feature3Title_en,
    data.feature3Description_fr,
    data.feature3Description_en,
    data.feature4Title_fr,
    data.feature4Title_en,
    data.feature4Description_fr,
    data.feature4Description_en,
  ].some(hasText);

  const hasGalleryContent = hasVisibleGallery(data.galleryItems);

  const hasResultsContent = [
    data.quoteText_fr,
    data.quoteText_en,
    data.quoteAuthor_fr,
    data.quoteAuthor_en,
    data.quotePosition_fr,
    data.quotePosition_en,
    data.stat1Number,
    data.stat1Label_fr,
    data.stat1Label_en,
    data.stat2Number,
    data.stat2Label_fr,
    data.stat2Label_en,
    data.stat3Number,
    data.stat3Label_fr,
    data.stat3Label_en,
  ].some(hasValue);

  toggleSection('.project-meta-premium', shouldShowSection(data.showMetaSection, hasMetaContent));
  toggleSection('.project-intro-premium', shouldShowSection(data.showIntroSection, hasIntroContent));
  toggleSection('.challenge-solution-premium', shouldShowSection(data.showApproachSection, hasApproachContent));
  toggleSection('.features-premium', shouldShowSection(data.showFeaturesSection, hasFeaturesContent));
  toggleSection('.gallery-premium', shouldShowSection(data.showGallerySection, hasGalleryContent));
  toggleSection('.results-premium', shouldShowSection(data.showResultsSection, hasResultsContent));
}

async function tryRedirectToClosestSlug(requestedSlug) {
  const all = await fetchQuery(`*[_type == "realisation" && defined(slug.current)]{ "slug": slug.current }`);
  if (!Array.isArray(all) || all.length === 0) return false;

  const requested = normalizeSlug(requestedSlug);
  const found = all.find((r) => normalizeSlug(r.slug) === requested);
  if (!found || !found.slug) return false;

  const targetUrl = buildProjectUrl(found.slug);
  if (targetUrl && normalizeProjectPath(targetUrl) !== normalizeProjectPath(window.location.pathname)) {
    window.location.replace(targetUrl);
    return true;
  }
  return false;
}

async function tryRedirectByTitle(rawSegment) {
  const q = String(rawSegment || '')
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ');

  if (!q || q.length < 3) return false;

  const hit = await fetchQuery(
    `*[_type == "realisation" && defined(slug.current) && (
      lower(coalesce(previewTitle_fr,"")) match $q ||
      lower(coalesce(heroTitle_fr,"")) match $q ||
      lower(coalesce(previewTitle_en,"")) match $q ||
      lower(coalesce(heroTitle_en,"")) match $q
    )][0]{ "slug": slug.current }`,
    { q: `${q}*` }
  );

  const slug = hit?.slug;
  if (!slug) return false;

  const targetUrl = buildProjectUrl(slug);
  if (targetUrl && normalizeProjectPath(targetUrl) !== normalizeProjectPath(window.location.pathname)) {
    window.location.replace(targetUrl);
    return true;
  }
  return false;
}

function applyHero(data) {
  if (!data) return;
  const lang = getLang();
  const isFr = lang === 'fr';

  const heroMedia = document.querySelector('.project-hero-premium .hero-media img');
  if (heroMedia && data.heroImageUrl) {
    heroMedia.src = data.heroImageUrl;
    heroMedia.dataset.autoOrient = '1';
    applyImgOrientation(heroMedia);
  }

  const badge = document.querySelector('.project-hero-premium .category-badge-premium');
  if (badge) badge.textContent = isFr ? data.heroBadge_fr : data.heroBadge_en;

  const titleEl = document.querySelector('.project-hero-premium .hero-title-premium');
  if (titleEl) {
    const mainTitle = isFr ? data.heroTitle_fr : data.heroTitle_en;
    const suffix = isFr ? data.heroTitleSuffix_fr : data.heroTitleSuffix_en;
    if (mainTitle != null) {
      titleEl.innerHTML = '';
      titleEl.appendChild(document.createTextNode(mainTitle));
      if (suffix != null && suffix !== '') {
        const s = document.createElement('span');
        s.textContent = suffix;
        titleEl.appendChild(s);
      }
    }
  }

  const subtitle = document.querySelector('.project-hero-premium .hero-subtitle-premium');
  if (subtitle) subtitle.textContent = isFr ? data.heroSubtitle_fr : data.heroSubtitle_en;
}

function applyMeta(data) {
  if (!data) return;
  const lang = getLang();
  const isFr = lang === 'fr';

  const items = document.querySelectorAll('.project-meta-premium .meta-item-premium');
  if (items.length < 4) return;

  const setMeta = (i, label, value) => {
    const elLabel = items[i]?.querySelector('.meta-label-premium');
    const elValue = items[i]?.querySelector('.meta-value-premium');
    if (elLabel && label != null) elLabel.textContent = label;
    if (elValue && value != null) elValue.textContent = value;
  };

  setMeta(0, isFr ? data.metaTypeLabel_fr : data.metaTypeLabel_en, isFr ? data.metaTypeValue_fr : data.metaTypeValue_en);
  setMeta(1, null, data.metaYear != null ? String(data.metaYear) : null);
  setMeta(2, isFr ? data.metaLocationLabel_fr : data.metaLocationLabel_en, isFr ? data.metaLocationValue_fr : data.metaLocationValue_en);
  setMeta(3, isFr ? data.metaFourthLabel_fr : data.metaFourthLabel_en, isFr ? data.metaFourthValue_fr : data.metaFourthValue_en);
}

function applyIntro(data) {
  if (!data) return;
  const lang = getLang();
  const isFr = lang === 'fr';

  const label = document.querySelector('.project-intro-premium .intro-label-premium');
  const title = document.querySelector('.project-intro-premium .intro-title-premium');
  const lead = document.querySelector('.project-intro-premium .intro-lead-premium');
  const text = document.querySelector('.project-intro-premium .intro-text-premium');
  if (label) label.textContent = isFr ? data.introLabel_fr : data.introLabel_en;
  if (title) title.textContent = isFr ? data.introTitle_fr : data.introTitle_en;
  if (lead) lead.textContent = isFr ? data.introLead_fr : data.introLead_en;
  if (text) text.textContent = isFr ? data.introDescription_fr : data.introDescription_en;
}

function applyApproach(data) {
  if (!data) return;
  const lang = getLang();
  const isFr = lang === 'fr';

  const sectionTitle = document.querySelector('.challenge-solution-premium .cs-header-premium h2');
  if (sectionTitle) sectionTitle.textContent = isFr ? data.approachSectionTitle_fr : data.approachSectionTitle_en;

  const challenge = document.querySelector('.challenge-solution-premium .cs-card-premium.challenge');
  if (challenge) {
    const h = challenge.querySelector('h3');
    const p = challenge.querySelector('p');
    if (h) h.textContent = isFr ? data.challengeTitle_fr : data.challengeTitle_en;
    if (p) p.textContent = isFr ? data.challengeDescription_fr : data.challengeDescription_en;
  }

  const solution = document.querySelector('.challenge-solution-premium .cs-card-premium.solution');
  if (solution) {
    const h = solution.querySelector('h3');
    const p = solution.querySelector('p');
    if (h) h.textContent = isFr ? data.solutionTitle_fr : data.solutionTitle_en;
    if (p) p.textContent = isFr ? data.solutionDescription_fr : data.solutionDescription_en;
  }
}

function applyFeatures(data) {
  if (!data) return;
  const lang = getLang();
  const isFr = lang === 'fr';

  const headerTitle = document.querySelector('.features-premium .features-header-premium h2');
  const headerSub = document.querySelector('.features-premium .features-header-premium p');
  if (headerTitle) headerTitle.textContent = isFr ? data.featuresTitle_fr : data.featuresTitle_en;
  if (headerSub) headerSub.textContent = isFr ? data.featuresSubtitle_fr : data.featuresSubtitle_en;

  const cards = document.querySelectorAll('.features-premium .feature-card-premium');
  const titles = [
    [data.feature1Title_fr, data.feature1Title_en],
    [data.feature2Title_fr, data.feature2Title_en],
    [data.feature3Title_fr, data.feature3Title_en],
    [data.feature4Title_fr, data.feature4Title_en],
  ];
  const descs = [
    [data.feature1Description_fr, data.feature1Description_en],
    [data.feature2Description_fr, data.feature2Description_en],
    [data.feature3Description_fr, data.feature3Description_en],
    [data.feature4Description_fr, data.feature4Description_en],
  ];
  cards.forEach((card, i) => {
    const h = card.querySelector('h3');
    const p = card.querySelector('p');
    if (h && titles[i]) h.textContent = isFr ? titles[i][0] : titles[i][1];
    if (p && descs[i]) p.textContent = isFr ? descs[i][0] : descs[i][1];
  });
}

function escapeHtml(s) {
  if (s == null) return '';
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function applyGallery(data) {
  if (!data || !data.galleryItems || !data.galleryItems.length) return;
  const lang = getLang();
  const isFr = lang === 'fr';

  const headerTitle = document.querySelector('.gallery-premium .gallery-header-premium h2');
  const headerSub = document.querySelector('.gallery-premium .gallery-header-premium p');
  if (headerTitle) headerTitle.textContent = isFr ? data.galleryTitle_fr : data.galleryTitle_en;
  if (headerSub) headerSub.textContent = isFr ? data.gallerySubtitle_fr : data.gallerySubtitle_en;

  const grid = document.querySelector('.gallery-premium .gallery-grid-premium');
  if (!grid) return;

  // On filtre uniquement les items sans image.
  const items = (data.galleryItems || []).filter((it) => it && it.imageUrl);
  if (items.length === 0) return;

  const svgZoom = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path><path d="M11 8v6"></path><path d="M8 11h6"></path>
  </svg>`;

  grid.innerHTML = items
    .map(
      (item) =>
        `<div class="gallery-item-premium">
          <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(isFr ? item.caption_fr : item.caption_en) || ''}" loading="lazy" decoding="async" data-auto-orient="1">
          <div class="gallery-overlay-premium">
            <span class="gallery-caption-premium">${escapeHtml(isFr ? item.caption_fr : item.caption_en) || ''}</span>
            <div class="gallery-zoom-premium">${svgZoom}</div>
          </div>
        </div>`
    )
    .join('');

  applyOrientationWithin(grid);

  // main.css masque les images lazy tant qu'elles n'ont pas la classe "loaded"
  grid.querySelectorAll('img[loading=\"lazy\"]').forEach((img) => {
    const markLoaded = () => img.classList.add('loaded');
    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
    } else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', markLoaded, { once: true });
    }
  });

  // Permet au script premium (lightbox) de se (ré)initialiser sur galerie injectée.
  window.dispatchEvent(new CustomEvent('galleryUpdated'));
}

function applyResults(data) {
  if (!data) return;
  const lang = getLang();
  const isFr = lang === 'fr';

  const blockquote = document.querySelector('.results-premium blockquote');
  const authorStrong = document.querySelector('.results-premium .quote-author-premium strong');
  const authorSpan = document.querySelector('.results-premium .quote-author-premium span');
  if (blockquote) blockquote.textContent = isFr ? data.quoteText_fr : data.quoteText_en;
  if (authorStrong) authorStrong.textContent = isFr ? data.quoteAuthor_fr : data.quoteAuthor_en;
  if (authorSpan) authorSpan.textContent = isFr ? data.quotePosition_fr : data.quotePosition_en;

  const stats = document.querySelectorAll('.results-stats-premium .stat-item-premium');
  const numbers = [data.stat1Number, data.stat2Number, data.stat3Number];
  const labels = [
    [data.stat1Label_fr, data.stat1Label_en],
    [data.stat2Label_fr, data.stat2Label_en],
    [data.stat3Label_fr, data.stat3Label_en],
  ];
  stats.forEach((stat, i) => {
    const numEl = stat.querySelector('.stat-number-premium');
    const labelEl = stat.querySelector('.stat-label-premium');
    if (numEl && numbers[i] != null) numEl.textContent = numbers[i];
    if (labelEl && labels[i]) labelEl.textContent = isFr ? labels[i][0] : labels[i][1];
  });
}

async function init() {
  const rawSegment = getRawProjectSegmentFromPath();
  const slug = getSlugFromPath();
  if (!slug) return;

  const hasHero = document.querySelector('.project-hero-premium');
  if (!hasHero) return;

  try {
    const data = await fetchQuery(REALISATION_QUERY, { slug });
    if (!data) {
      // Si le slug d'URL ne match pas exactement (accents, tirets, casse),
      // on tente de retrouver la bonne réalisation et de rediriger.
      const redirected = await tryRedirectToClosestSlug(slug);
      if (redirected) return;
      const redirectedByTitle = await tryRedirectByTitle(rawSegment);
      if (redirectedByTitle) return;
      showNotFound(slug);
      return;
    }

    // Même si on a trouvé le doc, on redirige vers l'URL canonique basée sur slug.current
    // (évite les "URLs humaines" / variantes).
    if (data.slug) {
      const canonical = buildProjectUrl(data.slug);
      if (canonical && normalizeProjectPath(canonical) !== normalizeProjectPath(window.location.pathname)) {
        window.location.replace(canonical);
        return;
      }
    }

    applySectionVisibility(data);
    applyHero(data);
    applyMeta(data);
    applyIntro(data);
    applyApproach(data);
    applyFeatures(data);
    applyGallery(data);
    applyResults(data);
  } catch (e) {
    console.warn('Sanity réalisation (projet):', e.message);
  }
}

function runWhenReady() {
  const tryInit = () => {
    if (!document.querySelector('.project-hero-premium')) {
      setTimeout(tryInit, 50);
      return;
    }
    init();
  };
  window.addEventListener('i18nReady', tryInit);
  if (document.documentElement.classList.contains('i18n-ready')) tryInit();
  else setTimeout(tryInit, 400);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runWhenReady);
} else {
  runWhenReady();
}
