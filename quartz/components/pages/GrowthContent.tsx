import { QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { Fragment, jsx, jsxs } from "preact/jsx-runtime"
import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import style from "../styles/listPage.scss"
import { PageList } from "../PageList"
import { FullSlug, getAllSegmentPrefixes, simplifySlug, resolveRelative } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { Root } from "hast"
import { pluralize } from "../../util/lang"

const numPages = 10
function GrowthContent(props: QuartzComponentProps) {
  const { tree, fileData, allFiles } = props
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
      : // @ts-ignore
        toJsxRuntime(tree, { Fragment, jsx, jsxs, elementAttributeNameCase: "html" })

  if (growth === "") {
    // Most likely this is the index page
    const growths = [...new Set(allFiles.flatMap((data) => data.frontmatter?.growth ?? []))]
    const growthItemMap: Map<string, QuartzPluginData[]> = new Map()
    for (const growth of growths) {
        growthItemMap.set(growth, allPagesWithGrowth(growth))
    }
    
    return (
      <div class="popover-hint">
        <article>
          <p>{content}</p>
        </article>
        <p>Found {pluralize(growths.length, "level")} of maturity.</p>
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
                {/* <p>
                  {pluralize(pages.length, "item")} at this stage of growth.{" "}
                  {pages.length > numPages && `Showing first ${numPages}.`}
                </p>
                <PageList limit={numPages} {...listProps} /> */}
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
        <p>{pluralize(pages.length, "note")} at this stage of growth.</p>
        <div>
          <PageList {...listProps} />
        </div>
      </div>
    )
  }
}

GrowthContent.css = style + PageList.css
export default (() => GrowthContent) satisfies QuartzComponentConstructor