import { QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/listPage.scss"
import { PageList } from "../PageList"
import { FullSlug, getAllSegmentPrefixes, simplifySlug, resolveRelative } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { Root } from "hast"
import { pluralize } from "../../util/lang"
import { htmlToJsx } from "../../util/jsx"

const numPages = 10
function TagContent(props: QuartzComponentProps) {
  const { tree, fileData, allFiles } = props
  const slug = fileData.slug

  if (!(slug?.startsWith("topics/") || slug === "topics")) {
    throw new Error(`Component "TagContent" tried to render a non-tag page: ${slug}`)
  }

  const tag = simplifySlug(slug.slice("topics/".length) as FullSlug)
  const allPagesWithTag = (tag: string) =>
    allFiles.filter((file) =>
      (file.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes).includes(tag),
    )

  const content =
    (tree as Root).children.length === 0
      ? fileData.description
      : htmlToJsx(fileData.filePath!, tree)

  if (tag === "") {
    const tags = [...new Set(allFiles.flatMap((data) => data.frontmatter?.tags ?? []))]
    const tagItemMap: Map<string, QuartzPluginData[]> = new Map()
    for (const tag of tags) {
      tagItemMap.set(tag, allPagesWithTag(tag))
    }

    return (
      <div class="popover-hint">
        <article>
          <p>{content}</p>
        </article>
        <p>Found {tags.length} total topics.</p>
        <div>
          {tags.map((tag) => {
            const pages = tagItemMap.get(tag)!
            const listProps = {
              ...props,
              allFiles: pages,
            }

            const contentPage = allFiles.filter((file) => file.slug === `topics/${tag}`)[0]
            const content = contentPage?.description
            return (
              <div>
                <h2>
                  <a class="internal tag-link" href={`../tags/${tag}`}>
                    #{tag}
                  </a>
                </h2>
                {content && <p>{content}</p>}
                <p>
                  {pluralize(pages.length, "note")} on this topic.{" "}
                  {pages.length > numPages && `Showing first ${numPages}.`}
                </p>
                <PageList limit={numPages} {...listProps} />
              </div>
            )
          })}
        </div>
      </div>
    )
  } else {
    const pages = allPagesWithTag(tag)
    const listProps = {
      ...props,
      allFiles: pages,
    }

    return (
      <div class="popover-hint">
        <article>{content}</article>
        <ul class="tags">
          {fileData.frontmatter?.tags.map((tag) => (                  
            <li>
              <a
                class="internal tag-link"
                href={resolveRelative(fileData.slug!, `topics/${tag}` as FullSlug)}
              >
                <i class="fa-regular fa-message"></i>&nbsp;&nbsp;{tag}
              </a>
            </li>
          ))}
        </ul>
        <p>{pluralize(pages.length, "note")} on this topic.</p>
        <div>
          <PageList {...listProps} />
        </div>
      </div>
    )
  }
}

TagContent.css = style + PageList.css
export default (() => TagContent) satisfies QuartzComponentConstructor