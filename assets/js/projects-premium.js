/**
 * Projects Premium - JavaScript enhancements
 * Lightbox, animations au scroll, et interactions
 */

(function() {
    'use strict';

    // === INITIALISATION ===
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initScrollAnimations();
        initLightbox();
        initCounterAnimation();
    }

    // === ANIMATIONS AU SCROLL ===
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observer les éléments à animer
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });

        // Animation automatique des sections
        const sections = document.querySelectorAll(
            '.meta-item-premium, .cs-card-premium, .feature-card-premium, ' +
            '.timeline-step-premium, .gallery-item-premium, .stat-item-premium'
        );

        sections.forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            el.classList.add(`delay-${(index % 4) + 1}`);
            observer.observe(el);
        });
    }

    // Ré-initialise l'observer pour les éléments injectés dynamiquement (ex: galerie Sanity)
    function initScrollAnimationsForNewElements() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.gallery-item-premium:not(.animate-on-scroll)').forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            el.classList.add(`delay-${(index % 4) + 1}`);
            observer.observe(el);
        });
    }

    // === LIGHTBOX GALERIE ===
    // Singleton lightbox avec délégation d'événements — fonctionne même quand
    // les images sont injectées après coup par Sanity.
    var lightboxState = {
        el: null,
        img: null,
        counter: null,
        currentIndex: 0,
        touchStartX: 0,
        initialized: false
    };

    function getGalleryImages() {
        return Array.from(document.querySelectorAll('.gallery-item-premium img'))
            .map(img => ({ src: img.src, alt: img.alt }))
            .filter(i => i.src);
    }

    function openLightbox(index) {
        var s = lightboxState;
        s.currentIndex = index;
        updateLightboxImage();
        s.el.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxState.el.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        var s = lightboxState;
        var images = getGalleryImages();
        if (images.length === 0) return;
        s.currentIndex += direction;
        if (s.currentIndex < 0) s.currentIndex = images.length - 1;
        if (s.currentIndex >= images.length) s.currentIndex = 0;
        updateLightboxImage();
    }

    function updateLightboxImage() {
        var s = lightboxState;
        var images = getGalleryImages();
        if (images.length === 0) return;
        if (s.currentIndex >= images.length) s.currentIndex = images.length - 1;
        s.img.src = images[s.currentIndex].src;
        s.img.alt = images[s.currentIndex].alt;
        s.counter.textContent = (s.currentIndex + 1) + ' / ' + images.length;
    }

    function initLightbox() {
        var s = lightboxState;

        // Créer la lightbox une seule fois
        if (!s.el) {
            s.el = createLightboxElement();
            document.body.appendChild(s.el);
            s.img = s.el.querySelector('.lightbox-image-premium');
            s.counter = s.el.querySelector('.lightbox-counter-premium');

            // Fermer via le fond ou le bouton close
            s.el.querySelector('.lightbox-close-premium').addEventListener('click', closeLightbox);
            s.el.addEventListener('click', function(e) {
                if (e.target === s.el) closeLightbox();
            });

            // Navigation boutons
            s.el.querySelector('.lightbox-prev-premium').addEventListener('click', function(e) {
                e.stopPropagation();
                navigateLightbox(-1);
            });
            s.el.querySelector('.lightbox-next-premium').addEventListener('click', function(e) {
                e.stopPropagation();
                navigateLightbox(1);
            });

            // Clavier
            document.addEventListener('keydown', function(e) {
                if (!s.el.classList.contains('active')) return;
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') navigateLightbox(-1);
                if (e.key === 'ArrowRight') navigateLightbox(1);
            });

            // Touch swipe
            s.el.addEventListener('touchstart', function(e) {
                s.touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            s.el.addEventListener('touchend', function(e) {
                var diff = s.touchStartX - e.changedTouches[0].screenX;
                if (Math.abs(diff) > 50) navigateLightbox(diff > 0 ? 1 : -1);
            }, { passive: true });
        }

        // Délégation : on écoute les clics sur le conteneur de galerie pour gérer
        // les items injectés à n'importe quel moment, sans rebinder chaque item.
        var grids = document.querySelectorAll('.gallery-grid-premium');
        grids.forEach(function(grid) {
            if (grid.dataset.lightboxDelegate === '1') return;
            grid.dataset.lightboxDelegate = '1';
            grid.addEventListener('click', function(e) {
                var item = e.target.closest('.gallery-item-premium');
                if (!item) return;
                var allItems = Array.from(document.querySelectorAll('.gallery-item-premium'));
                var index = allItems.indexOf(item);
                if (index !== -1) openLightbox(index);
            });
        });
    }

    function createLightboxElement() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-premium';
        lightbox.innerHTML = `
            <button class="lightbox-close-premium" aria-label="Fermer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <button class="lightbox-nav-premium lightbox-prev-premium" aria-label="Image précédente">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            <img class="lightbox-image-premium" src="" alt="">
            <button class="lightbox-nav-premium lightbox-next-premium" aria-label="Image suivante">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
            <div class="lightbox-counter-premium"></div>
        `;
        return lightbox;
    }

    // Ré-init lightbox quand la galerie est injectée par Sanity
    window.addEventListener('galleryUpdated', () => {
        initScrollAnimationsForNewElements();
        initLightbox();
    });

    // === ANIMATION DES COMPTEURS ===
    function initCounterAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number-premium');
        if (statNumbers.length === 0) return;

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(el => observer.observe(el));
    }

    function animateCounter(element) {
        const text = element.textContent;
        const match = text.match(/(\d+)/);
        if (!match) return;

        const target = parseInt(match[1], 10);
        const suffix = text.replace(match[1], '');
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function pour une animation plus naturelle
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);

            element.innerHTML = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

})();
