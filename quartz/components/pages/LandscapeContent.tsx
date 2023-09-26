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
function LandscapeContent(props: QuartzComponentProps) {
  const { tree, fileData, allFiles } = props
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
      : // @ts-ignore
        toJsxRuntime(tree, { Fragment, jsx, jsxs, elementAttributeNameCase: "html" })

  if (landscape === "") {
    // Most likely this is the index page
    const landscapes = [...new Set(allFiles.flatMap((data) => data.frontmatter?.landscapes ?? []))]
    const landscapeItemMap: Map<string, QuartzPluginData[]> = new Map()
    for (const landscape of landscapes) {
        landscapeItemMap.set(landscape, allPagesWithLandscape(landscape))
    }
    
    return (
      <div class="popover-hint">
        <article>
          <p>{content}</p>
        </article>
        <p>Found {landscapes.length} total dddddlandscapes.</p>
        <div>
          {landscapes.map((landscape) => {
            const pages = landscapeItemMap.get(landscape)!
            const listProps = {
              ...props,
              allFiles: pages,
            }

            const contentPage = allFiles.filter((file) => file.slug === `landscapes/${landscape}`)[0]
            const content = contentPage?.description
            return (
              <div>
                <h2>
                  <a class="internal tag-link" href={`./${landscape}`}>
                    #{landscape}
                  </a>
                </h2>
                {content && <p>{content}</p>}
                <p>
                  {pluralize(pages.length, "item")} in this landscape.{" "}
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
    const pages = allPagesWithLandscape(landscape)
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
        <p>{pluralize(pages.length, "item")} in this landscape.</p>
        <div>
          <PageList {...listProps} />
        </div>
      </div>
    )
  }
}

LandscapeContent.css = style + PageList.css
export default (() => LandscapeContent) satisfies QuartzComponentConstructor