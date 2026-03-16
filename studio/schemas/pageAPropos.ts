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
  ],
})
