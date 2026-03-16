# Import des données du front vers Sanity

Ce script remplit les documents Sanity (pages, footer, réalisations) à partir des fichiers de traduction (FR/EN) et des images du projet.

## Prérequis

1. **Token Sanity avec droits d’écriture**
   - Va sur [manage.sanity.io](https://manage.sanity.io) → ton projet → **API** → **Tokens**
   - Crée un token avec au minimum **Editor** (écriture)
   - Copie le token

2. **Variables d’environnement**

   Crée un fichier `.env` à la **racine du projet** (ou exporte les variables) :

   ```env
   SANITY_PROJECT_ID=mkddilwp
   SANITY_DATASET=production
   SANITY_TOKEN=ton_token_ici
   ```

   Ne commite jamais `.env` (il est dans `.gitignore`).

## Installation

À la racine du projet :

```bash
npm install
```

(Le script utilise `@sanity/client` ajouté en devDependency.)

## Exécution

À la racine du projet :

```bash
node scripts/import-to-sanity/run-import.js
```

Ou avec les variables en ligne :

```bash
SANITY_TOKEN=ton_token node scripts/import-to-sanity/run-import.js
```

## Comportement

- Lit `public/locales/fr.json` et `public/locales/en.json`
- Upload les images présentes dans `assets/images/` (et chemins listés dans le script) vers Sanity
- Crée ou remplace les documents : Page Accueil, À propos, Services, Réalisations (page), Contact, Footer, et les 2 réalisations (Villa Vandœuvres, Château du Glana)
- Les images manquantes sur le disque sont ignorées (champs image laissés vides dans Sanity)

## Après l’import

- Ouvre le Studio (`npm run dev` dans `studio/`) et vérifie les documents
- Complète à la main les images non trouvées si besoin
- Les références entre documents (ex. réalisations affichées sur l’accueil) sont déjà renseignées
