/**
 * Connexion Sanity – Footer (toutes les pages).
 * Injecte le document footer : France (adresse, tél, horaires), Suisse (id.), Contact (email, LinkedIn).
 */

import { fetchQuery } from './sanity-client.js';

const FOOTER_QUERY = `*[_id == "footer"][0]{
  franceAddress, francePhone, franceHours,
  suisseAddress, suissePhone, suisseHours,
  contactEmail, linkedinUrl
}`;

function applyFooter(data) {
  if (!data) return;

  const cols = document.querySelectorAll('.footer .footer-grid .footer-col');
  if (cols.length < 4) return;

  // Col France (index 1)
  const franceCol = cols[1];
  const franceItems = franceCol.querySelectorAll('.footer-contact li');
  if (franceItems.length >= 3) {
    if (data.franceAddress && franceItems[0].querySelector('span')) {
      franceItems[0].querySelector('span').innerHTML = data.franceAddress.replace(/\n/g, '<br>');
    }
    if (data.francePhone) {
      const phoneLink = franceItems[1].querySelector('a');
      if (phoneLink) {
        phoneLink.href = `tel:${data.francePhone.replace(/\s/g, '')}`;
        phoneLink.textContent = data.francePhone;
      }
    }
    if (data.franceHours && franceItems[2].querySelector('span')) {
      franceItems[2].querySelector('span').innerHTML = data.franceHours.replace(/\n/g, '<br>');
    }
  }

  // Col Suisse (index 2)
  const suisseCol = cols[2];
  const suisseItems = suisseCol.querySelectorAll('.footer-contact li');
  if (suisseItems.length >= 3) {
    if (data.suisseAddress && suisseItems[0].querySelector('span')) {
      suisseItems[0].querySelector('span').innerHTML = data.suisseAddress.replace(/\n/g, '<br>');
    }
    if (data.suissePhone) {
      const phoneLink = suisseItems[1].querySelector('a');
      if (phoneLink) {
        phoneLink.href = `tel:${data.suissePhone.replace(/\s/g, '')}`;
        phoneLink.textContent = data.suissePhone;
      }
    }
    if (data.suisseHours && suisseItems[2].querySelector('span')) {
      suisseItems[2].querySelector('span').innerHTML = data.suisseHours.replace(/\n/g, '<br>');
    }
  }

  // Col Contact (index 3)
  const contactCol = cols[3];
  const contactItems = contactCol.querySelectorAll('.footer-contact li');
  if (data.contactEmail && contactItems[0]) {
    const emailLink = contactItems[0].querySelector('a');
    if (emailLink) {
      emailLink.href = `mailto:${data.contactEmail}`;
      emailLink.textContent = data.contactEmail;
    }
  }
  if (data.linkedinUrl && contactItems[1]) {
    const linkedinLink = contactItems[1].querySelector('a');
    if (linkedinLink) linkedinLink.href = data.linkedinUrl;
  }
}

async function init() {
  if (!document.querySelector('.footer')) return;
  try {
    const data = await fetchQuery(FOOTER_QUERY);
    applyFooter(data);
  } catch (e) {
    console.warn('Sanity footer:', e.message);
  }
}

function runWhenReady() {
  const tryInit = () => {
    if (!document.querySelector('.footer .footer-grid')) {
      setTimeout(tryInit, 50);
      return;
    }
    init();
  };
  window.addEventListener('i18nReady', tryInit);
  if (document.documentElement.classList.contains('i18n-ready')) {
    tryInit();
  } else {
    setTimeout(tryInit, 300);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runWhenReady);
} else {
  runWhenReady();
}
