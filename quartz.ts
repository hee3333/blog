import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import TagCloud from "./quartz/components/TagCloud"

const config = await loadQuartzConfig()
export default config

const currentLayout = await loadQuartzLayout()

const folderPageLayout = currentLayout.byPageType.folder ?? {}
const folderRight = folderPageLayout.right?.length
  ? folderPageLayout.right
  : currentLayout.defaults?.right ?? []

const byPageType = {
  ...currentLayout.byPageType,
  folder: {
    ...folderPageLayout,
    right: [...folderRight, TagCloud],
  },
}

export const layout = {
  ...currentLayout,
  defaults: {
    ...currentLayout.defaults,
    right: [...(currentLayout.defaults?.right ?? []), TagCloud],
  },
  byPageType,
}
