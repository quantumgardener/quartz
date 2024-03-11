import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"


interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
  showDate: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
  showDate: true
}

function growthHTML(growth:string, growthClass:string, growthLink:string) {
  return (
    <span>
      <a class="internal tag-link" href={growthLink}><i style="color:green" class={growthClass}></i> {growth.toUpperCase()}</a>
    </span>
  )
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass, allFiles }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates && options.showDate) {
        segments.push(formatDate(getDate(cfg, fileData)!, cfg.locale))
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(displayedTime)
      }

      // Start of my changes

      let growth = ""
      if( fileData.frontmatter?.growth != null) {
        // We have a value in the form [[Growth]]
        growth = fileData.frontmatter?.growth.slice(2,-2).toLowerCase()
      } else {
        // Assume seedling if not specified
        growth = "seedling"
      }

      let faIcon = ""

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

      segments.push(growthHTML(
        growth,
        growthClass,
        growthLink
      ))

      // End of my changes

      const segmentsElements = segments.map((segment) => <span>{segment}</span>)

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segmentsElements}
        </p>
      )
    } else {
      return null
    }

      
    //   const landscapeLinks = []
    //   if( fileData.frontmatter?.landscapes != null) {
    //     for (const landscape of fileData.frontmatter?.landscapes) {
    //       const result = allFiles.find(item => item.slug === `landscapes/${landscape}`)

    //       landscapeLinks.push([`/landscapes/${landscape}`, result?.frontmatter?.title.toUpperCase()])
    //     }
    //   }

    //   return (
    //     <div class="popover-hint">
    //     <p class="content-meta">
    //       <article>
    //         <ul class="tags">
    //           <li><i style="color:green" class={growthClass}></i> <a class="internal tag-link" href={growthLink}>{growth.toUpperCase()}</a></li>
    //        {landscapeLinks.map((link) => {
    //         return (
    //           <li>
    //             &nbsp;&nbsp;<i style="color:#5C4033" class="fa-solid fa-mountain-sun"></i>&nbsp;
    //             <a class="internal tag-link" href={link[0]}>{link[1]}</a> 
    //           </li>
    //         )
    //         })
    //       }
    //         </ul>
    //       </article>
    //     </p>
    //     </div>
    //   )
    // } else {
    //   return null
    // }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
