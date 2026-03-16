import { defineType } from 'sanity'

export const pageServices = defineType({
  name: 'pageServices',
  title: 'Page Services',
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
    // Liste des services (ajouter / modifier / supprimer)
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'serviceItem' }],
    },
  ],
})
