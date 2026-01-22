/**
 * i18n Module - Multilingual Support for Alexandre CHALIGNÉ Website
 * Handles language switching between French and English
 *
 * Features:
 * - URL-based language detection (/en/ prefix for English)
 * - localStorage persistence
 * - Browser language detection for first visit
 * - Dynamic content translation via data-i18n attributes
 * - Meta tags translation
 * - No page reload needed for same-language pages
 */

class I18n {
    constructor() {
        this.translations = {};
        this.currentLang = 'fr';
        this.fallbackLang = 'fr';
        this.supportedLangs = ['fr', 'en'];
        this.isLoaded = false;
    }

    /**
     * Detect current language from URL, localStorage, or browser settings
     */
    detectLanguage() {
        // 1. Check URL path for /en/ prefix
        if (window.location.pathname.startsWith('/en/') || window.location.pathname === '/en') {
            return 'en';
        }

        // 2. Check localStorage for saved preference
        const stored = localStorage.getItem('preferredLanguage');
        if (stored && this.supportedLangs.includes(stored)) {
            // If stored is 'en' but we're not on /en/ path, redirect
            if (stored === 'en' && !window.location.pathname.startsWith('/en')) {
                // Don't redirect automatically, just use the URL language
                return 'fr';
            }
            return stored;
        }

        // 3. Default to French
        return 'fr';
    }

    /**
     * Initialize the i18n system
     */
    async init() {
        this.currentLang = this.detectLanguage();

        try {
            await this.loadTranslations(this.currentLang);
            this.applyTranslations();
            this.setupSwitcher();
            this.updateHtmlLang();
            this.isLoaded = true;

            // Add ready class to enable CSS transitions
            document.documentElement.classList.add('i18n-ready');

            // Dispatch custom event for other scripts
            window.dispatchEvent(new CustomEvent('i18nReady', {
                detail: { lang: this.currentLang }
            }));

        } catch (error) {
            console.error('i18n initialization failed:', error);
            // Ensure content is visible even if translation fails
            document.documentElement.classList.add('i18n-ready');
        }
    }

