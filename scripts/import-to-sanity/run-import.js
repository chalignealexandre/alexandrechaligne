/**
 * Import des données du front (locales FR/EN + images) vers Sanity.
 * À lancer depuis la racine du projet avec SANITY_TOKEN défini.
 *
 * Usage: npm run import:sanity
 *        ou: SANITY_TOKEN=xxx node scripts/import-to-sanity/run-import.js
 */

const fs = require('fs');
const path = require('path');

// Charger .env à la racine du projet si présent
try {
  const envPath = path.resolve(__dirname, '../../.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const m = line.match(/^\s*([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    });
  }
} catch (_) {}

const { createClient } = require('@sanity/client');

const ROOT = path.resolve(__dirname, '../..');

function loadJson(relativePath) {
  const p = path.join(ROOT, relativePath);
  if (!fs.existsSync(p)) {
    console.warn('Fichier manquant:', relativePath);
    return null;
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Variable d'environnement requise: ${name}`);
    console.error('Crée un .env ou exporte SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN');
    process.exit(1);
  }
  return v;
}

async function uploadImage(client, relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  try {
    const buffer = fs.readFileSync(fullPath);
    const asset = await client.assets.upload('image', buffer, {
      filename: path.basename(fullPath),
    });
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  } catch (e) {
    console.warn('Upload échoué pour', relativePath, e.message);
    return null;
  }
}

function ref(id) {
  return { _type: 'reference', _ref: id };
}

