import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'alexandre-chaligne',
  title: 'Alexandre Chaligné',
  projectId: 'mkddilwp',
  dataset: 'production',
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenu')
          .items([
            S.listItem()
              .title('Page Accueil')
              .child(S.document().schemaType('pageAccueil').documentId('pageAccueil')),
            S.listItem()
              .title('Page À propos')
              .child(S.document().schemaType('pageAPropos').documentId('pageAPropos')),
            S.listItem()
              .title('Page Services')
              .child(S.document().schemaType('pageServices').documentId('pageServices')),
            S.listItem()
              .title('Page Réalisations')
              .child(S.document().schemaType('pageRealisations').documentId('pageRealisations')),
            S.listItem()
              .title('Page Contact')
              .child(S.document().schemaType('pageContact').documentId('pageContact')),
            S.listItem()
              .title('Footer')
              .child(S.document().schemaType('footer').documentId('footer')),
            S.documentTypeListItem('realisation').title('Réalisations'),
          ]),
    }),
  ],
  tools: (prev) => {
    // Ouvrir "Structure" (Contenu) par défaut au lieu de Releases
    const structure = prev.find((t) => t.name === 'structure')
    const rest = prev.filter((t) => t.name !== 'structure')
    return structure ? [structure, ...rest] : prev
  },
})
