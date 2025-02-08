import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/listPage.scss"
import { PageList, SortFn } from "../PageList"
import { FullSlug, getAllSegmentPrefixes, simplifySlug } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"

interface TagContentOptions {
  sort?: SortFn
  numPages: number
}

const defaultOptions: TagContentOptions = {
  numPages: 10,
}

export default ((opts?: Partial<TagContentOptions>) => {
  const options: TagContentOptions = { ...defaultOptions, ...opts }

  const TagContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props
    const slug = fileData.slug

  if (!(slug?.startsWith("tags/") || slug === "tags")) {
    throw new Error(`Component "TagContent" tried to render a non-tag page: ${slug}`)
  }

  const tag = simplifySlug(slug.slice("tags/".length) as FullSlug)
  const allPagesWithTag = (tag: string) =>
    allFiles.filter((file) =>
      (file.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes).includes(tag),
    )

  const content =
    (tree as Root).children.length === 0
      ? fileData.description
      : htmlToJsx(fileData.filePath!, tree)
  const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
  const classes = ["popover-hint", ...cssClasses].join(" ")
  if (tag === "/") {
    const tags = [
      ...new Set(
        allFiles.flatMap((data) => data.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes),
      ),
    ].sort((a, b) => a.localeCompare(b))
    const tagItemMap: Map<string, QuartzPluginData[]> = new Map()
    for (const tag of tags) {
      tagItemMap.set(tag, allPagesWithTag(tag))
    }

    return (
      <div class={classes}>
        <article>
          <p>{content}</p>
        </article>
        <p>{i18n(cfg.locale).pages.tagContent.totalTags({ count: tags.length })}</p>
        <hr/>
        <ul class="tags">
          {tags.map((tag) => {
            // if (tag.startsWith("class") && tag !== "class/photo") {
            //   return null
            // }

            return (
              <li>
                <a class="internal tag-link" href={`../tags/${tag}`}>
                  {tag} <i class="nf nf-oct-tag"></i> ({allPagesWithTag(tag).length})
                </a>
              </li>
            )
            })}
          </ul>
        </div>
      )
    } else {
      const pages = allPagesWithTag(tag)
      const listProps = {
        ...props,
        allFiles: pages,
      }

    return (
      <div class={classes}>
        <article>{content}</article>
        {/* <ul class="tags">
          {fileData.frontmatter?.tags.map((tag) => (                  
            <li>
              <a
                class="internal tag-link"
                href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
              >
                <i class="fa-regular fa-message"></i>&nbsp;&nbsp;{tag}
              </a>
            </li>
          ))}
        </ul> */}
        <div class="page-listing">
          <p>{i18n(cfg.locale).pages.tagContent.itemsUnderTag({ count: pages.length })}</p>
          <div>
            <PageList {...listProps} />
          </div>
        </div>
      </div>
      )
    }
  }

  TagContent.css = style + PageList.css
  return TagContent
}) satisfies QuartzComponentConstructor