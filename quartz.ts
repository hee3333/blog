import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import TagCloud from "./quartz/components/TagCloud"

const config = await loadQuartzConfig()
export default config

const currentLayout = await loadQuartzLayout()

const byPageType = Object.fromEntries(
  Object.entries(currentLayout.byPageType).map(([pageType, pageLayout]) => [
    pageType,
    {
      ...pageLayout,
      right: [
        ...(pageLayout.right ?? currentLayout.defaults?.right ?? []),
        TagCloud,
      ],
    },
  ]),
)

export const layout = {
  ...currentLayout,
  defaults: {
    ...currentLayout.defaults,
    right: [...(currentLayout.defaults?.right ?? []), TagCloud],
  },
  byPageType,
}
