import { defineType } from 'sanity'

export const pageRealisations = defineType({
  name: 'pageRealisations',
  title: 'Page Réalisations',
  type: 'document',
  fields: [
    // Hero
    {
      name: 'heroImage',
      title: 'Photo hero',
      type: 'image',
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
    // Réalisations à afficher sur la page (sélection parmi les documents Réalisation)
    {
      name: 'realisationsAffichees',
      title: 'Réalisations à afficher',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'realisation' }] }],
    },
    // Section "Ce que disent mes clients"
    {
      name: 'avis',
      title: 'Avis clients',
      type: 'array',
      of: [{ type: 'avisClient' }],
    },
  ],
})
