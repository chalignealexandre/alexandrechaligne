// ===================================
// UX ENHANCEMENTS - PREMIUM INTERACTIONS
// Expert-level micro-interactions and animations
// ===================================

// ===================================
// HERO WORD REVEAL ANIMATION
// ===================================

function initHeroWordReveal() {
    const heroWords = document.querySelectorAll('.hero-word');

    heroWords.forEach((word, index) => {
        const text = word.getAttribute('data-word');
        word.style.animationDelay = `${0.3 + (index * 0.15)}s`;
    });
}

// ===================================
// HERO SCROLL INDICATOR
// ===================================

function initHeroScrollIndicator() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (!scrollIndicator) return;

    scrollIndicator.addEventListener('click', () => {
        const introSection = document.querySelector('.intro-section');
        if (introSection) {
            const offsetTop = introSection.offsetTop - 90;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });

    // Hide scroll indicator when scrolling
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '0.7';
        }

        lastScroll = currentScroll;
    });
}

// ===================================
// PARALLAX EFFECT FOR HERO DECORATIONS
// ===================================

function initHeroParallax() {
    const decorations = document.querySelectorAll('.hero-decoration');
    if (decorations.length === 0) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = document.querySelector('.hero-v2')?.offsetHeight || 0;

        if (scrolled < heroHeight) {
            decorations.forEach((decoration, index) => {
                const speed = 0.3 + (index * 0.1);
                const yPos = scrolled * speed;
                decoration.style.transform = `translateY(${yPos}px)`;
            });
        }
    });
}

// ===================================
// INTRO SECTION ANIMATIONS
// ===================================

function initIntroAnimations() {
    const introSection = document.querySelector('.intro-section');
    if (!introSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate stats counter
                const stats = entry.target.querySelectorAll('.intro-stat-number');
                stats.forEach(stat => {
                    animateCounter(stat);
                });

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    observer.observe(introSection);
}

// ===================================
// ANIMATED COUNTER
// ===================================

function animateCounter(element) {
    const text = element.textContent;
    const target = parseInt(text.replace(/\D/g, ''));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };

    updateCounter();
}

// ===================================
// ENHANCED CARD HOVER EFFECTS
// ===================================

function initEnhancedCardHovers() {
    // Only apply 3D effect to expertise-card and bento-item, not value-card-luxury
    const cards = document.querySelectorAll('.expertise-card, .bento-item');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const angleX = (y - centerY) / 30;
            const angleY = (centerX - x) / 30;

            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
        });

        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const angleX = (y - centerY) / 30;
            const angleY = (centerX - x) / 30;

            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ===================================
// SMOOTH REVEAL ANIMATIONS
// ===================================

function initSmoothReveal() {
    const elements = document.querySelectorAll('.section-header, .intro-badge, .intro-title, .intro-description-wrapper');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===================================
// INTRO IMAGE PARALLAX
// ===================================

function initIntroImageParallax() {
    const introImage = document.querySelector('.intro-image img');
    if (!introImage) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                window.addEventListener('scroll', () => {
                    const rect = entry.target.getBoundingClientRect();
                    const scrolled = window.pageYOffset;
                    const elementTop = rect.top + scrolled;
                    const windowHeight = window.innerHeight;

                    if (scrolled + windowHeight > elementTop && scrolled < elementTop + rect.height) {
                        const offset = ((scrolled + windowHeight - elementTop) / (windowHeight + rect.height)) * 100;
                        const translateY = (offset - 50) * 0.3;
                        introImage.style.transform = `translateY(${translateY}px) scale(1.05)`;
                    }
                });
            }
        });
    }, { threshold: 0.1 });

    observer.observe(introImage.parentElement);
}

// ===================================
// MAGNETIC BUTTONS
// ===================================

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.hero-btn, .btn');

    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const moveX = x * 0.1;
            const moveY = y * 0.1;

            button.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// ===================================
// ADVANCED CURSOR FOLLOWER
// ===================================

function initAdvancedCursor() {
    // Only on desktop
    if (window.innerWidth < 1024) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-outline"></div>';
    document.body.appendChild(cursor);

    const cursorDot = cursor.querySelector('.cursor-dot');
    const cursorOutline = cursor.querySelector('.cursor-outline');

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let outlineX = 0;
    let outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // Smooth follow for dot
        cursorX += (mouseX - cursorX) * 0.3;
        cursorY += (mouseY - cursorY) * 0.3;

        // Slower follow for outline
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;

        cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;

        requestAnimationFrame(animate);
    }
    animate();

    // Scale on hover
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .expertise-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });

    // Add cursor styles
    const style = document.createElement('style');
    style.textContent = `
        .custom-cursor {
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 10000;
            mix-blend-mode: difference;
        }

        .cursor-dot {
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            position: absolute;
            transform: translate(-50%, -50%);
            transition: width 0.3s ease, height 0.3s ease;
        }

        .cursor-outline {
            width: 30px;
            height: 30px;
            border: 2px solid white;
            border-radius: 50%;
            position: absolute;
            transform: translate(-50%, -50%);
            transition: width 0.3s ease, height 0.3s ease;
        }

        .custom-cursor.cursor-hover .cursor-dot {
            width: 16px;
            height: 16px;
        }

        .custom-cursor.cursor-hover .cursor-outline {
            width: 50px;
            height: 50px;
        }

        * {
            cursor: none !important;
        }

        @media (max-width: 1024px) {
            .custom-cursor {
                display: none;
            }
            * {
                cursor: auto !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// PERFORMANCE: THROTTLE SCROLL EVENTS
// ===================================

function throttle(func, wait) {
    let timeout;
    let lastRan;

    return function executedFunction(...args) {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if ((Date.now() - lastRan) >= wait) {
                    func.apply(this, args);
                    lastRan = Date.now();
                }
            }, wait - (Date.now() - lastRan));
        }
    };
}

// ===================================
// INITIALIZE ALL ENHANCEMENTS
// ===================================

function initAllEnhancements() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

function init() {
    console.log('🎨 Initializing premium UX enhancements...');

    // Initialize all features
    initHeroWordReveal();
    initHeroScrollIndicator();
    initHeroParallax();
    initIntroAnimations();
    initEnhancedCardHovers();
    initSmoothReveal();
    initIntroImageParallax();
    initMagneticButtons();
    // Uncomment if you want the custom cursor
    // initAdvancedCursor();

    console.log('✨ UX enhancements loaded successfully!');
}

// Run initialization
initAllEnhancements();

// ===================================
// EXPORT FOR POTENTIAL MODULE USE
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initHeroWordReveal,
        initHeroScrollIndicator,
        initHeroParallax,
        initIntroAnimations,
        initEnhancedCardHovers,
        initSmoothReveal,
        initIntroImageParallax,
        initMagneticButtons,
        initAdvancedCursor
    };
}
