import { defineType } from 'sanity'

export const pageAPropos = defineType({
  name: 'pageAPropos',
  title: 'Page À propos',
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
    // Section "L'Art du Staff, Une Passion et un Métier"
    {
      name: 'sectionArtStaffImage',
      title: 'Photo section L\'Art du Staff',
      type: 'image',
    },

    {
      name: 'storyTitle_fr',
      title: "Section L'Art du Staff - Titre (FR)",
      type: 'string',
    },
    {
      name: 'storyTitle_en',
      title: "Section L'Art du Staff - Titre (EN)",
      type: 'string',
    },
    {
      name: 'storyText_fr',
      title: "Section L'Art du Staff - Texte (FR)",
      type: 'text',
      rows: 8,
      description: 'Un paragraphe par ligne (les retours à la ligne créeront des paragraphes).',
    },
    {
      name: 'storyText_en',
      title: "Section L'Art du Staff - Texte (EN)",
      type: 'text',
      rows: 8,
      description: 'One paragraph per line (newlines will be rendered as paragraphs).',
    },
    {
      name: 'storyQuoteText_fr',
      title: "Section L'Art du Staff - Citation (FR)",
      type: 'string',
    },
    {
      name: 'storyQuoteText_en',
      title: "Section L'Art du Staff - Citation (EN)",
      type: 'string',
    },
    {
      name: 'storyQuoteAuthor_fr',
      title: "Section L'Art du Staff - Auteur citation (FR)",
      type: 'string',
    },
    {
      name: 'storyQuoteAuthor_en',
      title: "Section L'Art du Staff - Auteur citation (EN)",
      type: 'string',
    },

    // Section "Un Savoir-Faire Reconnu" (timeline)
    {
      name: 'timelineTitle_fr',
      title: 'Timeline - Titre (FR)',
      type: 'string',
    },
    {
      name: 'timelineTitle_en',
      title: 'Timeline - Titre (EN)',
      type: 'string',
    },
    {
      name: 'timelineSubtitle_fr',
      title: 'Timeline - Sous-titre (FR)',
      type: 'string',
    },
    {
      name: 'timelineSubtitle_en',
      title: 'Timeline - Sous-titre (EN)',
      type: 'string',
    },
    {
      name: 'timelineItems',
      title: 'Timeline - Étapes',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'timelineItem',
          title: 'Étape',
          fields: [
            { name: 'isEnabled', title: 'Afficher', type: 'boolean', initialValue: true },
            { name: 'year', title: 'Année / repère', type: 'string', description: 'Ex: 2006' },
            { name: 'title_fr', title: 'Titre (FR)', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'title_en', title: 'Titre (EN)', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'text_fr', title: 'Texte (FR)', type: 'text', rows: 4, validation: (Rule: any) => Rule.required() },
            { name: 'text_en', title: 'Texte (EN)', type: 'text', rows: 4, validation: (Rule: any) => Rule.required() },
          ],
          preview: {
            select: { title: 'title_fr', subtitle: 'year', enabled: 'isEnabled' },
            prepare(selection: any) {
              const { title, subtitle, enabled } = selection || {};
              return { title: title || 'Étape', subtitle: subtitle || '', media: enabled === false ? '🙈' : '⏱️' };
            },
          },
        },
      ],
    },

    // Section "Nos Valeurs"
    {
      name: 'valuesTitle_fr',
      title: 'Valeurs - Titre (FR)',
      type: 'string',
    },
    {
      name: 'valuesTitle_en',
      title: 'Valeurs - Titre (EN)',
      type: 'string',
    },
    {
      name: 'valuesSubtitle_fr',
      title: 'Valeurs - Sous-titre (FR)',
      type: 'string',
    },
    {
      name: 'valuesSubtitle_en',
      title: 'Valeurs - Sous-titre (EN)',
      type: 'string',
    },
    {
      name: 'valuesItems',
      title: 'Valeurs - Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'valueItem',
          title: 'Card',
          fields: [
            { name: 'isEnabled', title: 'Afficher', type: 'boolean', initialValue: true },
            { name: 'title_fr', title: 'Titre (FR)', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'title_en', title: 'Titre (EN)', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'text_fr', title: 'Texte (FR)', type: 'text', rows: 4, validation: (Rule: any) => Rule.required() },
            { name: 'text_en', title: 'Texte (EN)', type: 'text', rows: 4, validation: (Rule: any) => Rule.required() },
          ],
          preview: {
            select: { title: 'title_fr', enabled: 'isEnabled' },
            prepare(selection: any) {
              const { title, enabled } = selection || {};
              return { title: title || 'Valeur', subtitle: '', media: enabled === false ? '🙈' : '⭐' };
            },
          },
        },
      ],
    },
  ],
})
