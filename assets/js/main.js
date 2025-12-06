// ===================================
// NAVIGATION & MOBILE MENU
// ===================================

const navbar = document.getElementById('navbar');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll effect for navbar with luxury animations
let lastScroll = 0;
const pageHero = document.querySelector('.page-hero');
const homeHero = document.querySelector('.hero');
const hasHero = pageHero !== null || homeHero !== null;
const heroSection = pageHero || homeHero;

// Initialize navbar state
if (hasHero && window.pageYOffset === 0) {
    navbar.classList.add('navbar-transparent');
}

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Handle transparent navbar for pages with hero sections
    if (hasHero && heroSection) {
        const heroHeight = heroSection.offsetHeight;

        if (currentScroll < heroHeight - 100) {
            // We're still in the hero section
            navbar.classList.add('navbar-transparent');
            navbar.classList.remove('scrolled');
        } else {
            // We've scrolled past the hero section
            navbar.classList.remove('navbar-transparent');
            navbar.classList.add('scrolled');
        }
    } else {
        // No hero section, use standard behavior
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    lastScroll = currentScroll;
});

// Logo image hover effect (if needed, can be customized)
const logoImage = document.querySelector('.logo-image');
if (logoImage) {
    logoImage.parentElement.addEventListener('mouseenter', () => {
        logoImage.style.opacity = '0.9';
    });

    logoImage.parentElement.addEventListener('mouseleave', () => {
        logoImage.style.opacity = '1';
    });
}

// Mobile menu toggle
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');

        // Animate hamburger
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (mobileMenuToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(7px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');

        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ===================================
// ACTIVE NAVIGATION LINK
// ===================================

function setActiveNavLink() {
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = new URL(link.href).pathname;

        if (linkPath === currentPath ||
            (currentPath === '/' && linkPath === '/') ||
            (currentPath.includes(linkPath) && linkPath !== '/')) {
            link.classList.add('active');
        }
    });
}

setActiveNavLink();

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 90;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, observerOptions);

// Animate elements on scroll
const animateOnScroll = document.querySelectorAll(
    '.expertise-card, .portfolio-item, .value-item, .intro-text, .intro-image'
);

animateOnScroll.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// PORTFOLIO HOVER EFFECT
// ===================================

const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });

    item.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// ===================================
// LAZY LOADING IMAGES
// ===================================

if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===================================
// LANGUAGE SWITCHER
// ===================================

const langButtons = document.querySelectorAll('.lang-btn');

langButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const selectedLang = this.getAttribute('data-lang');

        // Remove active class from all buttons
        langButtons.forEach(b => b.classList.remove('active'));

        // Add active class to clicked button
        this.classList.add('active');

        // Store language preference
        localStorage.setItem('preferredLanguage', selectedLang);

        // Switch language content
        switchLanguage(selectedLang);
    });
});

function switchLanguage(lang) {
    // This is a placeholder for language switching functionality
    // In a real implementation, this would update all text content
    console.log(`Switching to language: ${lang}`);

    // Example: Update page language attribute
    document.documentElement.lang = lang;

    // You could implement this with:
    // 1. Data attributes on elements
    // 2. Fetching translations from a JSON file
    // 3. Loading different HTML pages
}

// Check for saved language preference on page load
const savedLang = localStorage.getItem('preferredLanguage');
if (savedLang) {
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === savedLang) {
            btn.classList.add('active');
        }
    });
    switchLanguage(savedLang);
}

// ===================================
// FIXED CONTACT BUTTON VISIBILITY
// ===================================

const fixedContactBtn = document.querySelector('.fixed-contact-btn');

window.addEventListener('scroll', () => {
    // Hide button when at the bottom of the page (near footer)
    const footer = document.querySelector('.footer');
    if (footer) {
        const footerTop = footer.offsetTop;
        const windowBottom = window.pageYOffset + window.innerHeight;

        if (windowBottom >= footerTop - 100) {
            fixedContactBtn.style.opacity = '0';
            fixedContactBtn.style.pointerEvents = 'none';
        } else {
            fixedContactBtn.style.opacity = '1';
            fixedContactBtn.style.pointerEvents = 'auto';
        }
    }
});

// ===================================
// PERFORMANCE OPTIMIZATIONS
// ===================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScroll = debounce(() => {
    // Any additional scroll-based functionality can go here
}, 100);

window.addEventListener('scroll', optimizedScroll);

// ===================================
// PRELOAD CRITICAL IMAGES
// ===================================

function preloadImages() {
    const criticalImages = [
        '/assets/images/hero-bg.jpg',
        '/assets/images/intro-placeholder.jpg'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Preload after page load
if (document.readyState === 'complete') {
    preloadImages();
} else {
    window.addEventListener('load', preloadImages);
}

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});

// Focus trap for mobile menu
if (mobileMenuToggle) {
    navMenu.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const focusableElements = navMenu.querySelectorAll('a, button');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// ===================================
// ENHANCED SCROLL ANIMATIONS
// ===================================

const observerOptionsEnhanced = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const enhancedObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');

            // Add specific animation classes based on element type
            if (entry.target.classList.contains('service-card')) {
                entry.target.classList.add('fade-in-up');
            } else if (entry.target.classList.contains('portfolio-card')) {
                entry.target.classList.add('scale-in');
            } else if (entry.target.classList.contains('testimonial-card')) {
                entry.target.classList.add('fade-in-up');
            }
        }
    });
}, observerOptionsEnhanced);

// Observe all animated elements
const animatedElements = document.querySelectorAll(
    '.service-card, .portfolio-card, .testimonial-card, ' +
    '.faq-item, .process-step, .area-card, .value-card, ' +
    '.stat-item, .timeline-item, .expertise-card'
);

