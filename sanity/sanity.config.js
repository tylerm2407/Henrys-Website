import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {muxInput} from 'sanity-plugin-mux-input'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Gannoe Media',
  projectId: 'cwyreh3g',
  dataset: 'production',
  // muxInput() adds drag-and-drop video upload backed by Mux streaming.
  // The Mux API token is entered ONCE inside the Studio (Mux settings panel),
  // never in code or in the public site.
  plugins: [structureTool(), visionTool(), muxInput()],
  schema: {types: schemaTypes},
})
