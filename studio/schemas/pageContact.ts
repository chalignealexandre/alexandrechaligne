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
  ],
})