function main() {
  const projectId = process.env.SANITY_PROJECT_ID || 'mkddilwp';
  const dataset = process.env.SANITY_DATASET || 'production';
  const token = requireEnv('SANITY_TOKEN');

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  });

  const fr = loadJson('public/locales/fr.json');
  const en = loadJson('public/locales/en.json');
  if (!fr || !en) {
    console.error('Locales manquantes (public/locales/fr.json / en.json)');
    process.exit(1);
  }

  const imagePaths = [
    'assets/images/hero-bg.jpg',
    'assets/images/og-image.jpg',
    'assets/images/intro-placeholder.jpg',
    'assets/images/project-2.jpg',
    'assets/images/project-3.jpg',
    'assets/images/service-decorative.jpg',
    'assets/images/service-custom.jpg',
    'assets/images/service-renovation.jpg',
    'assets/images/about-portrait.jpg',
  ];

  const skipImageUpload = process.env.SKIP_IMAGE_UPLOAD === '1';

  (async () => {
    let imageRefs = {};
    if (!skipImageUpload) {
      console.log('Upload des images...');
      for (const rel of imagePaths) {
        const key = path.basename(rel, path.extname(rel)).replace(/-/g, '_');
        const ref = await uploadImage(client, rel);
        if (ref) imageRefs[key] = ref;
        await new Promise((r) => setTimeout(r, 300));
      }
      console.log('Images uploadées:', Object.keys(imageRefs).length);
    } else {
      console.log('Upload des images ignoré (SKIP_IMAGE_UPLOAD=1).');
    }
    const img = (name) => imageRefs[name] || null;

    const h = fr.home;
    const ah = fr.about;
    const sh = fr.services;
    const ph = fr.portfolio;
    const ch = fr.contact;
    const pv = fr.project_villa;
    const pg = fr.project_glana;
    const eh = en.home;
    const eah = en.about;
    const esh = en.services;
    const eph = en.portfolio;
    const ech = en.contact;
    const epv = en.project_villa;
    const epg = en.project_glana;

    const docs = [];

    // ——— Page Accueil ———
    docs.push({
      _id: 'pageAccueil',
      _type: 'pageAccueil',
      heroImage: img('hero_bg') || img('og_image'),
      heroTitle_fr: [h.hero.title_line1_word1, h.hero.title_line1_word2, h.hero.title_line2_word1, h.hero.title_line2_word2, h.hero.title_line2_word3].join(' '),
      heroTitle_en: [eh.hero.title_line1_word1, eh.hero.title_line1_word2, eh.hero.title_line2_word1, eh.hero.title_line2_word2, eh.hero.title_line2_word3].join(' '),
      heroSubtitle_fr: `${h.hero.tagline_line1}\n${h.hero.tagline_line2}`,
      heroSubtitle_en: `${eh.hero.tagline_line1}\n${eh.hero.tagline_line2}`,
      excellenceImage: img('intro_placeholder') || img('hero_bg'),
      excellenceYears: 19,
      excellenceProjectsCount: 200,
      remarkableProjects: [], // rempli après création des réalisations
      remarkableProjectsCount: 200,
      remarkableCountriesCount: 3,
    });

    // ——— Page À propos ———
    docs.push({
      _id: 'pageAPropos',
      _type: 'pageAPropos',
      heroImage: img('hero_bg') || img('og_image'),
      heroTitle_fr: ah.hero.title,
      heroTitle_en: eah.hero.title,
      heroSubtitle_fr: ah.hero.subtitle,
      heroSubtitle_en: eah.hero.subtitle,
      sectionArtStaffImage: img('about_portrait') || img('hero_bg'),
    });

    // ——— Page Services ———
    const staffListFr = [sh.staff.list.item1, sh.staff.list.item2, sh.staff.list.item3, sh.staff.list.item4, sh.staff.list.item5, sh.staff.list.item6, sh.staff.list.item7];
    const staffListEn = [esh.staff.list.item1, esh.staff.list.item2, esh.staff.list.item3, esh.staff.list.item4, esh.staff.list.item5, esh.staff.list.item6, esh.staff.list.item7];
    const plasterListFr = [sh.plastering.list.item1, sh.plastering.list.item2, sh.plastering.list.item3, sh.plastering.list.item4, sh.plastering.list.item5, sh.plastering.list.item6];
    const plasterListEn = [esh.plastering.list.item1, esh.plastering.list.item2, esh.plastering.list.item3, esh.plastering.list.item4, esh.plastering.list.item5, esh.plastering.list.item6];
    const restorListFr = [sh.restoration.list.item1, sh.restoration.list.item2, sh.restoration.list.item3, sh.restoration.list.item4, sh.restoration.list.item5, sh.restoration.list.item6, sh.restoration.list.item7];
    const restorListEn = [esh.restoration.list.item1, esh.restoration.list.item2, esh.restoration.list.item3, esh.restoration.list.item4, esh.restoration.list.item5, esh.restoration.list.item6, esh.restoration.list.item7];

    docs.push({
      _id: 'pageServices',
      _type: 'pageServices',
      heroImage: img('hero_bg') || img('og_image'),
      heroTitle_fr: sh.hero.title,
      heroTitle_en: esh.hero.title,
      heroSubtitle_fr: sh.hero.subtitle,
      heroSubtitle_en: esh.hero.subtitle,
      services: [
        {
          _type: 'serviceItem',
          title_fr: sh.staff.title,
          title_en: esh.staff.title,
          description_fr: sh.staff.description,
          description_en: esh.staff.description,
          image: img('service_decorative') || img('hero_bg'),
          prestations_fr: staffListFr,
          prestations_en: staffListEn,
          question_fr: sh.staff.highlight_title,
          question_en: esh.staff.highlight_title,
          answer_fr: sh.staff.highlight_text,
          answer_en: esh.staff.highlight_text,
        },
        {
          _type: 'serviceItem',
          title_fr: sh.plastering.title,
          title_en: esh.plastering.title,
          description_fr: sh.plastering.description,
          description_en: esh.plastering.description,
          image: img('service_custom') || img('hero_bg'),
          prestations_fr: plasterListFr,
          prestations_en: plasterListEn,
          question_fr: sh.plastering.highlight_title,
          question_en: esh.plastering.highlight_title,
          answer_fr: sh.plastering.highlight_text,
          answer_en: esh.plastering.highlight_text,
        },
        {
          _type: 'serviceItem',
          title_fr: sh.restoration.title,
          title_en: esh.restoration.title,
          description_fr: sh.restoration.description,
          description_en: esh.restoration.description,
          image: img('service_renovation') || img('hero_bg'),
          prestations_fr: restorListFr,
          prestations_en: restorListEn,
          question_fr: sh.restoration.highlight_title,
          question_en: esh.restoration.highlight_title,
          answer_fr: sh.restoration.highlight_text,
          answer_en: esh.restoration.highlight_text,
        },
      ],
    });

    // ——— Réalisations (2 documents, pour avoir les _id avant page Réalisations et Accueil) ———
    const realVillaId = 'realisation-villa-vandoeuvres';
    const realGlanaId = 'realisation-chateau-glana';

    docs.push({
      _id: realVillaId,
      _type: 'realisation',
      slug: { _type: 'slug', current: 'villa-vandoeuvres' },
      previewImage: img('project_2') || img('hero_bg'),
      previewCategory_fr: ph.projects.villa.category,
      previewCategory_en: eph.projects.villa.category,
      previewTitle_fr: ph.projects.villa.title,
      previewTitle_en: eph.projects.villa.title,
      previewLieu_fr: ph.projects.villa.location,
      previewLieu_en: eph.projects.villa.location,
      previewDescription_fr: ph.projects.villa.description,
      previewDescription_en: eph.projects.villa.description,
      heroImage: img('project_2') || img('hero_bg'),
      heroBadge_fr: pv.hero.badge,
      heroBadge_en: epv.hero.badge,
      heroTitle_fr: 'Villa Privée',
      heroTitle_en: 'Private Villa',
      heroTitleSuffix_fr: 'Vandœuvres',
      heroTitleSuffix_en: 'Vandœuvres',
      heroSubtitle_fr: pv.hero.subtitle,
      heroSubtitle_en: epv.hero.subtitle,
      metaTypeLabel_fr: pv.overview.type_label,
      metaTypeLabel_en: epv.overview.type_label,
      metaTypeValue_fr: pv.overview.type_value,
      metaTypeValue_en: epv.overview.type_value,
      metaYear: 2022,
      metaLocationLabel_fr: pv.overview.location_label,
      metaLocationLabel_en: epv.overview.location_label,
      metaLocationValue_fr: pv.overview.location_value,
      metaLocationValue_en: epv.overview.location_value,
      metaFourthLabel_fr: pv.overview.duration_label,
      metaFourthLabel_en: epv.overview.duration_label,
      metaFourthValue_fr: pv.overview.duration_value,
      metaFourthValue_en: epv.overview.duration_value,
      introLabel_fr: pv.intro.title,
      introLabel_en: epv.intro.title,
      introTitle_fr: 'L\'Art du Staff au Service du Prestige',
      introTitle_en: 'The Art of Plasterwork Serving Prestige',
      introLead_fr: pv.intro.lead,
      introLead_en: epv.intro.lead,
      introDescription_fr: pv.intro.description,
      introDescription_en: epv.intro.description,
      approachSectionTitle_fr: 'Notre Approche',
      approachSectionTitle_en: 'Our Approach',
      challengeTitle_fr: pv.challenge.title,
      challengeTitle_en: epv.challenge.title,
      challengeDescription_fr: pv.challenge.description,
      challengeDescription_en: epv.challenge.description,
      solutionTitle_fr: pv.solution.title,
      solutionTitle_en: epv.solution.title,
      solutionDescription_fr: pv.solution.description,
      solutionDescription_en: epv.solution.description,
      featuresTitle_fr: pv.features.title,
      featuresTitle_en: epv.features.title,
      featuresSubtitle_fr: pv.features.subtitle,
      featuresSubtitle_en: epv.features.subtitle,
      feature1Title_fr: pv.features.feature1_title,
      feature1Title_en: epv.features.feature1_title,
      feature1Description_fr: pv.features.feature1_description,
      feature1Description_en: epv.features.feature1_description,
      feature2Title_fr: pv.features.feature2_title,
      feature2Title_en: epv.features.feature2_title,
      feature2Description_fr: pv.features.feature2_description,
      feature2Description_en: epv.features.feature2_description,
      feature3Title_fr: pv.features.feature3_title,
      feature3Title_en: epv.features.feature3_title,
      feature3Description_fr: pv.features.feature3_description,
      feature3Description_en: epv.features.feature3_description,
      feature4Title_fr: pv.features.feature4_title,
      feature4Title_en: epv.features.feature4_title,
      feature4Description_fr: pv.features.feature4_description,
      feature4Description_en: epv.features.feature4_description,
      galleryTitle_fr: pv.gallery.title,
      galleryTitle_en: epv.gallery.title,
      gallerySubtitle_fr: pv.gallery.subtitle,
      gallerySubtitle_en: epv.gallery.subtitle,
      galleryItems: [
        { image: img('project_2'), caption_fr: 'Escalier principal', caption_en: 'Main staircase' },
        { image: img('project_2'), caption_fr: 'Détail moulures', caption_en: 'Moulding detail' },
        { image: img('project_2'), caption_fr: 'Garde-corps', caption_en: 'Balustrade' },
      ].filter((i) => i.image),
      quoteText_fr: pv.results.quote_text,
      quoteText_en: epv.results.quote_text,
      quoteAuthor_fr: pv.results.quote_author,
      quoteAuthor_en: epv.results.quote_author,
      quotePosition_fr: pv.results.quote_position,
      quotePosition_en: epv.results.quote_position,
      stat1Number: '85',
      stat1Label_fr: pv.results.stat1_label,
      stat1Label_en: epv.results.stat1_label,
      stat2Number: '4',
      stat2Label_fr: pv.results.stat2_label,
      stat2Label_en: epv.results.stat2_label,
      stat3Number: '100%',
      stat3Label_fr: pv.results.stat3_label,
      stat3Label_en: epv.results.stat3_label,
    });

    docs.push({
      _id: realGlanaId,
      _type: 'realisation',
      slug: { _type: 'slug', current: 'chateau-glana' },
      previewImage: img('project_3') || img('hero_bg'),
      previewCategory_fr: ph.projects.glana.category,
      previewCategory_en: eph.projects.glana.category,
      previewTitle_fr: ph.projects.glana.title,
      previewTitle_en: eph.projects.glana.title,
      previewLieu_fr: ph.projects.glana.location,
      previewLieu_en: eph.projects.glana.location,
      previewDescription_fr: ph.projects.glana.description,
      previewDescription_en: eph.projects.glana.description,
      heroImage: img('project_3') || img('hero_bg'),
      heroBadge_fr: pg.hero.badge,
      heroBadge_en: epg.hero.badge,
      heroTitle_fr: pg.hero.title,
      heroTitle_en: epg.hero.title,
      heroTitleSuffix_fr: 'Saint-Julien-Beychevelle',
      heroTitleSuffix_en: 'Saint-Julien-Beychevelle',
      heroSubtitle_fr: pg.hero.subtitle,
      heroSubtitle_en: epg.hero.subtitle,
      metaTypeLabel_fr: pg.overview.type_label,
      metaTypeLabel_en: epg.overview.type_label,
      metaTypeValue_fr: pg.overview.type_value,
      metaTypeValue_en: epg.overview.type_value,
      metaYear: 2021,
      metaLocationLabel_fr: pg.overview.location_label,
      metaLocationLabel_en: epg.overview.location_label,
      metaLocationValue_fr: pg.overview.location_value,
      metaLocationValue_en: epg.overview.location_value,
      metaFourthLabel_fr: pg.overview.surface_label,
      metaFourthLabel_en: epg.overview.surface_label,
      metaFourthValue_fr: pg.overview.surface_value,
      metaFourthValue_en: epg.overview.surface_value,
      introLabel_fr: pg.intro.title,
      introLabel_en: epg.intro.title,
      introTitle_fr: 'Performance Thermique & Patrimoine',
      introTitle_en: 'Thermal Performance & Heritage',
      introLead_fr: pg.intro.lead,
      introLead_en: epg.intro.lead,
      introDescription_fr: pg.intro.description,
      introDescription_en: epg.intro.description,
      approachSectionTitle_fr: 'Notre Approche',
      approachSectionTitle_en: 'Our Approach',
      challengeTitle_fr: pg.challenge.title,
      challengeTitle_en: epg.challenge.title,
      challengeDescription_fr: pg.challenge.description,
      challengeDescription_en: epg.challenge.description,
      solutionTitle_fr: pg.solution.title,
      solutionTitle_en: epg.solution.title,
      solutionDescription_fr: pg.solution.description,
      solutionDescription_en: epg.solution.description,
      featuresTitle_fr: pg.features.title,
      featuresTitle_en: epg.features.title,
      featuresSubtitle_fr: pg.features.subtitle,
      featuresSubtitle_en: epg.features.subtitle,
      feature1Title_fr: pg.features.feature1_title,
      feature1Title_en: epg.features.feature1_title,
      feature1Description_fr: pg.features.feature1_description,
      feature1Description_en: epg.features.feature1_description,
      feature2Title_fr: pg.features.feature2_title,
      feature2Title_en: epg.features.feature2_title,
      feature2Description_fr: pg.features.feature2_description,
      feature2Description_en: epg.features.feature2_description,
      feature3Title_fr: pg.features.feature3_title,
      feature3Title_en: epg.features.feature3_title,
      feature3Description_fr: pg.features.feature3_description,
      feature3Description_en: epg.features.feature3_description,
      feature4Title_fr: pg.features.feature4_title,
      feature4Title_en: epg.features.feature4_title,
      feature4Description_fr: pg.features.feature4_description,
      feature4Description_en: epg.features.feature4_description,
      galleryTitle_fr: pg.gallery.title,
      galleryTitle_en: epg.gallery.title,
      gallerySubtitle_fr: pg.gallery.subtitle,
      gallerySubtitle_en: epg.gallery.subtitle,
      galleryItems: [
        { image: img('project_3'), caption_fr: 'Salon de réception', caption_en: 'Reception room' },
        { image: img('project_3'), caption_fr: 'Rosace centrale', caption_en: 'Central ceiling rose' },
        { image: img('project_3'), caption_fr: 'Corniches', caption_en: 'Cornices' },
      ].filter((i) => i.image),
      quoteText_fr: pg.results.quote_text,
      quoteText_en: epg.results.quote_text,
      quoteAuthor_fr: pg.results.quote_author,
      quoteAuthor_en: epg.results.quote_author,
      quotePosition_fr: pg.results.quote_position,
      quotePosition_en: epg.results.quote_position,
      stat1Number: '450',
      stat1Label_fr: pg.results.stat1_label,
      stat1Label_en: epg.results.stat1_label,
      stat2Number: '45%',
      stat2Label_fr: pg.results.stat2_label,
      stat2Label_en: epg.results.stat2_label,
      stat3Number: '18',
      stat3Label_fr: pg.results.stat3_label,
      stat3Label_en: epg.results.stat3_label,
    });

    // ——— Page Réalisations ———
    docs.push({
      _id: 'pageRealisations',
      _type: 'pageRealisations',
      heroImage: img('hero_bg') || img('og_image'),
      heroTitle_fr: ph.hero.title,
      heroTitle_en: eph.hero.title,
      heroSubtitle_fr: ph.hero.subtitle,
      heroSubtitle_en: eph.hero.subtitle,
      realisationsAffichees: [ref(realVillaId), ref(realGlanaId)],
      avis: [
        {
          _type: 'avisClient',
          etoiles: 5,
          contenu_fr: ph.testimonials.testimonial1.text,
          contenu_en: eph.testimonials.testimonial1.text,
          auteur_fr: ph.testimonials.testimonial1.author,
          auteur_en: eph.testimonials.testimonial1.author,
          statut_fr: ph.testimonials.testimonial1.position,
          statut_en: eph.testimonials.testimonial1.position,
        },
        {
          _type: 'avisClient',
          etoiles: 5,
          contenu_fr: ph.testimonials.testimonial2.text,
          contenu_en: eph.testimonials.testimonial2.text,
          auteur_fr: ph.testimonials.testimonial2.author,
          auteur_en: eph.testimonials.testimonial2.author,
          statut_fr: ph.testimonials.testimonial2.position,
          statut_en: eph.testimonials.testimonial2.position,
        },
      ],
    });

    // ——— Mise à jour page Accueil: remarkableProjects ———
    const accueilIdx = docs.findIndex((d) => d._id === 'pageAccueil');
    docs[accueilIdx].remarkableProjects = [ref(realVillaId), ref(realGlanaId)];

    // ——— Page Contact ———
    docs.push({
      _id: 'pageContact',
      _type: 'pageContact',
      heroImage: img('hero_bg') || img('og_image'),
      heroTitle_fr: `${ch.hero.title_line1}\n${ch.hero.title_line2}`,
      heroTitle_en: `${ech.hero.title_line1}\n${ech.hero.title_line2}`,
      heroSubtitle_fr: ch.hero.description,
      heroSubtitle_en: ech.hero.description,
      phone1Label_fr: ch.sidebar.phone_label,
      phone1Label_en: ech.sidebar.phone_label,
      phone1Number: '+33 6 52 73 88 10',
      phone1Schedule_fr: ch.sidebar.hours,
      phone1Schedule_en: ech.sidebar.hours,
      phone2Label_fr: ch.sidebar.phone_label,
      phone2Label_en: ech.sidebar.phone_label,
      phone2Number: '+41 79 891 88 10',
      phone2Schedule_fr: ch.sidebar.hours,
      phone2Schedule_en: ech.sidebar.hours,
      emailLabel_fr: ch.sidebar.email_label,
      emailLabel_en: ech.sidebar.email_label,
      emailAddress: 'alexandre.chaligne@gmail.com',
      emailNote_fr: ch.sidebar.response_time,
      emailNote_en: ech.sidebar.response_time,
      zones_fr: [ch.sidebar.zone1, ch.sidebar.zone2, ch.sidebar.zone3, ch.sidebar.zone4],
      zones_en: [ech.sidebar.zone1, ech.sidebar.zone2, ech.sidebar.zone3, ech.sidebar.zone4],
    });

    // ——— Footer ———
    docs.push({
      _id: 'footer',
      _type: 'footer',
      franceAddress: '10 rue du Bois de la Rose\n74100 Ville-la-Grand',
      francePhone: '+33 6 52 73 88 10',
      franceHours: 'Lun – Ven : 8h – 18h\nSam : sur rendez-vous',
      suisseAddress: 'Boulevard Georges-Favon 3\n1204 Genève',
      suissePhone: '+41 79 891 88 10',
      suisseHours: 'Lun – Ven : 8h – 18h\nSam : sur rendez-vous',
      contactEmail: 'alexandre.chaligne@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/alexandre-chalign%C3%A9-492a6b10b/',
    });

    const transaction = client.transaction();
    for (const doc of docs) {
      transaction.createOrReplace(doc);
    }
    await transaction.commit();
    console.log('Documents créés/remplacés:', docs.length);
    console.log('Import terminé.');
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

main();
