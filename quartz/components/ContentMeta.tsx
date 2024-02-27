import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

export default (() => {
  function ContentMetadata({ cfg, fileData, displayClass, allFiles }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: string[] = []
      const { text: timeTaken, words: _words } = readingTime(text)

      let growth = ""
      if( fileData.frontmatter?.growth != null) {
        // We have a value in the form [[Growth]]
        growth = fileData.frontmatter?.growth.slice(2,-2).toLowerCase()
      } else {
        // Assume seedling if not specified
        growth = "seedling"
      }

      let faIcon = ""
       
      console.log(growth)
      switch(growth) {
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
      const growthLink = `/maturity/${growth}.html`
      
      /*if (fileData.dates) {
        segments.push("planted " + formatDate(getDate(cfg, fileData)!))
        if (fileData.dates.created.getTime() < fileData.dates.published.getTime()) {
          segments.push(" last tended " + formatDate(fileData.dates.published)!)
        }
      } */


      const landscapeLinks = []
      if( fileData.frontmatter?.landscapes != null) {
        for (const landscape of fileData.frontmatter?.landscapes) {
          const result = allFiles.find(item => item.slug === `landscapes/${landscape}`)

          landscapeLinks.push([`/landscapes/${landscape}`, result?.frontmatter?.title.toUpperCase()])
        }
      }

      return (
        <div class="popover-hint">
        <p class="content-meta">
          <article>
            <ul class="tags">
              <li><i style="color:green" class={growthClass}></i> <a class="internal tag-link" href={growthLink}>{growth.toUpperCase()}</a></li>
           {landscapeLinks.map((link) => {
            return (
              <li>
                &nbsp;&nbsp;<i style="color:#5C4033" class="fa-solid fa-mountain-sun"></i>&nbsp;
                <a class="internal tag-link" href={link[0]}>{link[1]}</a> 
              </li>
            )
            })
          }
            </ul>
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
