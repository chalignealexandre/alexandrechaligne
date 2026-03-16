import { defineType } from 'sanity'

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    // Section France 🇫🇷
    {
      name: 'franceAddress',
      title: 'France - Lieu / Adresse',
      type: 'text',
      description: 'Ex: 10 rue du Bois de la Rose, 74100 Ville-la-Grand',
      rows: 2,
    },
    {
      name: 'francePhone',
      title: 'France - Téléphone',
      type: 'string',
      description: 'Ex: +33 6 52 73 88 10',
    },
    {
      name: 'franceHours',
      title: 'France - Horaires d\'ouverture',
      type: 'text',
      description: 'Ex: Lun – Ven : 8h – 18h, Sam : sur rendez-vous',
      rows: 2,
    },
    // Section Suisse 🇨🇭
    {
      name: 'suisseAddress',
      title: 'Suisse - Lieu / Adresse',
      type: 'text',
      description: 'Ex: Boulevard Georges-Favon 3, 1204 Genève',
      rows: 2,
    },
    {
      name: 'suissePhone',
      title: 'Suisse - Téléphone',
      type: 'string',
      description: 'Ex: +41 79 891 88 10',
    },
    {
      name: 'suisseHours',
      title: 'Suisse - Horaires d\'ouverture',
      type: 'text',
      description: 'Ex: Lun – Ven : 8h – 18h, Sam : sur rendez-vous',
      rows: 2,
    },
    // Section Contact
    {
      name: 'contactEmail',
      title: 'Contact - Email',
      type: 'string',
      description: 'Ex: alexandre.chaligne@gmail.com',
    },
    {
      name: 'linkedinUrl',
      title: 'Lien LinkedIn',
      type: 'url',
      description: 'URL de redirection au clic sur "Suivez-moi sur LinkedIn"',
    },
  ],
})
