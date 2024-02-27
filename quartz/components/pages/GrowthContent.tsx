import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/listPage.scss"
import { PageList } from "../PageList"
import { FullSlug, getAllSegmentPrefixes, simplifySlug, resolveRelative } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"

const numPages = 10
function GrowthContent(props: QuartzComponentProps) {
  const { tree, fileData, allFiles, cfg } = props
  const slug = fileData.slug
  
  if (!(slug?.startsWith("maturity/") || slug === "maturity")) {
    throw new Error(`Component "GrowthContent" tried to render a non-growth page: ${slug}`)
  }

  const growth = simplifySlug(slug.slice("maturity/".length) as FullSlug)
  const allPagesWithGrowth = (growth: string) =>
  allFiles.filter((file) => {
    const x = file.frontmatter?.growth ? [file.frontmatter.growth] : []
    return ( (x ?? []).flatMap(getAllSegmentPrefixes).includes(growth))
  })
  const content =
    (tree as Root).children.length === 0
      ? fileData.description
      : htmlToJsx(fileData.filePath!, tree)
      const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
      const classes = ["popover-hint", ...cssClasses].join(" ")
   

    if (growth === "" || slug.slice(-6) == "/index") {
    // Most likely this is the index page
    const growths = [
      ...new Set(
        allFiles.flatMap((data) => data.frontmatter?.growth ?? []).flatMap(getAllSegmentPrefixes),
      ),
    ].sort((a, b) => a.localeCompare(b))
    const growthItemMap: Map<string, QuartzPluginData[]> = new Map()
    for (const growth of growths) {
        growthItemMap.set(growth, allPagesWithGrowth(growth))
    }

    return (
      <div class={classes}>
        <article>
          <p>{content}</p>
        </article>
        <hr/>
        <p>{i18n(cfg.locale).pages.growthContent.totalTags({ count: growths.length })}</p>
                <div>
          {growths.map((growth) => {
            const pages = growthItemMap.get(growth)!
            const listProps = {
              ...props,
              allFiles: pages,
            }

            const contentPage = allFiles.filter((file) => file.slug === `maturity/${growth}`)[0]
            const content = contentPage?.description
            const title = contentPage?.frontmatter?.title
            return (
              <div>
                <h2>
                  <a class="internal tag-link" href={`/maturity/${growth}`}>
                    {title}
                  </a>
                </h2>
                {content && <p>{content}</p>}
                <div class="page-listing">
                  <p>
                    {i18n(cfg.locale).pages.tagContent.itemsUnderTag({ count: pages.length })}
                    {pages.length > numPages && (
                      <>
                        {" "}
                        <span>
                          {i18n(cfg.locale).pages.tagContent.showingFirst({ count: numPages })}
                        </span>
                      </>
                    )}
                  </p>
                  <PageList limit={numPages} {...listProps} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  } else {
    const pages = allPagesWithGrowth(growth)
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
                  href={resolveRelative(fileData.slug!, `topics/${tag}` as FullSlug)}
                >
                  <i class="fa-regular fa-message"></i>&nbsp;&nbsp;{tag}
                </a>
              </li>
            ))}
        </ul>
        <div> */}
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

GrowthContent.css = style + PageList.css
export default (() => GrowthContent) satisfies QuartzComponentConstructor