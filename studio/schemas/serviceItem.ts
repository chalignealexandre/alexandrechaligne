import { defineType } from 'sanity'

export const serviceItem = defineType({
  name: 'serviceItem',
  title: 'Service',
  type: 'object',
  fields: [
    { name: 'title_fr', title: 'Titre (FR)', type: 'string' },
    { name: 'title_en', title: 'Titre (EN)', type: 'string' },
    { name: 'description_fr', title: 'Description (FR)', type: 'text' },
    { name: 'description_en', title: 'Description (EN)', type: 'text' },
    {
      name: 'image',
      title: 'Photo associée',
      type: 'image',
    },
    {
      name: 'prestations_fr',
      title: 'Liste des prestations (FR)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'prestations_en',
      title: 'Liste des prestations (EN)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    { name: 'question_fr', title: 'Question section (FR)', type: 'string' },
    { name: 'question_en', title: 'Question section (EN)', type: 'string' },
    { name: 'answer_fr', title: 'Réponse section (FR)', type: 'text' },
    { name: 'answer_en', title: 'Réponse section (EN)', type: 'text' },
  ],
})