    /**
     * Load translations from JSON file
     */
    async loadTranslations(lang) {
        const basePath = window.location.pathname.startsWith('/en') ? '/locales/' : '/locales/';
        const url = `${basePath}${lang}.json`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang}.json: ${response.status}`);
            }
            this.translations = await response.json();
        } catch (error) {
            console.error(`Error loading translations for ${lang}:`, error);
            // Try fallback language
            if (lang !== this.fallbackLang) {
                console.log(`Falling back to ${this.fallbackLang}`);
                await this.loadTranslations(this.fallbackLang);
            }
        }
    }

    /**
     * Get translation by dot-notation key
     */
    get(key) {
        if (!key) return '';

        const keys = key.split('.');
        let result = this.translations;

        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                // Return the key itself if translation not found
                console.warn(`Translation not found for key: ${key}`);
                return key;
            }
        }

        return result;
    }

    /**
     * Apply all translations to the DOM
     */
    applyTranslations() {
        // 1. Translate text content (data-i18n)
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const text = this.get(key);

            if (el.dataset.i18nHtml === 'true') {
                el.innerHTML = text;
            } else {
                el.textContent = text;
            }
        });

        // 2. Translate placeholders (data-i18n-placeholder)
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            el.placeholder = this.get(key);
        });

        // 3. Translate alt attributes (data-i18n-alt)
        document.querySelectorAll('[data-i18n-alt]').forEach(el => {
            const key = el.dataset.i18nAlt;
            el.alt = this.get(key);
        });

        // 4. Translate title attributes (data-i18n-title)
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.dataset.i18nTitle;
            el.title = this.get(key);
        });

        // 5. Translate aria-label attributes (data-i18n-aria-label)
        document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
            const key = el.dataset.i18nAriaLabel;
            el.setAttribute('aria-label', this.get(key));
        });

        // 6. Update meta tags
        this.updateMetaTags();

        // 7. Update links for language prefix
        this.updateLinks();
    }

    /**
     * Update meta tags with translations
     */
    updateMetaTags() {
        const page = this.detectPage();
        const meta = this.get(`${page}.meta`);

        if (!meta || typeof meta !== 'object') return;

        // Update title
        if (meta.title) {
            document.title = meta.title;
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.setAttribute('content', meta.title);
        }

        // Update description
        if (meta.description) {
            const descEl = document.querySelector('meta[name="description"]');
            if (descEl) descEl.setAttribute('content', meta.description);

            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) ogDesc.setAttribute('content', meta.og_description || meta.description);
        }
    }

    /**
     * Detect which page we're on based on URL
     */
    detectPage() {
        let path = window.location.pathname;

        // Remove /en prefix if present
        if (path.startsWith('/en/')) {
            path = path.substring(3);
        } else if (path === '/en') {
            path = '/';
        }

        // Remove trailing .html
        path = path.replace(/\.html$/, '');

        // Remove leading slash and normalize
        path = path.replace(/^\//, '').replace(/\/$/, '');

        // Map paths to translation keys
        const pageMap = {
            '': 'home',
            'index': 'home',
            'pages/about': 'about',
            'pages/services': 'services',
            'pages/portfolio': 'portfolio',
            'pages/contact': 'contact',
            'pages/projects/villa-vandoeuvres': 'project_villa',
            'pages/projects/chateau-glana': 'project_glana',
            'pages/mentions-legales': 'legal',
            'pages/politique-confidentialite': 'privacy'
        };

        return pageMap[path] || 'home';
    }

    /**
     * Update internal links with language prefix
     */
    updateLinks() {
        if (this.currentLang === 'en') {
            // Update internal links to include /en/ prefix
            document.querySelectorAll('a[href^="/"]').forEach(link => {
                const href = link.getAttribute('href');
                // Don't modify if already has /en/ or is an asset/locales path
                if (!href.startsWith('/en') &&
                    !href.startsWith('/assets') &&
                    !href.startsWith('/locales')) {
                    link.setAttribute('href', '/en' + href);
                }
            });
        }
    }

    /**
     * Update HTML lang attribute
     */
    updateHtmlLang() {
        document.documentElement.lang = this.currentLang;
        document.documentElement.dataset.lang = this.currentLang;
    }

    /**
     * Switch to a different language
     */
    switchLanguage(lang) {
        if (!this.supportedLangs.includes(lang)) {
            console.error(`Unsupported language: ${lang}`);
            return;
        }

        // Save preference
        localStorage.setItem('preferredLanguage', lang);

        // Build new URL
        let currentPath = window.location.pathname;
        let newPath;

        if (lang === 'en') {
            // Add /en/ prefix if not present
            if (!currentPath.startsWith('/en')) {
                newPath = '/en' + (currentPath === '/' ? '/' : currentPath);
            } else {
                newPath = currentPath;
            }
        } else {
            // Remove /en/ prefix
            if (currentPath.startsWith('/en/')) {
                newPath = currentPath.substring(3);
            } else if (currentPath === '/en') {
                newPath = '/';
            } else {
                newPath = currentPath;
            }
        }

        // Redirect to new URL
        if (newPath !== currentPath) {
            window.location.href = newPath;
        }
    }

    /**
     * Setup language switcher buttons
     */
    setupSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');

        langButtons.forEach(btn => {
            const btnLang = btn.dataset.lang;

            // Set active state
            btn.classList.toggle('active', btnLang === this.currentLang);

            // Add click handler
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (btnLang !== this.currentLang) {
                    this.switchLanguage(btnLang);
                }
            });
        });
    }

    /**
     * Get current language
     */
    getCurrentLang() {
        return this.currentLang;
    }

    /**
     * Check if translations are loaded
     */
    isReady() {
        return this.isLoaded;
    }
}

// Create singleton instance
const i18n = new I18n();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}

// Export for use in other modules
export default i18n;
export { I18n };
