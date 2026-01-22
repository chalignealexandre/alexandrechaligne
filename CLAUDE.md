# CLAUDE.md - Site Alexandre Chaligné

> Contexte du projet pour Claude AI / Cursor

---

## PROJET

**Site vitrine** pour **Alexandre Chaligné**, staffeur ornemaniste et plâtrier traditionnel basé à Ville-la-Grand (France) avec activité en Suisse (Genève).

### Objectif
Présenter l'artisan, ses services et réalisations pour générer des demandes de devis de clients particuliers et professionnels (B2B).

### URL de production
`https://www.alexandrechaligne.com/`

---

## STACK TECHNIQUE

| Technologie | Version | Usage |
|-------------|---------|-------|
| HTML5 | - | Structure des pages |
| CSS3 | - | Styles (variables CSS, flexbox, grid) |
| JavaScript | ES6+ | Interactions et animations |
| Vite | ^5.0.0 | Bundler et dev server |
| Vercel | - | Hébergement et déploiement |

### Pas de framework
Site statique vanilla - pas de React, Vue ou autre framework JS.

---

## STRUCTURE DU PROJET

```
Alexandre Chaligné/
├── index.html                 # Page d'accueil
├── pages/
│   ├── about.html             # À propos
│   ├── services.html          # Services
│   ├── portfolio.html         # Réalisations
│   ├── contact.html           # Contact + formulaires
│   ├── mentions-legales.html
│   ├── politique-confidentialite.html
│   └── projects/
│       ├── villa-vandoeuvres.html
│       └── chateau-glana.html
├── assets/
│   ├── css/
│   │   ├── main.css           # Styles principaux
│   │   ├── ux-improvements.css
│   │   └── contact-enhanced.css
│   ├── js/
│   │   ├── main.js            # Logique principale
│   │   ├── ux-enhancements.js # Micro-interactions
│   │   └── creative-animations.js
│   ├── images/
│   └── videos/
├── dist/                      # Build production
├── vite.config.js
├── vercel.json
└── package.json
```

---

## COMMANDES

```bash
# Développement
npm run dev          # Lance serveur dev sur port 3000

# Build production
npm run build        # Build dans /dist

# Preview production
npm run preview      # Preview du build
```

---

## CONVENTIONS

### HTML
- Langue : `lang="fr"`
- Structure sémantique : `<main>`, `<nav>`, `<footer>`, `<section>`, `<article>`
- Skip links pour accessibilité
- Meta descriptions uniques par page

### CSS
- Variables CSS pour couleurs et spacing
- Classes BEM-like (`.component`, `.component-element`, `.component--modifier`)
- Mobile-first responsive

### JavaScript
- ES6+ modules (`type="module"`)
- IntersectionObserver pour animations scroll
- LocalStorage pour préférences (langue, cookies)

---

## FONCTIONNALITÉS

### Implémentées
- Navigation responsive avec menu mobile
- Animations au scroll (IntersectionObserver)
- Parallax effects
- Lazy loading images natif
- Cookie banner RGPD
- FAQ accordion
- Formulaires contact (UI uniquement)
- Bouton contact flottant

### Placeholders (non implémentées)
- **Language switcher** : UI présente, switch non fonctionnel
- **Envoi formulaires** : Simulation uniquement, pas de backend

---

## PAGES

| Page | URL | Description |
|------|-----|-------------|
| Accueil | `/` | Hero vidéo, présentation, portfolio preview |
| À propos | `/pages/about.html` | Parcours, timeline, valeurs |
| Services | `/pages/services.html` | Staff, plâtrerie, restauration |
| Portfolio | `/pages/portfolio.html` | Galerie projets |
| Contact | `/pages/contact.html` | Formulaire devis + B2B |
| Projet Villa | `/pages/projects/villa-vandoeuvres.html` | Détail projet |
| Projet Château | `/pages/projects/chateau-glana.html` | Détail projet |

---

## DÉPLOIEMENT

### Vercel
- Auto-deploy depuis branche `main`
- Config dans `vercel.json` (rewrites, headers sécurité)

### Headers sécurité configurés
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

---

## TODO / AMÉLIORATIONS

### Priorité haute
- [ ] Implémenter envoi formulaires (Formspree, EmailJS, etc.)
- [ ] Ajouter sitemap.xml et robots.txt

### Priorité moyenne
- [ ] Implémenter language switcher ou retirer le bouton
- [ ] Optimiser images (WebP, compression)
- [ ] Découper main.css en modules

### Priorité basse
- [ ] Tests accessibilité (Lighthouse, axe)
- [ ] Code splitting Vite

---

## CONTACT CLIENT

**Alexandre Chaligné**
- Email : alexandre.chaligne@gmail.com
- Tél FR : +33 6 52 73 88 10
- Tél CH : +41 79 891 88 10
- LinkedIn : [Profil](https://www.linkedin.com/in/alexandre-chalign%C3%A9-492a6b10b/)

---

## DÉVELOPPEUR

Site développé par **Propul'SEO**
- Site : https://www.propulseo-site.com/
