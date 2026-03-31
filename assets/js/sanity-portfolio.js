/**
 * Connexion Sanity – Page Réalisations.
 * Injecte pageRealisations : hero, grille de réalisations (références realisation), avis clients.
 */

import { fetchQuery } from './sanity-client.js';

const PAGE_REALISATIONS_QUERY = `*[_id == "pageRealisations"][0]{
  "heroImageUrl": heroImage.asset->url,
  heroTitle_fr, heroTitle_en, heroSubtitle_fr, heroSubtitle_en,
  "realisations": realisationsAffichees[]->{
    "slug": slug.current,
    "previewImageUrl": previewImage.asset->url,
    previewCategory_fr, previewCategory_en,
    previewTitle_fr, previewTitle_en,
    previewLieu_fr, previewLieu_en,
    previewDescription_fr, previewDescription_en
  },
  avis[]{
    etoiles,
    contenu_fr, contenu_en,
    auteur_fr, auteur_en,
    statut_fr, statut_en
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
  const pageTitle = document.querySelector('.portfolio-hero .page-title');
  if (title && pageTitle) pageTitle.textContent = title;

  const subtitle = lang === 'fr' ? data.heroSubtitle_fr : data.heroSubtitle_en;
  const pageSubtitle = document.querySelector('.portfolio-hero .page-subtitle');
  if (subtitle != null && pageSubtitle) pageSubtitle.textContent = subtitle;

  const heroSection = document.querySelector('.portfolio-hero');
  if (data.heroImageUrl && heroSection) {
    heroSection.style.backgroundImage = `url(${data.heroImageUrl})`;
    heroSection.style.backgroundSize = 'cover';
    heroSection.style.backgroundPosition = 'center';
  }
}

function escapeHtml(s) {
  if (s == null) return '';
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function buildProjectCard(realisation, index, lang) {
  const isFr = lang === 'fr';
  const slug = realisation.slug || '';
  const href = slug ? `/pages/projects/${encodeURIComponent(slug)}.html` : '#';
  const num = String(index + 1).padStart(2, '0');

  const title = isFr ? realisation.previewTitle_fr : realisation.previewTitle_en;
  const category = isFr ? realisation.previewCategory_fr : realisation.previewCategory_en;
  const lieu = isFr ? realisation.previewLieu_fr : realisation.previewLieu_en;
  const description = isFr ? realisation.previewDescription_fr : realisation.previewDescription_en;
  const imgUrl = realisation.previewImageUrl || '';
  const imgAlt = title || 'Réalisation';

  return `<a href="${escapeHtml(href)}" class="portfolio-luxury-card">
    <div class="portfolio-luxury-image">
      <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(imgAlt)}" loading="lazy">
      <div class="portfolio-luxury-overlay"></div>
    </div>
    <div class="portfolio-luxury-content">
      <span class="portfolio-luxury-number">${escapeHtml(num)}</span>
      <div class="portfolio-luxury-info">
        <span class="portfolio-luxury-category">${escapeHtml(category || '')}</span>
        <h3 class="portfolio-luxury-title">${escapeHtml(title || '')}</h3>
        <p class="portfolio-luxury-location">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>${escapeHtml(lieu || '')}</span>
        </p>
        <p class="portfolio-luxury-description">${escapeHtml(description || '')}</p>
      </div>
    </div>
  </a>`;
}

function updateCarouselDots(activeIndex) {
  const dots = document.querySelectorAll('.portfolio-carousel-dot');
  dots.forEach((dot, index) => {
    const isActive = index === activeIndex;
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

function initMobilePortfolioCarousel() {
  const grid = document.querySelector('.portfolio-luxury-grid');
  const dotsContainer = document.querySelector('.portfolio-carousel-dots');
  if (!grid || !dotsContainer) return;

  const cards = Array.from(grid.querySelectorAll('.portfolio-luxury-card'));
  dotsContainer.innerHTML = '';

  if (cards.length <= 1) {
    dotsContainer.hidden = true;
    return;
  }

  dotsContainer.hidden = false;

  cards.forEach((card, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'portfolio-carousel-dot';
    dot.setAttribute('aria-label', `Aller à la réalisation ${index + 1}`);
    dot.setAttribute('aria-current', index === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    });
    dotsContainer.appendChild(dot);
  });

  let ticking = false;
  const syncActiveDot = () => {
    const gridLeft = grid.getBoundingClientRect().left;
    let activeIndex = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - gridLeft);
      if (distance < minDistance) {
        minDistance = distance;
        activeIndex = index;
      }
    });

    updateCarouselDots(activeIndex);
    ticking = false;
  };

  grid.addEventListener('scroll', () => {
    if (window.innerWidth > 768 || ticking) return;
    ticking = true;
    window.requestAnimationFrame(syncActiveDot);
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      updateCarouselDots(0);
      return;
    }
    syncActiveDot();
  });

  syncActiveDot();
}

function applyRealisations(data) {
  if (!data || !data.realisations || !data.realisations.length) return;
  const grid = document.querySelector('.portfolio-luxury-grid');
  if (!grid) return;

  const lang = getLang();
  grid.innerHTML = data.realisations.map((r, i) => buildProjectCard(r, i, lang)).join('');
  initMobilePortfolioCarousel();
}

const STAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

function buildAvisCard(avis, lang) {
  const isFr = lang === 'fr';
  const text = isFr ? avis.contenu_fr : avis.contenu_en;
  const author = isFr ? avis.auteur_fr : avis.auteur_en;
  const position = isFr ? avis.statut_fr : avis.statut_en;
  const starsHtml = STAR_SVG.repeat(5);
  return `<article class="testimonial-card">
    <div class="testimonial-stars">${starsHtml}</div>
    <p class="testimonial-text">${escapeHtml(text || '')}</p>
    <div class="testimonial-author">
      <p class="author-name">${escapeHtml(author || '')}</p>
      <p class="author-position">${escapeHtml(position || '')}</p>
    </div>
  </article>`;
}

function applyAvis(data) {
  const section = document.querySelector('.testimonials-section');
  if (!section) return;

  if (!data || !data.avis || !data.avis.length) {
    section.style.display = 'none';
    return;
  }

  section.style.display = '';
  const grid = section.querySelector('.testimonials-grid');
  if (!grid) return;

  const lang = getLang();
  grid.innerHTML = data.avis.map((a) => buildAvisCard(a, lang)).join('');

  data.avis.forEach((a, i) => {
    const card = grid.querySelectorAll('.testimonial-card')[i];
    if (!card || typeof a.etoiles !== 'number') return;
    const starsContainer = card.querySelector('.testimonial-stars');
    if (starsContainer) {
      const stars = starsContainer.querySelectorAll('svg');
      stars.forEach((star, j) => {
        star.style.opacity = j < a.etoiles ? '1' : '0.25';
      });
    }
  });
}

async function init() {
  const path = window.location.pathname.replace(/\/$/, '');
  const isPortfolio = path === '/pages/portfolio.html' || path === '/en/pages/portfolio.html';
  if (!isPortfolio) return;

  const section = document.querySelector('.testimonials-section');
  if (section) section.style.display = 'none';

  try {
    const data = await fetchQuery(PAGE_REALISATIONS_QUERY);
    if (!data) return;
    applyHero(data);
    applyRealisations(data);
    applyAvis(data);
  } catch (e) {
    console.warn('Sanity page Réalisations:', e.message);
  }
}

function runWhenReady() {
  const tryInit = () => {
    if (!document.querySelector('.portfolio-hero')) {
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
