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

    // Section "Zones d'Intervention"
    {
      name: 'areasTitle_fr',
      title: "Zones d'intervention - Titre (FR)",
      type: 'string',
    },
    {
      name: 'areasTitle_en',
      title: "Zones d'intervention - Titre (EN)",
      type: 'string',
    },
    {
      name: 'areasSubtitle_fr',
      title: "Zones d'intervention - Sous-titre (FR)",
      type: 'string',
    },
    {
      name: 'areasSubtitle_en',
      title: "Zones d'intervention - Sous-titre (EN)",
      type: 'string',
    },
    {
      name: 'areasItems',
      title: "Zones d'intervention - Cards",
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'areaItem',
          title: 'Card',
          fields: [
            { name: 'isEnabled', title: 'Afficher', type: 'boolean', initialValue: true },
            { name: 'title_fr', title: 'Titre (FR)', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'title_en', title: 'Titre (EN)', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'desc_fr', title: 'Texte (FR)', type: 'text', rows: 3, validation: (Rule: any) => Rule.required() },
            { name: 'desc_en', title: 'Texte (EN)', type: 'text', rows: 3, validation: (Rule: any) => Rule.required() },
          ],
          preview: {
            select: { title: 'title_fr', enabled: 'isEnabled' },
            prepare(selection: any) {
              const { title, enabled } = selection || {};
              return { title: title || 'Zone', subtitle: '', media: enabled === false ? '🙈' : '📍' };
            },
          },
        },
      ],
      description: "Liste ré-ordonnable des zones affichées dans la section.",
    },
  ],
})
