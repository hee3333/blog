
import type { QuartzComponent } from "./types"
import { resolveRelative, slugTag } from "../util/path"
import type { FullSlug } from "../util/path"

const TagCloud: QuartzComponent = ({ allFiles, fileData }) => {
  const counts = new Map<string, number>()

  for (const file of allFiles) {
    const rawTags = file.frontmatter?.tags
    const tags =
      typeof rawTags === "string"
        ? [rawTags]
        : Array.isArray(rawTags)
          ? rawTags.filter((tag): tag is string => typeof tag === "string")
          : []

    for (const tag of tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }

  const tags = [...counts.entries()].sort(
    ([nameA, countA], [nameB, countB]) =>
      countB - countA || nameA.localeCompare(nameB),
  )

  return (
    <section class="tag-cloud">
      <h3>태그 모음</h3>
      <div class="tag-cloud-list">
        {tags.map(([tag, count]) => {
          const target = `tags/${slugTag(tag)}` as FullSlug
          const href = resolveRelative(fileData.slug!, target)

          return (
            <a class="tag-cloud-item" href={href}>
              <span>#{tag}</span>
              <small>{count}</small>
            </a>
          )
        })}
      </div>
    </section>
  )
}

export default TagCloud
