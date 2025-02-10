import path from "path"
import { stripSlashes, simplifySlug, resolveRelative, SimpleSlug, FullSlug } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { getDate, formatDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"
import { Data } from "vfile"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

export function byDateAndAlphabetical(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

type Props = {
  limit?: number
  sort?: SortFn
} & QuartzComponentProps


export const PageList: QuartzComponent = ({ cfg, fileData, allFiles, limit, sort }: Props) => {
  const sorter = sort ?? byDateAndAlphabetical(cfg)
  let list = allFiles.sort(sorter)
  if (limit) {
    list = list.slice(0, limit)
  }

  function countChildPages(folder: Data) {
    const folderSlug = stripSlashes(simplifySlug(folder.slug!))
    return allFiles.filter((file) => {
      const fileSlug = stripSlashes(simplifySlug(file.slug!))
      const prefixed = fileSlug.startsWith(folderSlug) && fileSlug !== folderSlug
      const folderParts = folderSlug.split(path.posix.sep)
      const fileParts = fileSlug.split(path.posix.sep)
      const isDirectChild = fileParts.length === folderParts.length + 1
      return prefixed && isDirectChild
    })
  }

  return (
    <ul class="section-ul">
      {list.map((page: Data) => {
        const children = countChildPages(page);
        let pagedate:string = ""
        if (page.dates) {
          pagedate = formatDate(getDate(cfg, page)!, cfg.locale)
        }
        const title = page.frontmatter?.title
        const tags = page.frontmatter?.tags ?? []
        const page_class = page.frontmatter?.page_class
        const description = page.description
        const images = (page_class === "photo" || page_class === "album" )
        return (
          <li class="section-li">
            <hr/>
            <div class="desc">
              <div style="float:right">
                <small>{pagedate}</small>
              </div>
              <h3>
                <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                  {title}
                </a>
              </h3>
              
              {images ? (
                <p style="hyphens:none">
                  <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                    <img src={resolveRelative(fileData.slug!, "photos/"+page.frontmatter?.thumbnail as SimpleSlug)} style="float:left; margin-top:0; margin-right:1rem;"/>
                  </a> {description}
                </p>
                ) : (
                  <p>
                    {description}
                </p>
              )}
            </div>
            <ul class="tags">
                {tags.filter((tag) => tag != fileData.slug?.split("tags/")[1]).map((tag) => (                  
                  <li>
                    <a
                      class="internal tag-link"
                      href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                    >
                      {tag} <i class="nf nf-oct-tag"></i>
                    </a>
                  </li>
                ))}
              </ul>
          </li>
        )
      })}
    </ul>
  )
}

PageList.css = `
.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}
`
