/**
 * Helpers: adapt image rendering for portrait vs landscape.
 * Goal: prevent portrait images from being cropped by object-fit: cover / background-size: cover.
 */
 
function computeOrientation(width, height) {
  if (!width || !height) return null;
  return height > width ? 'portrait' : 'landscape';
}

function cssUrl(url) {
  const safe = String(url ?? '').replace(/"/g, '\\"');
  return `url("${safe}")`;
}

function getBestImgUrl(img) {
  return img?.currentSrc || img?.src || '';
}

function setWrapperFill(wrapper, imgUrl, orientation) {
  if (!wrapper) return;
  if (orientation === 'portrait' && imgUrl) {
    wrapper.dataset.imgFill = '1';
    wrapper.style.setProperty('--img-fill-url', cssUrl(imgUrl));
    return;
  }

  // Landscape (or missing url): remove fill
  if (wrapper.dataset.imgFill) delete wrapper.dataset.imgFill;
  wrapper.style.removeProperty('--img-fill-url');
}

export function applyImgOrientation(img) {
  if (!img) return;
  img.dataset.autoOrient = '1';

  const setFromNatural = () => {
    const orientation = computeOrientation(img.naturalWidth, img.naturalHeight);
    if (!orientation) return;
    img.dataset.orientation = orientation;

    // Fill background behind portrait images to avoid visible letterboxing.
    const wrapper = img.parentElement;
    setWrapperFill(wrapper, getBestImgUrl(img), orientation);
  };

  if (img.complete && img.naturalWidth > 0) {
    setFromNatural();
    return;
  }

  img.addEventListener(
    'load',
    () => {
      setFromNatural();
    },
    { once: true }
  );
}

export function applyOrientationWithin(root) {
  if (!root) return;
  const imgs = root.querySelectorAll('img[data-auto-orient="1"]');
  imgs.forEach((img) => applyImgOrientation(img));
}

export function applyBackgroundOrientation(el, imageUrl) {
  if (!el || !imageUrl) return;

  const url = String(imageUrl);
  if (el.dataset.bgOrientUrl === url && el.dataset.bgOrientApplied === '1') return;
  el.dataset.bgOrientUrl = url;
  el.dataset.bgOrientApplied = '0';

  const img = new Image();
  img.decoding = 'async';
  img.loading = 'eager';
  img.src = url;

  img.onload = () => {
    const orientation = computeOrientation(img.naturalWidth, img.naturalHeight);
    if (!orientation) return;

    el.dataset.bgOrientation = orientation;
    el.style.backgroundPosition = 'center';
    el.style.backgroundRepeat = 'no-repeat';

    // Portrait: show full image (no crop). Landscape: keep current cover behavior.
    if (orientation === 'portrait') {
      // Dual layer: bottom cover fills, top contain shows full image (no empty margins visible).
      el.style.backgroundImage = `url(${url}), url(${url})`;
      el.style.backgroundSize = 'cover, contain';
      el.style.backgroundPosition = 'center, center';
      el.style.backgroundRepeat = 'no-repeat, no-repeat';
      el.style.backgroundColor = '';
    } else {
      el.style.backgroundImage = `url(${url})`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundColor = '';
    }

    el.dataset.bgOrientApplied = '1';
  };
}

