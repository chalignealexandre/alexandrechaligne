import { defineType } from 'sanity'

export const pageAccueil = defineType({
  name: 'pageAccueil',
  title: 'Page Accueil',
  type: 'document',
  fields: [
    // Hero
    {
      name: 'heroVideo',
      title: 'Vidéo hero',
      type: 'file',
      options: {
        accept: 'video/mp4,video/webm,video/ogg',
      },
    },
    {
      name: 'heroTitle_fr',
      title: 'Titre hero (FR)',
      type: 'string',
    },
    {
      name: 'heroTitle_en',
      title: 'Titre hero (EN)',
      type: 'string',
    },
    {
      name: 'heroSubtitle_fr',
      title: 'Sous-titre hero (FR)',
      type: 'string',
    },
    {
      name: 'heroSubtitle_en',
      title: 'Sous-titre hero (EN)',
      type: 'string',
    },
    // Section "L'Excellence du Staff et de la Plâtrerie Traditionnelle"
    {
      name: 'excellenceImage',
      title: 'Photo section Excellence',
      type: 'image',
    },
    {
      name: 'excellenceYears',
      title: "Nombre d'années d'expérience",
      type: 'number',
    },
    {
      name: 'excellenceProjectsCount',
      title: 'Nombre de projets réalisés (section Excellence)',
      type: 'number',
    },
    // Section "Réalisations Remarquables"
    {
      name: 'remarkableProjects',
      title: 'Projets affichés (Réalisations Remarquables)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'realisation' }] }],
    },
    {
      name: 'remarkableProjectsCount',
      title: 'Nombre de projets (section Réalisations)',
      type: 'number',
    },
    {
      name: 'remarkableCountriesCount',
      title: 'Nombre de pays',
      type: 'number',
    },
  ],
})
