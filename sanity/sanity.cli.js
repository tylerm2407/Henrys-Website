import {defineCliConfig} from 'sanity/cli'

// `npm run deploy` publishes the Studio to https://gannoemedia.sanity.studio
export default defineCliConfig({
  api: {projectId: 'cwyreh3g', dataset: 'production'},
  studioHost: 'gannoemedia',
})
