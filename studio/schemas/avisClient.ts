import { defineType } from 'sanity'

export const avisClient = defineType({
  name: 'avisClient',
  title: 'Avis client',
  type: 'object',
  fields: [
    {
      name: 'etoiles',
      title: 'Nombre d\'étoiles',
      type: 'number',
    },
    {
      name: 'contenu_fr',
      title: 'Contenu de l\'avis (FR)',
      type: 'text',
    },
    {
      name: 'contenu_en',
      title: 'Contenu de l\'avis (EN)',
      type: 'text',
    },
    {
      name: 'auteur_fr',
      title: 'Auteur de l\'avis (FR)',
      type: 'string',
    },
    {
      name: 'auteur_en',
      title: 'Auteur de l\'avis (EN)',
      type: 'string',
    },
    {
      name: 'statut_fr',
      title: 'Statut de l\'auteur (FR)',
      type: 'string',
    },
    {
      name: 'statut_en',
      title: 'Statut de l\'auteur (EN)',
      type: 'string',
    },
  ],
})
