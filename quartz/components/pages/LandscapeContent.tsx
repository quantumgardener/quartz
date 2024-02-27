import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/listPage.scss"
import { PageList } from "../PageList"
import { FullSlug, getAllSegmentPrefixes, simplifySlug, resolveRelative } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"

const numPages = 10
function LandscapeContent(props: QuartzComponentProps) {
  const { tree, fileData, allFiles, cfg } = props
  const slug = fileData.slug
  
  if (!(slug?.startsWith("landscapes/") || slug === "landscapes")) {
    throw new Error(`Component "LandscapeContent" tried to render a non-landscape page: ${slug}`)
  }

  const landscape = simplifySlug(slug.slice("landscapes/".length) as FullSlug)
  const allPagesWithLandscape = (landscape: string) =>
    allFiles.filter((file) =>
      (file.frontmatter?.landscapes ?? []).flatMap(getAllSegmentPrefixes).includes(landscape),
    )

  const content =
    (tree as Root).children.length === 0
      ? fileData.description
      : htmlToJsx(fileData.filePath!, tree)
  const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
  const classes = ["popover-hint", ...cssClasses].join(" ")

  if (landscape === "/" || slug.slice(-6) == "/index") {
    const landscapes = [
      ...new Set(
        allFiles.flatMap((data) => data.frontmatter?.landscapes ?? []).flatMap(getAllSegmentPrefixes),
      ),
    ].sort((a, b) => a.localeCompare(b))
    const landscapeItemMap: Map<string, QuartzPluginData[]> = new Map()
    for (const landscape of landscapes) {
        landscapeItemMap.set(landscape, allPagesWithLandscape(landscape))
    }
    
    return (
      <div class={classes}>
        <article>
          <p>{content}</p>
        </article>
        <p>{i18n(cfg.locale).pages.landscapeContent.totalTags({ count: landscapes.length })}</p>
        <hr/>
        <div>
          {landscapes.map((landscape) => {
            const pages = landscapeItemMap.get(landscape)!
            const listProps = {
              ...props,
              allFiles: pages,
            }

            const contentPage = allFiles.filter((file) => file.slug === `landscapes/${landscape}`)[0]
            const content = contentPage?.description
            const title = contentPage?.frontmatter?.title
            return (
              <div>
                <h2>
                  <a class="internal tag-link" href={`/landscapes/${landscape}`}>
                    {title}
                  </a>
                </h2>
                {content && <p>{content}</p>}
                <div class="page-listing">
                  <p>
                    {i18n(cfg.locale).pages.landscapeContent.itemsUnderTag({ count: pages.length })}
                    {pages.length > numPages && (
                      <>
                        {" "}
                        <span>
                          {i18n(cfg.locale).pages.landscapeContent.showingFirst({ count: numPages })}
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
    const pages = allPagesWithLandscape(landscape)
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
        </ul> */}
        <div class="page-listing">
          <p>{i18n(cfg.locale).pages.landscapeContent.itemsUnderTag({ count: pages.length })}</p>
          <div>
            <PageList {...listProps} />
          </div>
        </div>
      </div>
    )
  }
}

LandscapeContent.css = style + PageList.css
export default (() => LandscapeContent) satisfies QuartzComponentConstructor