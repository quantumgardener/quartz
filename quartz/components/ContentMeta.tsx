import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"

export default (() => {
  function ContentMetadata({ cfg, fileData }: QuartzComponentProps) {
    const text = fileData.text
    if (text) {
      const segments: string[] = []
      const { text: timeTaken, words: _words } = readingTime(text)
      const growth = fileData.frontmatter?.growth ?? "seedling" 
      
      let faIcon = ""
      
      switch(growth.toLowerCase()) {
        case "seedling":
          faIcon = "seedling"
          break
        case "budding":
          faIcon = "leaf"
          break
        case "evergreen":
          faIcon = "tree"
          break
      }
  
      const growthClass = "fa-solid fa-" + faIcon
      const growthLink = `/${growth}.html`
      
      /*if (fileData.dates) {
        segments.push("planted " + formatDate(getDate(cfg, fileData)!))
        if (fileData.dates.created.getTime() < fileData.dates.published.getTime()) {
          segments.push(" last tended " + formatDate(fileData.dates.published)!)
        }
      } */

      return (
        <div class="popover-hint">
        <p class="content-meta">
          <article>
          <i style="color:green" class={growthClass}></i> <a href={growthLink}>{growth.toUpperCase()}</a> | {segments.join(" | ")}
          </article>
        </p>
        </div>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = `
  .content-meta {
    margin-top: 0;
    color: var(--gray);
  }
  `
  return ContentMetadata
}) satisfies QuartzComponentConstructor