animatedElements.forEach((el, index) => {
    el.classList.add('animate-on-scroll');
    el.style.animationDelay = `${index * 0.1}s`;
    enhancedObserver.observe(el);
});

// ===================================
// PARALLAX EFFECT
// ===================================

const parallaxSections = document.querySelectorAll('.parallax-section');

window.addEventListener('scroll', () => {
    parallaxSections.forEach(section => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        section.style.transform = `translateY(${rate}px)`;
    });
});

// ===================================
// IMAGE REVEAL ON SCROLL
// ===================================

const imageRevealElements = document.querySelectorAll('.image-reveal');

const imageRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            imageRevealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

imageRevealElements.forEach(el => {
    imageRevealObserver.observe(el);
});

// ===================================
// PORTFOLIO FILTER FUNCTIONALITY
// ===================================

const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter portfolio items
        portfolioCards.forEach(card => {
            const category = card.getAttribute('data-category');

            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ===================================
// NUMBER COUNTER ANIMATION
// ===================================

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// ===================================
// ENHANCED CARD HOVER EFFECTS
// ===================================

const cards3D = document.querySelectorAll('.card-3d');

cards3D.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===================================
// SMOOTH PAGE TRANSITIONS
// ===================================

document.querySelectorAll('a:not([target="_blank"])').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.hostname === window.location.hostname && !this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const href = this.getAttribute('href');

            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease';

            setTimeout(() => {
                window.location.href = href;
            }, 300);
        }
    });
});

// Fade in on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===================================
// BEFORE/AFTER SLIDER
// ===================================

const beforeAfterSlider = document.querySelector('.before-after-slider');
if (beforeAfterSlider) {
    const handle = beforeAfterSlider.querySelector('.slider-handle');
    const afterImage = beforeAfterSlider.querySelector('.after-image');
    let isSliding = false;

    handle.addEventListener('mousedown', () => {
        isSliding = true;
    });

    document.addEventListener('mouseup', () => {
        isSliding = false;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isSliding) return;

        const rect = beforeAfterSlider.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = (x / rect.width) * 100;

        if (percent >= 0 && percent <= 100) {
            handle.style.left = percent + '%';
            afterImage.style.width = percent + '%';
        }
    });

    // Touch events for mobile
    handle.addEventListener('touchstart', () => {
        isSliding = true;
    });

    document.addEventListener('touchend', () => {
        isSliding = false;
    });

    document.addEventListener('touchmove', (e) => {
        if (!isSliding) return;

        const touch = e.touches[0];
        const rect = beforeAfterSlider.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const percent = (x / rect.width) * 100;

        if (percent >= 0 && percent <= 100) {
            handle.style.left = percent + '%';
            afterImage.style.width = percent + '%';
        }
    });
}

// ===================================
// FORM VALIDATION & ANIMATION
// ===================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const formInputs = contactForm.querySelectorAll('input, textarea, select');

    // Add floating label effect
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });

        // Check if already has value on page load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });

    // Form submission with animation
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Animate button
        submitBtn.innerHTML = '<span class="loading">Envoi en cours...</span>';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            submitBtn.innerHTML = '✓ Message envoyé !';
            submitBtn.style.background = '#4ade80';

            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '';
            }, 3000);
        }, 2000);
    });
}

// ===================================
// STAGGER ANIMATION FOR LISTS
// ===================================

function staggerAnimation(selector, animationClass = 'fade-in-up') {
    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('li, .item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add(animationClass);
                    }, index * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));
}

// Apply to service lists, value items, etc.
staggerAnimation('.service-list');
staggerAnimation('.values-grid');
staggerAnimation('.process-timeline');

// ===================================
// MOUSE FOLLOW EFFECT (OPTIONAL)
// ===================================

const mouseFollow = document.createElement('div');
mouseFollow.className = 'mouse-follow';
document.body.appendChild(mouseFollow);

document.addEventListener('mousemove', (e) => {
    mouseFollow.style.left = e.clientX + 'px';
    mouseFollow.style.top = e.clientY + 'px';
});

// Activate on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .portfolio-card, .expertise-card');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        mouseFollow.classList.add('active');
    });

    el.addEventListener('mouseleave', () => {
        mouseFollow.classList.remove('active');
    });
});

// ===================================
// IMAGE LAZY LOADING WITH FADE IN
// ===================================

const lazyImages = document.querySelectorAll('img[loading="lazy"]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.6s ease';

            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });

            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ===================================
// FOOTER LUXURY ANIMATIONS
// ===================================

// Footer logo animation (simplified for image logo)
const footerLogo = document.querySelector('.footer-logo-image');
if (footerLogo) {
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transition = 'opacity 0.6s ease';
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                }, 100);
                footerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    footerObserver.observe(footerLogo);
}

// Stagger animation for footer links
const footerLinks = document.querySelectorAll('.footer-links li');
footerLinks.forEach((link, index) => {
    link.style.opacity = '0';
    link.style.transform = 'translateY(10px)';
    link.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    link.style.transitionDelay = `${index * 0.1}s`;
});

const footerLinksObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const links = entry.target.querySelectorAll('li');
            links.forEach(link => {
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            });
            footerLinksObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.footer-links').forEach(list => {
    footerLinksObserver.observe(list);
});

// ===================================
// FAQ ACCORDION
// ===================================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other FAQ items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        if (isActive) {
            item.classList.remove('active');
        } else {
            item.classList.add('active');
        }
    });
});

// Open first FAQ item by default
if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
}

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c✨ Site développé avec soin pour Alexandre CHALIGNÉ',
    'color: #8b7355; font-size: 16px; font-weight: bold;');
console.log('%cArtisan Plâtrier d\'Exception',
    'color: #666; font-size: 12px;');
