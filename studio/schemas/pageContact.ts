import { defineType } from 'sanity'

export const pageContact = defineType({
  name: 'pageContact',
  title: 'Page Contact',
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
    // Section Contact Direct - Téléphone 1
    {
      name: 'phone1Label_fr',
      title: 'Téléphone 1 - Label (FR)',
      type: 'string',
      description: 'Ex: Téléphone',
    },
    {
      name: 'phone1Label_en',
      title: 'Téléphone 1 - Label (EN)',
      type: 'string',
    },
    {
      name: 'phone1Number',
      title: 'Téléphone 1 - Numéro',
      type: 'string',
      description: 'Ex: +33 6 52 73 88 10',
    },
    {
      name: 'phone1Schedule_fr',
      title: 'Téléphone 1 - Horaire (FR)',
      type: 'string',
      description: 'Ex: Lun - Ven : 8h - 18h',
    },
    {
      name: 'phone1Schedule_en',
      title: 'Téléphone 1 - Horaire (EN)',
      type: 'string',
    },
    // Section Contact Direct - Téléphone 2
    {
      name: 'phone2Label_fr',
      title: 'Téléphone 2 - Label (FR)',
      type: 'string',
    },
    {
      name: 'phone2Label_en',
      title: 'Téléphone 2 - Label (EN)',
      type: 'string',
    },
    {
      name: 'phone2Number',
      title: 'Téléphone 2 - Numéro',
      type: 'string',
      description: 'Ex: +41 79 891 88 10',
    },
    {
      name: 'phone2Schedule_fr',
      title: 'Téléphone 2 - Horaire (FR)',
      type: 'string',
    },
    {
      name: 'phone2Schedule_en',
      title: 'Téléphone 2 - Horaire (EN)',
      type: 'string',
    },
    // Section Contact Direct - Email
    {
      name: 'emailLabel_fr',
      title: 'Email - Label (FR)',
      type: 'string',
      description: 'Ex: Email',
    },
    {
      name: 'emailLabel_en',
      title: 'Email - Label (EN)',
      type: 'string',
    },
    {
      name: 'emailAddress',
      title: 'Email - Adresse',
      type: 'string',
      description: 'Ex: alexandre.chaligne@gmail.com',
    },
    {
      name: 'emailNote_fr',
      title: 'Email - Note (FR)',
      type: 'string',
      description: 'Ex: Réponse sous 24h',
    },
    {
      name: 'emailNote_en',
      title: 'Email - Note (EN)',
      type: 'string',
    },
    // Section Zones d'Intervention (liste à puces)
    {
      name: 'zones_fr',
      title: 'Zones d\'intervention (FR)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Ex: Grand Est & Île-de-France, Suisse (Genève, Lausanne)...',
    },
    {
      name: 'zones_en',
      title: 'Zones d\'intervention (EN)',
      type: 'array',
      of: [{ type: 'string' }],
    },

    // Sidebar - "Nos Engagements"
    {
      name: 'trustTitle_fr',
      title: 'Nos Engagements - Titre (FR)',
      type: 'string',
    },
    {
      name: 'trustTitle_en',
      title: 'Nos Engagements - Titre (EN)',
      type: 'string',
    },
    {
      name: 'trustItems_fr',
      title: 'Nos Engagements - Items (FR)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Liste affichée dans la sidebar. Ordre modifiable.',
    },
    {
      name: 'trustItems_en',
      title: 'Nos Engagements - Items (EN)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List displayed in the sidebar. Reorderable.',
    },

    // Partnership - "Pourquoi collaborer avec nous ?"
    {
      name: 'benefitsTitle_fr',
      title: 'Pourquoi collaborer - Titre (FR)',
      type: 'string',
    },
    {
      name: 'benefitsTitle_en',
      title: 'Pourquoi collaborer - Titre (EN)',
      type: 'string',
    },
    {
      name: 'benefitsItems',
      title: 'Pourquoi collaborer - Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'benefitItem',
          title: 'Item',
          fields: [
            {
              name: 'isEnabled',
              title: 'Afficher cet item',
              type: 'boolean',
              initialValue: true,
            },
            { name: 'title_fr', title: 'Titre (FR)', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'title_en', title: 'Titre (EN)', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'text_fr', title: 'Texte (FR)', type: 'text', rows: 3, validation: (Rule: any) => Rule.required() },
            { name: 'text_en', title: 'Texte (EN)', type: 'text', rows: 3, validation: (Rule: any) => Rule.required() },
          ],
          preview: {
            select: { title: 'title_fr', subtitle: 'title_en', enabled: 'isEnabled' },
            prepare(selection: any) {
              const { title, subtitle, enabled } = selection || {};
              return {
                title: title || 'Titre (FR)',
                subtitle: subtitle || 'Titre (EN)',
                media: enabled === false ? '🙈' : '✨',
              };
            },
          },
        },
      ],
    },

    // Partnership - "Vous préférez échanger directement ?"
    {
      name: 'preferCallText_fr',
      title: 'Bloc téléphone - Texte (FR)',
      type: 'string',
    },
    {
      name: 'preferCallText_en',
      title: 'Bloc téléphone - Texte (EN)',
      type: 'string',
    },
    {
      name: 'preferCallPhone1',
      title: 'Bloc téléphone - Numéro 1',
      type: 'string',
      description: 'Ex: +33 6 52 73 88 10',
    },
    {
      name: 'preferCallPhone2',
      title: 'Bloc téléphone - Numéro 2',
      type: 'string',
      description: 'Ex: +41 79 891 88 10',
    },

    // FAQ (Questions / Réponses)
    {
      name: 'faqItems',
      title: 'FAQ - Questions / Réponses',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'Item FAQ',
          fields: [
            {
              name: 'isEnabled',
              title: 'Afficher cet item',
              type: 'boolean',
              initialValue: true,
            },
            {
              name: 'question_fr',
              title: 'Question (FR)',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'question_en',
              title: 'Question (EN)',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'answer_fr',
              title: 'Réponse (FR)',
              type: 'text',
              rows: 3,
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'answer_en',
              title: 'Réponse (EN)',
              type: 'text',
              rows: 3,
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'question_fr',
              subtitle: 'question_en',
              enabled: 'isEnabled',
            },
            prepare(selection: any) {
              const { title, subtitle, enabled } = selection || {};
              return {
                title: title || 'Question (FR)',
                subtitle: subtitle || 'Question (EN)',
                media: enabled === false ? '🙈' : '💬',
              };
            },
          },
        },
      ],
    },
  ],
})
