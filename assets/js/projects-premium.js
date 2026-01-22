/**
 * Projects Premium - JavaScript enhancements
 * Lightbox, animations au scroll, et interactions
 */

(function() {
    'use strict';

    // === INITIALISATION ===
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initHeroAnimation();
        initScrollAnimations();
        initLightbox();
        initCounterAnimation();
        initParallax();
    }

    // === HERO ANIMATION ===
    function initHeroAnimation() {
        const hero = document.querySelector('.project-hero-premium');
        if (!hero) return;

        // Ajouter la classe loaded après un court délai pour l'animation
        setTimeout(() => {
            hero.classList.add('loaded');
        }, 100);
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

    // === LIGHTBOX GALERIE ===
    function initLightbox() {
        const galleryItems = document.querySelectorAll('.gallery-item-premium');
        if (galleryItems.length === 0) return;

        // Créer la structure lightbox
        const lightbox = createLightboxElement();
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('.lightbox-image-premium');
        const closeBtn = lightbox.querySelector('.lightbox-close-premium');
        const prevBtn = lightbox.querySelector('.lightbox-prev-premium');
        const nextBtn = lightbox.querySelector('.lightbox-next-premium');
        const counter = lightbox.querySelector('.lightbox-counter-premium');

        let currentIndex = 0;
        const images = Array.from(galleryItems).map(item => {
            const img = item.querySelector('img');
            return {
                src: img.src,
                alt: img.alt
            };
        });

        // Ouvrir lightbox au clic
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                openLightbox();
            });
        });

        // Fermer lightbox
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Navigation
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigate(-1);
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigate(1);
        });

        // Clavier
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigate(-1);
                    break;
                case 'ArrowRight':
                    navigate(1);
                    break;
            }
        });

        // Touch swipe pour mobile
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    navigate(1);
                } else {
                    navigate(-1);
                }
            }
        }

        function openLightbox() {
            updateImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function navigate(direction) {
            currentIndex += direction;
            if (currentIndex < 0) currentIndex = images.length - 1;
            if (currentIndex >= images.length) currentIndex = 0;
            updateImage();
        }

        function updateImage() {
            lightboxImg.src = images[currentIndex].src;
            lightboxImg.alt = images[currentIndex].alt;
            counter.textContent = `${currentIndex + 1} / ${images.length}`;
        }
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

    // === EFFET PARALLAX HERO ===
    function initParallax() {
        const hero = document.querySelector('.project-hero-premium');
        if (!hero) return;

        const heroImage = hero.querySelector('.hero-media img');
        if (!heroImage) return;

        let ticking = false;

        function updateParallax() {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;

            if (scrolled < heroHeight) {
                const parallaxValue = scrolled * 0.4;
                heroImage.style.transform = `scale(1) translateY(${parallaxValue}px)`;
            }

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

})();
